# Route Development Guidelines

## Initial Setup
Inherit `RouteHandle` class and export it
```ts
import { RouteHandle } from ".";
export class someName {}
```

## Class Type References
For more details, visit `src/routes/index.ts`.

### Difference between regular and param method
In the abstract class, you may see methods like `get` and `getParam` (and so on for other HTTP methods). The difference is that, one uses parameter based URI and other dont.

Example:
```ts
import { RouteHandle } from ".";
import type { Request, Response } from "express";
export class someName {
  public readonly path = "/groups";
  public paramPath = {
    get: ":gid"
  };

  get(req: Request, res: Response) {
    // @Action: Pull all group details
  }

  getParam(req: Request<{gid: string, uid: string}>, res: Response) {
    const groupID = req.params.gid;
    // @Action: Pull one specific group detail
  }
}
```
In this case, assume you're authenticated, a `GET /groups/` would pull all the group detail owned by the user while `GET /groups/19` would only pull group 19 information (assuming the user has permission to do so)

#### Limitation
Only one type of param per method can be configured at a time. So if you configured `/groups/:gid` then you cant also configure `/groups/:gid/user/:uid`. You can, however, configure either one.

For our use case, one should sufficient, but if we encounter exception, I'll design a seperate solution.

### Middleware
Middleware is the code that's executed before reaching your main handle code. This is useful for things like body decoding or user authentication/authorization.

#### Limitation
To reduce the class's complexity, routes will be shared by both the regular and parameter route.

Example:
```ts
import { RouteHandle } from ".";
import { SomeAuthMiddleWare } from "../SomeFakeAuthHandler"
import type { Request, Response } from "express";
export class someName {
  public readonly path = "/groups";
  public middlewares = {
    get: [SomeAuthMiddleWare]
  }
  public paramPath = {
    get: ":gid"
  };

  get(req: Request, res: Response) {
    // @Action: Pull all group details
  }

  getParam(req: Request<{gid: string, uid: string}>, res: Response) {
    const groupID = req.params.gid;
    // @Action: Pull one specific group detail
  }
}
```
The middleware `SomeAuthMiddleWare` would be run before `get` and `getParam` would be run. This shouldn't be a big issue as well, but exceptional design can be made if needed.

### Request/Response Generics
`import type { Request, Response } from "express";` both Request and Response from this export contains generic and should be customized based on what's used
- For Request, the generics are `<Param, void, Body, Query, void>`
    - Param - This is used to get the values for the URI parameters. This only applies to method functions with `Param` at the end.
    - void - Do not use, these types are for Response, but somehow inherited in the Request object...
    - Body - The expected data to receive by the body. Remember, typescript only checks for type during transpiling step. It DOES NOT validate user input, so make sure the code do that. (ex: if the type is not optional, user may tamper with the request and leave it optional, which would break the execution logic)
    - Query - Query string in the URI `/Path?QueryA=ValueA&QueryB=ValueB`. Same thing as body, the user can tamper with the data and cause the runtime to break.
- For Response, the generics are `<Body, Local>`
    - Body - This is the response body, not too much of an issue like Request body.
    - Local - this is used to pass internal data around middleware, all the way to the last main logic execution. For example, your auth middleware can pass userID to your main route logic if the authentication is valid.


## Final setup
Make sure to expot it and load the route in the main file.
1. Add `export { ClassName } from "./FileName";` under and on the bottom of `src/routes/index.ts`
2. Add the exported class name to `src/index.ts` where it imports from `./routes` and add the imported name under `MainService.setup` array.

Example:
```ts
// Some top code...
import {
  Main.
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