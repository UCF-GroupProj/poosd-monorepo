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


## Final setup
Make sure to export it and load the route in the main file.
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