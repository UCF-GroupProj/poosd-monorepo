import Express, { type Express as ExpType } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { RouteHandle } from "./routes";
import { logger, setupExpressErrorHandler } from "@sentry/node";

export class CoreService {
  private _webServer: ExpType;
  private _mongoCli: MongoClient;

  constructor() {
    this._webServer = Express();

    // MongoDB setup
    const mongoConnStr = process.env["MONGO_CONN"];
    if(!mongoConnStr) throw new CoreServiceExcept("Missing MONGO_CONN env variable");
    this._mongoCli = new MongoClient(mongoConnStr, { serverApi: ServerApiVersion.v1 });
  }

  public async setup(routes: (new(service: CoreService) => RouteHandle)[]) {
    // Setup MongoDB conns
    await this._mongoCli.connect();

    // Handle Route Stuff
    for(const route of routes) {
      const routeObj = new route(this);
      const path = routeObj.path.endsWith('/') ? routeObj.path.slice(0,-1) : routeObj.path;
      const router = this._webServer.route(path);

      // Setup get route
      if(routeObj.get)
        router.get(...(routeObj?.middlewares?.get ?
          [routeObj.middlewares.get, routeObj.get] :
          [routeObj.get]
        ));

      // Setup post route
      if(routeObj.post)
        router.post(...(routeObj?.middlewares?.post ?
          [routeObj.middlewares.post, routeObj.post] :
          [routeObj.post]
        ));

      // Setup put route
      if(routeObj.put)
        router.put(...(routeObj?.middlewares?.put ?
          [routeObj.middlewares.put, routeObj.put] :
          [routeObj.put]
        ));

      // Setup patch route
      if(routeObj.patch)
        router.delete(...(routeObj?.middlewares?.patch ?
          [routeObj.middlewares.patch, routeObj.patch] :
          [routeObj.patch]
        ));

      // Setup delete route
      if(routeObj.delete)
        router.delete(...(routeObj?.middlewares?.delete ?
          [routeObj.middlewares.delete, routeObj.delete] :
          [routeObj.delete]
        ));

      // Hook param methods
      if(routeObj.paramPath) {
        const pPath = routeObj.paramPath;

        if(pPath.get && routeObj.getParam)
          this._webServer.get(
            `${path}/${pPath.get.startsWith('/') ? pPath.get.slice(1) : pPath.get}`,
            ...(routeObj?.middlewares?.get ?
              [routeObj.middlewares.get, routeObj.getParam] :
              [routeObj.getParam])
          );

        if(pPath.post && routeObj.postParam)
          this._webServer.post(
            `${path}/${pPath.post.startsWith('/') ? pPath.post.slice(1) : pPath.post}`,
            ...(routeObj?.middlewares?.post ?
              [routeObj.middlewares.post, routeObj.postParam] :
              [routeObj.postParam])
          );

        if(pPath.put && routeObj.putParam)
          this._webServer.put(
            `${path}/${pPath.put.startsWith('/') ? pPath.put.slice(1) : pPath.put}`,
            ...(routeObj?.middlewares?.put ?
              [routeObj.middlewares.put, routeObj.putParam] :
              [routeObj.putParam])
          );

        if(pPath.patch && routeObj.patchParam)
          this._webServer.patch(
            `${path}/${pPath.patch.startsWith('/') ? pPath.patch.slice(1) : pPath.patch}`,
            ...(routeObj?.middlewares?.patch ?
              [routeObj.middlewares.patch, routeObj.patchParam] :
              [routeObj.patchParam])
          );

        if(pPath.delete && routeObj.deleteParam)
          this._webServer.delete(
            `${path}/${pPath.delete.startsWith('/') ? pPath.delete.slice(1) : pPath.delete}`,
            ...(routeObj?.middlewares?.delete ?
              [routeObj.middlewares.delete, routeObj.deleteParam] :
              [routeObj.deleteParam])
          );
      }
    }

    // Prepare startup
    setupExpressErrorHandler(this._webServer);
    const port = process.env["PORT"] ?? 8080;
    this._webServer.listen(port, ()=>logger.info(logger.fmt`Running Webserver on port: ${port}`));
  }

  get webServer() {
    return this._webServer;
  }

  get database() {
    const isProd = process.env["ENVIRONMENT"] === "prod";
    return this._mongoCli.db(isProd ? 'Olympull' : 'Olympull_dev');
  }
}

class CoreServiceExcept extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CoreService Error";
  }
}