import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import type { IUserInfo,  IAccountRequest } from "@repo/utils/types";
import { logger } from "@sentry/node";
import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

export class emailVerification extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/verifyemail/:verifyCode")
      .get(this.getHandle.bind(this))
      .patch(this.patchHandle.bind(this));
    this.coreSrv.webServer.post("/verifyemail", AuthMWGen(this.coreSrv.database), this.postHandle.bind(this));
  }

  async getHandle(req: Request<{verifyCode: string}>, res: Response) {
    const DBColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");

    const credRes = await DBColl.findOne({ requestId: req.params.verifyCode });
    if(!credRes) {
      logger.info(logger.fmt`${req.params.verifyCode} request for email verification was not found`);
      return res.status(404).send("Email Verification Code Not Found");
    }

    return res.send(credRes.userId.toHexString());
  }

  async postHandle(req: Request, res: Response<unknown, tokenData>) {
    const AccDBColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const ReqDBColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");
    // Check verification status
    const veriReq = await AccDBColl.findOne({ _id: new ObjectId(res.locals.id), requestType: "email" });
    if(!veriReq) {
      // This shouldn't ever happen...
      logger.error(logger.fmt`User ${res.locals.id} not found in DB, but the token is valid??`);
      return res.status(404).send("Invalid User Submitted Request");
    }
    if(veriReq.verified) {
      logger.warn(logger.fmt`User ${res.locals.id} already verified but verification request still received`);
      return res.status(422).send("Your account is already verified, request cannot be submitted again");
    }

    // Delete existing Request
    const delReqs = await ReqDBColl.deleteMany({ userId: new ObjectId(res.locals.id), requestType: "email" });
    if(!delReqs.acknowledged) {
      logger.error(logger.fmt`User ${res.locals.id} email verification delete request failed to be acknowleged`);
      return res.status(503).send("Unable to delete old email verification requests, issue with DB?");
    }
    if(delReqs.deletedCount > 1)
      logger.warn(logger.fmt`User ${res.locals.id} found to have multiple email verification request...`);

    // Submit Request
    logger.info(logger.fmt`User ${res.locals.id} requesting a new verification email!`, { delExistReq: delReqs.deletedCount > 0 ? true : false });
    const reqID = randomUUID();
    const newReq = await ReqDBColl.insertOne({
      userId: new ObjectId(res.locals.id),
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
      to: res.locals.email,
      subject: "Account Verification",
      text: `Please verify your email at https://poosd.zhiyan114.com/verify/${reqID}`
    });

    if(typeof(mailRes) === "string" || mailRes.success === false) {
      // User account isnt register if email fails
      const ErrMSG = typeof(mailRes) === "string" ? mailRes : mailRes.message;
      logger.error(`${req.body.email} verification email failed: ${ErrMSG}`);
      return res.status(503).send("An error occured with email service, please try again later");
    }

    logger.info(logger.fmt`Request ${reqID} Successfully submitted!`);
    return res.send("An email verification link has been resent");
  }

  async patchHandle(req: Request<{verifyCode: string}>, res: Response) {
    return res.send("Hello World! :3");
  }
}