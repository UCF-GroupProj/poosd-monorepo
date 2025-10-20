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
    for(const route of routes)
      new route(this).setup();

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