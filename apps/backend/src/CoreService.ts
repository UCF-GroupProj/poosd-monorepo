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

      // Hook main routes
      if(routeObj.mainRoutes) {
        const mRoute = routeObj.mainRoutes;
        const router = this._webServer.route(mRoute.path);

        if(mRoute.get) {
          if(mRoute.get.middlewares)
            mRoute.get.middlewares.push(mRoute.get.handle);
          router.get(...(mRoute.get.middlewares ?? [mRoute.get.handle]));
        }

        if(mRoute.post) {
          if(mRoute.post.middlewares)
            mRoute.post.middlewares.push(mRoute.post.handle);
          router.post(...(mRoute.post.middlewares ?? [mRoute.post.handle]));
        }

        if(mRoute.put) {
          if(mRoute.put.middlewares)
            mRoute.put.middlewares.push(mRoute.put.handle);
          router.put(...(mRoute.put.middlewares ?? [mRoute.put.handle]));
        }

        if(mRoute.patch) {
          if(mRoute.patch.middlewares)
            mRoute.patch.middlewares.push(mRoute.patch.handle);
          router.patch(...(mRoute.patch.middlewares ?? [mRoute.patch.handle]));
        }

        if(mRoute.delete) {
          if(mRoute.delete.middlewares)
            mRoute.delete.middlewares.push(mRoute.delete.handle);
          router.delete(...(mRoute.delete.middlewares ?? [mRoute.delete.handle]));
        }
      }

      // Hook param routes
      if(routeObj.paramRoutes) {
        const pRoute = routeObj.paramRoutes;

        if(pRoute.get) {
          if(pRoute.get.middlewares)
            pRoute.get.middlewares.push(pRoute.get.handle);
          this._webServer.get(pRoute.get.paramPath, ...(pRoute.get.middlewares ?? [pRoute.get.handle]));
        }

        if(pRoute.post) {
          if(pRoute.post.middlewares)
            pRoute.post.middlewares.push(pRoute.post.handle);
          this._webServer.post(pRoute.post.paramPath, ...(pRoute.post.middlewares ?? [pRoute.post.handle]));
        }

        if(pRoute.put) {
          if(pRoute.put.middlewares)
            pRoute.put.middlewares.push(pRoute.put.handle);
          this._webServer.put(pRoute.put.paramPath, ...(pRoute.put.middlewares ?? [pRoute.put.handle]));
        }

        if(pRoute.patch) {
          if(pRoute.patch.middlewares)
            pRoute.patch.middlewares.push(pRoute.patch.handle);
          this._webServer.patch(pRoute.patch.paramPath, ...(pRoute.patch.middlewares ?? [pRoute.patch.handle]));
        }

        if(pRoute.delete) {
          if(pRoute.delete.middlewares)
            pRoute.delete.middlewares.push(pRoute.delete.handle);
          this._webServer.delete(pRoute.delete.paramPath, ...(pRoute.delete.middlewares ?? [pRoute.delete.handle]));
        }
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