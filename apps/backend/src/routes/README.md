# Route Development Guidelines

## Initial Setup
Inherit `RouteHandle` class and export it
```ts
import { RouteHandle } from ".";
export class someName extends RouteHandle {}
```

## Setup Method
as part of the abstract requirement, all routes class requireds `setup` method, which just contains webserver URI binding.
Example:
```ts
import { RouteHandle } from ".";
import type { Request, Response } from "express";

export class someName extends RouteHandle {
  public setup() {
    this.webServer.get("/", this.HelloWorld.bind(this))
  }

  private HelloWorld(req: Request, res: Response) {
    res.send("Hello World! :3");
  }
}
```
You may notice couple details:
1. The route handle is set to private - the setup should bind all the calls to the web server (Express), so there's zero need for those methods to be accessed outside of the class
2. the private method is called with `bind(this)` before being passed to the webServer - This is very important because once the function is passed, the parent context (this) will be gone and change to the webServer.get context. Binding it will force the parent context to stay.

## Available Class `coreSrv` methods/field for route operations
The following fields CoreService `this.coreSrv` are available for your webserver route to use:

1. `this.coreSrv.webServer` - This exposes the express webServer under CoreService directly. Use this to bind routes
2. `this.coreSrv.database` - This exposes appropropriate mongoDB database for you to run operations on. It abstracts: `this._mongoCli.db(isProd ? 'Olympull' : 'Olympull_dev')` (which are not available outside of CoreService nor should it ever be needed)
3. just kidding, **do not** use the `this.coreSrv.setup()` function anywhere outside of the one under `src/index.ts`

## Request/Response Generics
`import type { Request, Response } from "express";` both Request and Response from this export contains generic and should be customized based on what's used
- For Request, the generics are `<Param, void, Body, Query, void>`
    - Param - This is used to get the values for the URI parameters. This only applies to method that uses URI parameter.
    - void - Do not use, these types are for Response, but somehow inherited in the Request object...
    - Body - The expected data to receive by the body. Remember, typescript only checks for type during transpiling step. It DOES NOT validate user input, so make sure the code do that. (ex: if the type is not optional, user may tamper with the request and leave it optional, which would break the execution logic)
    - Query - Query string in the URI `/Path?QueryA=ValueA&QueryB=ValueB`. Same thing as body, the user can tamper with the data and cause the runtime to break.
- For Response, the generics are `<Body, Local>`
    - Body - This is the response body, not too much of an issue like Request body.
    - Local - this is used to pass internal data around middleware, all the way to the last main logic execution. For example, your auth middleware can pass userID to your main route logic if the authentication is valid.

## HTTP Method/Status Compliant
It's best practice to have a matching HTTP REQUEST based on the action type and returning an appropriate response code. Below explains all the HTTP method and some common status that you'll most likely encounter

### HTTP Methods
- GET - This method is used when request involves retrieving any sort of data
- POST - This method is used when creating new resource or data within the database or CDN (exception: When 'GET' request requires a body submission, such as login)
- PUT - This method is used when updating an entire content within database or CDN. This will almost never be used in most circumstances (see `PATCH`)
- PATCH - This method is used when only updating part of a given content in a database/CDN. This is used for things like user data update.
- DELETE - This method is used to remove resource from the database or CDN

### Status Code
Listed are the most likely status code we'll encounter. The remaining status (such as 3xx and the rest of the given codes in the listed family) are good to know but may not be necessarily used.
#### Success (2xx)
- `200` - When request operation is successful (default status code for Express)
- `201` - When the given resource is created and require a URI locator for the new resource
- `204` - When request is processed but no response is necessary

#### Client Error (4xx)
- `400` - Default bad client request (such as malformed body data)
- `401` - When a resource is inaccessible due to lack of authorization (in other word, user identification or login is required to access the resource)
- `403` - When a resource is inaccessible for a given user (i.e. currently authenticated user is not authorized to access the said resource)
- `404` - The given user request is not found
- `422` - Body resource is formatted correctly, but resource cannot be processed (such as a valid JSON data with missing required key)

#### Server Error (5xx)
- `500` - Default server error (usually unexpected error, such as code throwing exceptions)

## URI Parameters vs Query Usages
When searching or updating certain data, there must be a way to correctly identify which resource is needed to be looked up or updated, and those two are the most common way to achieve it.
- Paramter (`/path/:Param/more/:Data`) - In this case, `:Param` and `:Data` is the paramter. This is commonly used to supply a unique identifier to the server to perform operation (such as index key or `_id`, in mongo).
  - For example, when performing a `GET /user/0000-000000-0000000-000000000`, the server will pull up user information based on the given user id: `0000-000000-0000000-000000000`. When performing a `PATCH` request, the changes will be modify on that user. Same applies with `DELETE` method
- Query (`/path?Key=Value&Key2=Value2`)  - In this case, `Key` and `Key2` is the query. This usually serves as a filter for user data lookup.
  - For example, when performing a `GET /user?minCredits=10`, the server will return all the users that have at least `10` credits on their account.
- It is possible to use both param, but in this case, it's usually used to filter and pull a lists owned by the given user.
  - For example, when performing `GET /users/:id/cards?ownedBy=[Date]`, it will attempt to return all the cards that are owned by the user `:id` after the given `[Date]`.
  - Using the query directly under the parameter is also possible (ex: `/users/:id?query=value`), but not recommended in most cases.

## Logging


## Final setup
Make sure to expot it and load the route in the main file.
1. Add `export { ClassName } from "./FileName";` under and on the bottom of `src/routes/index.ts`
2. Add the exported class name to `src/index.ts` where it imports from `./routes` and add the imported name under `MainService.setup` array.

Example:
```ts
// Some top code...
import {
  Main,
  ...,
  YourNewClassName
} from "./routes";

// Some middle code...

const MainService = new CoreService();
MainService.setup([
  Main,
  ...,
  YourNewClassName
]);

// Some bottom code...
```