import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import type { IUserInfo,  IAccountRequest } from "@repo/utils/types";
import { logger } from "@sentry/node";

export class emailVerification extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/verifyemail/:verifyCode")
      .get(this.getHandle.bind(this))
      .patch(this.patchHandle.bind(this));
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

  async patchHandle(req: Request<{verifyCode: string}>, res: Response) {
    const AccDBColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const ReqDBColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");

    const verifyReq = await ReqDBColl.findOneAndDelete({ requestId: req.params.verifyCode });
    if(!verifyReq) {
      logger.info(logger.fmt`Email verification code ${req.params.verifyCode} was used to confirm verification but doesn't exist in DB`);
      return res.status(404).send("Verfication email or code isn't valid");
    }

    // Update Status
    const setVerifyReq = await AccDBColl.findOneAndUpdate({ _id: verifyReq.userId, verified: false }, { $set: { verified: true } });
    if(!setVerifyReq) {
      logger.error(logger.fmt`Request ${req.params.verifyCode} associated with already verified account??`);
      return res.send(422).send("Account already verified??");
    }

    const cleanupReq = await ReqDBColl.deleteMany({ userId: setVerifyReq._id });
    if(cleanupReq.acknowledged && cleanupReq.deletedCount > 0)
      logger.warn(logger.fmt`User ${setVerifyReq._id.toHexString()} contains extra ${cleanupReq.deletedCount} email verification request??`);

    return res.send("Email Successfully Verified");

  }
}