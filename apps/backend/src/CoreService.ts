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
      const router = this._webServer.route(routeObj.path);

      // Setup get route
      if(routeObj.get) {
        const middleWare = routeObj?.middlewares?.get;
        if(middleWare)
          middleWare.push(routeObj.get);
        if(!routeObj.getParamPath) router.get(...(routeObj?.middlewares?.get ?? [routeObj.get]));
        else this._webServer.get(routeObj.getParamPath, ...(routeObj?.middlewares?.get ?? [routeObj.get]));
      }

      // Setup post route
      if(routeObj.post) {
        const middleWare = routeObj?.middlewares?.post;
        if(middleWare)
          middleWare.push(routeObj.post);
        if(!routeObj.postParamPath) router.post(...(routeObj?.middlewares?.post ?? [routeObj.post]));
        else this._webServer.post(routeObj.postParamPath, ...(routeObj?.middlewares?.post ?? [routeObj.post]));
      }

      // Setup put route
      if(routeObj.put) {
        const middleWare = routeObj?.middlewares?.put;
        if(middleWare)
          middleWare.push(routeObj.put);
        if(!routeObj.putParamPath) router.put(...(routeObj?.middlewares?.put ?? [routeObj.put]));
        else this._webServer.put(routeObj.putParamPath, ...(routeObj?.middlewares?.put ?? [routeObj.put]));
      }

      // Setup patch route
      if(routeObj.patch) {
        const middleWare = routeObj?.middlewares?.patch;
        if(middleWare)
          middleWare.push(routeObj.patch);
        if(!routeObj.patchParamPath) router.patch(...(routeObj?.middlewares?.patch ?? [routeObj.patch]));
        else this._webServer.patch(routeObj.patchParamPath, ...(routeObj?.middlewares?.patch ?? [routeObj.patch]));
      }

      // Setup delete route
      if(routeObj.delete) {
        const middleWare = routeObj?.middlewares?.delete;
        if(middleWare)
          middleWare.push(routeObj.delete);
        if(!routeObj.patchParamPath) router.delete(...(routeObj?.middlewares?.delete ?? [routeObj.delete]));
        else this._webServer.delete(routeObj.patchParamPath, ...(routeObj?.middlewares?.delete ?? [routeObj.delete]));
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