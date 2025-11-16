import { RouteHandle } from "./baseHandle";
import type { NextFunction, Request, Response } from "express";
import { json } from "express";
import { logger } from "@sentry/node";
import { scryptSync, timingSafeEqual, createHash, randomUUID } from "node:crypto";
import type { IUserCred, IUserDBObject, IStoredUser, ISessionState, IAccountRequest, IUserInfo } from "@repo/utils/types";
import { ObjectId } from "mongodb";



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

    if(inputHashPwd.length !== dbHashPwd.length || !timingSafeEqual(inputHashPwd, dbHashPwd)) {
      logger.info(logger.fmt`${req.body.email} password mismatched!`);
      return res.status(401).send("Invalid email or password");
    }

    if(!userFetch.verified) {
      logger.warn(logger.fmt`User ${req.body.email} attempted login but email is not verified`);
      const mailSendState = await this.sendVerifyEmail(userFetch._id.toHexString(), req.body.email);
      const mailMsg = mailSendState ? "Another verification email has been sent in-case you lost them." : "Another link cannot be sent to your inbox, please submit a support case";
      return res.status(403).send(`Email verification required. ${mailMsg}`);
    }

    // Generate JWT Token
    const token = this.coreSrv.JWTMGR.signUserKey({ id: userFetch._id.toString(), email: req.body.email });

    // Insert session state
    const sessionColl = this.coreSrv.database.collection<ISessionState>("SessionState");
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
    const ReqDBColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");

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
      pullsSinceEpic: 0,
      lastPullTime: new Date(),
    });
    if(!userInsert.acknowledged) {
      logger.error(`For account ${req.body.email}, database failed to acknowledged the insert request`);
      return res.status(502).send("An error occured with edatabase service, please try again later");
    }

    // Send verification emails
    const reqID = randomUUID();
    const newReq = await ReqDBColl.insertOne({
      userId: userInsert.insertedId,
      requestId: reqID,
      createdAt: new Date(),
      requestType: "email",
    });
    if(!newReq.acknowledged) {
      logger.error(logger.fmt`User ${res.locals.id} verification request cannot be submitted to database`, { reqID });
      return res.status(503).send("Verification cannot be saved :(");
    }

    const mailRes = await this.coreSrv.emailAPI.sendMail({
      from: "Olympull <noreply@zhiyan114.com>",
      to: req.body.email,
      subject: "Account Verification",
      text: `Please verify your email at https://poosd.zhiyan114.com/verify/${reqID}`
    });
    if(typeof(mailRes) === "string" || mailRes.success === false) {
      // User account isnt register if email fails
      const ErrMSG = typeof(mailRes) === "string" ? mailRes : mailRes.message;
      logger.error(`${req.body.email} verification email failed: ${ErrMSG}`);
      return res.status(503).send("An error occured with email service, please try again later");
    }

    // Done
    logger.info(`account ${req.body.email} successfully registered`);
    return res.send("Registered successfully, please review your inbox to verify your account");
  }

  private async sendVerifyEmail(userID: string, email: string) {
    const AccDBColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const ReqDBColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");

    // Check verification status
    const veriReq = await AccDBColl.findOne({ _id: new ObjectId(userID), requestType: "email" });
    if(!veriReq) {
      // This shouldn't ever happen...
      logger.error(logger.fmt`User ${userID} not found in DB??`);
      return false;
    }
    if(veriReq.verified) {
      logger.warn(logger.fmt`User ${userID} already verified but verification request still received`);
      return false;
    }

    // Delete existing Request
    const delReqs = await ReqDBColl.deleteMany({ userId: new ObjectId(userID), requestType: "email" });
    if(!delReqs.acknowledged) {
      logger.error(logger.fmt`User ${userID} email verification delete request failed to be acknowleged`);
      return false;
    }
    if(delReqs.deletedCount > 1)
      logger.warn(logger.fmt`User ${userID} found to have multiple email verification request...`);

    // Submit Request
    logger.info(logger.fmt`User ${userID} requesting a new verification email!`, { delExistReq: delReqs.deletedCount > 0 ? true : false });
    const reqID = randomUUID();
    const newReq = await ReqDBColl.insertOne({
      userId: new ObjectId(userID),
      requestId: reqID,
      createdAt: new Date(),
      requestType: "email",
    });
    if(!newReq.acknowledged) {
      logger.error(logger.fmt`User ${userID} verification request cannot be submitted to database`, { reqID });
      return false;
    }

    const mailRes = await this.coreSrv.emailAPI.sendMail({
      from: "Olympull <noreply@zhiyan114.com>",
      to: email,
      subject: "Account Verification",
      text: `Please verify your email at https://poosd.zhiyan114.com/verify/${reqID}`
    });

    if(typeof(mailRes) === "string" || mailRes.success === false) {
      // User account isnt register if email fails
      const ErrMSG = typeof(mailRes) === "string" ? mailRes : mailRes.message;
      logger.error(`${email} verification email failed: ${ErrMSG}`);
      return false;
    }

    logger.info(logger.fmt`Request ${reqID} Successfully submitted!`);
    return true;
  }

}
