import { RouteHandle } from ".";
import type { NextFunction, Request, Response } from "express";
import { json } from "express";
import { logger } from "@sentry/node";
import { scryptSync, timingSafeEqual, createHash } from "node:crypto";
import type { IUserCred, IUserDBObject, IStoredUser } from "@repo/utils/types";



type ITokenRes = {
  token: string;
}

export class LogIn extends RouteHandle {

  private logInDocName = "Users";

  public setup() {
    const webSRV = this.coreSrv.webServer;
    webSRV.route("/login").post(json({ strict: true }), this.postLogIn.bind(this));
    webSRV.post('/register', json({ strict: true }), this.registerHandle.bind(this));
  }

  private skipInprod(req: Request, res: Response, next: NextFunction) {
    // Endpoint that aren't ready yet won't be available in prod via this middleman
    if(process.env["ENVIRONMENT"] !== "prod")
      return res.status(503).send("Endpoint is current in development");

    next();
  }

  private async postLogIn(req: Request<unknown, void, IUserCred>, res: Response<string | ITokenRes>) {
    const logInDoc = this.coreSrv.database.collection<IUserDBObject>(this.logInDocName);

    if(!req.body.email || !req.body.password) {
      logger.warn(logger.fmt`Received missing body request -> isEmail: ${req.body.email === undefined} | isPassword ${req.body.password === undefined}`);
      return res.status(400).send("Missing required field(s)");
    }
    if(req.headers.authorization) {
      logger.warn(logger.fmt`User ${req.body.email} authorization header presented, which could indicates that user is already logged in`);
      return res.status(403).send("You're already logged in!");
    }
    const userFetch = await logInDoc.findOne({ email : req.body.email }) as IStoredUser | null;
    if(!userFetch) {
      logger.info(logger.fmt`Failed to locate user ${req.body.email} in the database`);
      return res.status(401).send("Invalid email or password");
    }

    const inputHashPwd = scryptSync(req.body.password, req.body.password, 64);
    const dbHashPwd = Buffer.from(userFetch.password, "base64");

    if(inputHashPwd.length !== dbHashPwd.length && !timingSafeEqual(inputHashPwd, dbHashPwd)) {
      logger.info(logger.fmt`${req.body.email} password mismatched!`);
      return res.status(401).send("Invalid email or password");
    }

    if(!userFetch.verified) {
      logger.warn(logger.fmt`User ${req.body.email} attempted login but email is not verified`);
      return res.status(403).send("Email verification required");
    }

    // Generate JWT Token
    const token = this.coreSrv.JWTMGR.signUserKey({ id: userFetch._id.toString(), email: req.body.email });

    // Insert session state
    const sessionColl = this.coreSrv.database.collection("SessionState");
    const userToken = createHash("sha256").update(token).digest("hex");
    const DBRes = await sessionColl.insertOne({
      userId: userFetch._id,
      userToken,
      lastLogin: new Date(),
    });

    if(!DBRes.acknowledged) {
      logger.error("DB Fail to acknowlege when adding hashed user token to DB's SessionState");
      return res.status(503).send("Database Unavailable when registering session :(");
    }

    logger.info(logger.fmt`Successfully authenticated ${req.body.email} with sessionID: ${DBRes.insertedId.toString("hex")}`);
    return res.status(200).send({ token });
  }

  private async registerHandle(req: Request<unknown, unknown, IUserCred>, res: Response<string> ) {
    const userColl = this.coreSrv.database.collection<IUserDBObject>(this.logInDocName);

    if(!req.body.email || !req.body.password) {
      logger.warn(logger.fmt`Received missing body request -> isEmail: ${req.body.email === undefined} | isPassword ${req.body.password === undefined}`);
      return res.status(400).send("Missing required field(s)");
    }
    req.body.email = req.body.email.trim();

    // Check if already logged in
    if(req.headers.authorization) {
      logger.warn(logger.fmt`User ${req.body.email} authorization header presented, which could indicates that user is already logged in`);
      return res.status(403).send("You're already logged in!");
    }

    // Verify if email is aleady used
    logger.debug(logger.fmt`Verifying if user ${req.body.email} already existed in the database`);
    const userFetch = await userColl.findOne({ email: req.body.email });
    if(userFetch !== null) {
      logger.info(logger.fmt`${req.body.email} already existed in the database`);
      return res.status(409).send("Email already existed in the database");
    }

    // Send Email
    const mailRes = await this.coreSrv.emailAPI.sendMail({
      from: "Olympull <noreply@zhiyan114.com>",
      to: req.body.email,
      subject: "Account Verification",
      text: "An account registeration was made on this email. If this is you, please verify the account here: <PLACEHOLDER LINK>"
    });
    if(typeof(mailRes) === "string" || mailRes.success === false) {
      // User account isnt register if email fails
      const ErrMSG = typeof(mailRes) === "string" ? mailRes : mailRes.message;
      logger.error(`${req.body.email} verification email failed: ${ErrMSG}`);
      return res.status(502).send("An error occured with email service, please try again later");
    }

    // Add user and send verification email
    logger.debug(logger.fmt`adding ${req.body.email} to database`);
    const userInsert = await userColl.insertOne({
      email: req.body.email,
      password: scryptSync(req.body.password, req.body.password, 64).toString("base64"),
      verified: false,
      collection: [],
      level: 0,
      exp: 0,
      currency: { gems: 0 },
      favorites: [],
    });
    if(!userInsert.acknowledged) {
      logger.error(`For account ${req.body.email}, database failed to acknowledged the insert request`);
      return res.status(502).send("An error occured with edatabase service, please try again later");
    }
    // Done
    logger.info(`account ${req.body.email} successfully registered`);
    return res.send("Registered successfully, please review your inbox to verify your account");
  }

}
