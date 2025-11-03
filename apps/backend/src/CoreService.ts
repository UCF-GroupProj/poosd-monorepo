import Express from "express";
import type { Express as ExpType, NextFunction, Request, Response } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { RouteHandle } from "./routes";
import { captureException, logger, setupExpressErrorHandler } from "@sentry/node";
import { JWTManager, type tokenData } from "@repo/utils/JTWManager.ts";
import { MailService } from "@repo/utils/MailService.ts";
import cors from "cors";
import { randomUUID, hash } from "crypto";
import type { ISessionState } from "@repo/utils/types";

export class CoreService {
  private _webServer: ExpType;
  private _mongoCli: MongoClient;
  private _JWTMGR: JWTManager;
  private _emailSRV: MailService;

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
  }

  public async setup(routes: (new(service: CoreService) => RouteHandle)[]) {
    // Setup MongoDB conns
    await this._mongoCli.connect();

    // CORS Related fixes
    this._webServer.use(cors({ origin: "*" }));

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

  get JWTMGR() {
    return this._JWTMGR;
  }

  get emailAPI() {
    return this._emailSRV;
  }

  /* Dependent Middlewares below */

  public async checkAuthMW(req: Request, res: Response<unknown, tokenData>, next: NextFunction) {
    // Validate Token Header
    const referenceID = randomUUID();
    if(!req.headers.authorization)
      return res.status(401).send("Missing Authorization Header");

    const [TokenType, Token] = req.headers.authorization.split(" ");
    if(TokenType !== "Bearer")
      return res.status(401).send("Invalid token type found! Maybe you forgot to include 'Bearer' prefix or used the wrong prefix?");
    if(!Token)
      return res.status(401).send("Missing Actual Token...");

    const JWTMGR = new JWTManager();
    const StateColl = this.database.collection<ISessionState>("SessionState");
    try {
      const data = JWTMGR.verifyUserKey(Token);
      const hashedToken = hash("SHA256", Token, "hex");
      if(!data) {
        logger.warn(logger.fmt`Invalid User Token Provided (content is replaced with string)`, { referenceID });
        return res.status(401).send(`Your session token is invalid. Developer Ref ID: ${referenceID}`);
      }

      const getRes = await StateColl.findOne({ userToken: hashedToken });
      if(!getRes) {
        logger.info(logger.fmt`${data.id} token are not found in the SessionState collection`, { referenceID });
        return res.status(401).send(`Session Expired, please login again. Developer Ref ID: ${referenceID}`);
      }

      // Software Timestamp validation in-case database doesn't have this implemented
      if(getRes.lastLogin.getTime() < Date.now() - 1000*60*60*24) {
        logger.info(logger.fmt`${data.id} token expired in the SessionState collection`, { referenceID });
        const delRes = await StateColl.deleteOne({ userToken: hashedToken });

        // Although the issue shouldn't affect user interactions, it should still be fixed asap (if occurred)
        if(!delRes.acknowledged || delRes.deletedCount === 0) {
          if(!delRes.acknowledged)
            logger.error(logger.fmt`Deleting expired token ${hashedToken} from session state was not acknowleged by the database`, { referenceID });
          if(delRes.deletedCount === 0)
            logger.error(logger.fmt`Database returns zero record deleted on ${hashedToken}. Possibly race condition where token expired right after 'findOne' was called.`, { referenceID });
        }

        return res.status(401).send(`Session Expired, please login again. Developer Ref ID: ${referenceID}`);
      }

      const setRes = await StateColl.updateOne({ userToken: hashedToken }, { $set: { lastLogin: new Date() } });
      if(!setRes.acknowledged || setRes.modifiedCount === 0) {
        if(!setRes.acknowledged)
          logger.error(logger.fmt`Updating token ${hashedToken} session state was not acknowleged by the database`, { referenceID });
        if(setRes.modifiedCount === 0)
          logger.error(logger.fmt`Database returns zero record update on ${hashedToken}. Possibly race condition where token expired right after 'findOne' was called.`, { referenceID });

        return res.status(503).send(`Errors when updating session activity. Developer Ref ID: ${referenceID}`);
      }

      // Set the session stuff and move on
      Object.assign(res.locals, data);
      next();

    } catch(ex) {
      if(ex instanceof Error) {
      /* Handle bad JWT Keys */
        if(ex.name === "TokenExpiredError") {
          logger.warn(logger.fmt`${JWTMGR.decodeUserKey(Token)?.id} is using expired token. This shouldn't happen as JWT doesn't have expired flag`, { referenceID });
          return res.status(403).send(`SESSION TOKEN EXPIRED. Developer Ref ID: ${referenceID}`);
        }

        if(ex.name === "NotBeforeError") {
          logger.warn(logger.fmt`${JWTMGR.decodeUserKey(Token)?.id} is using pre-valid token. This shouldn't happen unless something is wrong with the server clock`, { referenceID });
          return res.status(403).send(`SESSION TOKEN NOT YET VALID. Developer Ref ID: ${referenceID}`);
        }

        if(ex.name === "JsonWebTokenError") {
          logger.warn(logger.fmt`An error occured when processing JWT Key: ${ex.message}`, { referenceID });
          return res.status(401).send(`Your session token is bad. Developer Ref ID: ${referenceID}`);
        }
      }

      captureException(ex, {
        contexts: {
          Identifier: {
            referenceID
          }
        }
      });
      return res.status(500).send(`Unknown error occurred. Developer Ref ID: ${referenceID}`);

    }
  }
}

class CoreServiceExcept extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CoreService Error";
  }
}