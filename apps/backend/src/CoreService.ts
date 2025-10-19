import Express, { type Express as ExpType } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { RouteHandle } from "./routes";
import { logger, setupExpressErrorHandler } from "@sentry/node";

export class CoreService {
  private _webServer: ExpType;
  private _mongoCli: MongoClient;
  private _DBName: string;

  constructor() {
    this._webServer = Express();

    // MongoDB setup
    const mongoConnStr = process.env["MONGO_CONN"];
    if(!mongoConnStr) throw new CoreServiceExcept("Missing MONGO_CONN env variable");
    this._mongoCli = new MongoClient(mongoConnStr, { serverApi: ServerApiVersion.v1 });
    this._DBName = process.env["ENVIRONMENT"] ?? "dev";
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
        router.get(...(routeObj?.middlewares?.get ?? [routeObj.get]));
      }

      // Setup post route
      if(routeObj.post) {
        const middleWare = routeObj?.middlewares?.post;
        if(middleWare)
          middleWare.push(routeObj.post);
        router.post(...(routeObj?.middlewares?.post ?? [routeObj.post]));
      }

      // Setup put route
      if(routeObj.put) {
        const middleWare = routeObj?.middlewares?.put;
        if(middleWare)
          middleWare.push(routeObj.put);
        router.put(...(routeObj?.middlewares?.put ?? [routeObj.put]));
      }

      // Setup patch route
      if(routeObj.patch) {
        const middleWare = routeObj?.middlewares?.patch;
        if(middleWare)
          middleWare.push(routeObj.patch);
        router.patch(...(routeObj?.middlewares?.patch ?? [routeObj.patch]));
      }

      // Setup delete route
      if(routeObj.delete) {
        const middleWare = routeObj?.middlewares?.delete;
        if(middleWare)
          middleWare.push(routeObj.delete);
        router.delete(...(routeObj?.middlewares?.delete ?? [routeObj.delete]));
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

  get mongoCli() {
    return this._mongoCli;
  }

  get DBName() {
    return this._DBName;
  }
}

class CoreServiceExcept extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CoreService Error";
  }
}