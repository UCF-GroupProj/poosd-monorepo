import Express from "express";
import type { Express as ExpType } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { RouteHandle } from "./routes";
import { logger, setupExpressErrorHandler } from "@sentry/node";
import { JWTManager } from "@repo/utils/JTWManager.ts";
import { MailService } from "@repo/utils/MailService.ts";
import cors from "cors";

import {
  Main,
  DBSandbox,
  LogIn,
  emailVerification,
  PWDReset,
  UserProfile,
  cardRoute
} from "./routes";

export class CoreService {
  private _webServer: ExpType;
  private _mongoCli: MongoClient;
  private _JWTMGR: JWTManager;
  private _emailSRV: MailService;
  private routes: RouteHandle[];

  constructor() {
    this._webServer = Express();

    // Check required env
    const mongoConnStr = process.env["MONGO_CONN"];
    const emailAPIStr = process.env["EMAIL_KEY"];
    if(!mongoConnStr) throw new CoreServiceExcept("Missing MONGO_CONN env variable");
    if(!emailAPIStr) throw new CoreServiceExcept("Missing EMAIL_KEY env variable");

    // Initialize stuff
    this._mongoCli = new MongoClient(mongoConnStr, { serverApi: ServerApiVersion.v1 });
    this._JWTMGR = new JWTManager();
    this._emailSRV = new MailService(emailAPIStr);

    // Add Routes
    this.routes = [
      new Main(this),
      new DBSandbox(this),
      new LogIn(this),
      new emailVerification(this),
      new PWDReset(this),
      new UserProfile(this),
      new cardRoute(this)
    ];
  }

  public async setup() {
    // Setup MongoDB conns
    await this._mongoCli.connect();

    // CORS Related fixes
    this._webServer.use(cors({ origin: "*" }));

    // Handle Route Stuff
    for(const route of this.routes)
      route.setup();

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

  get JWTMGR() {
    return this._JWTMGR;
  }

  get emailAPI() {
    return this._emailSRV;
  }

  /**
   * MAKE SURE TO TERMINATE THE SESSION
   * @returns MongoDB ClientSession
   */
  public createDBSession() {
    return this._mongoCli.startSession();
  }
}

class CoreServiceExcept extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CoreService Error";
  }
}