import { captureException, logger } from "@sentry/node";
import { RouteHandle } from "./baseHandle";
import { json, type Request, type Response } from "express";
import type { IAccountRequest, IUserDBObject } from "@repo/utils/types";
import { randomUUID, scryptSync } from "crypto";

export class PWDReset extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/pwdreset/:ResetCode")
      .get(this.getHandle.bind(this))
      .patch(json({ strict: true }), this.patchHandle.bind(this));
    this.coreSrv.webServer.post("/pwdreset", json({ strict: true }), this.postHandle.bind(this));
  }

  async getHandle(req: Request<{ ResetCode: string; }>, res: Response) {
    const ReqColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");
    logger.debug(logger.fmt`Attempt to check password reset request for ${req.params.ResetCode}`);
    const ResColl = await ReqColl.findOne({ requestId: req.params.ResetCode, requestType: "password" });

    if(!ResColl) {
      logger.info(logger.fmt`No Password Reset Request Found for ${req.params.ResetCode}`);
      return res.status(404).send("No valid password request found with this code");
    }

    logger.info(logger.fmt`Password Reset request was found for ${req.params.ResetCode} for user ${ResColl._id.toHexString()}`);
    return res.send(ResColl._id.toHexString());
  }

  async postHandle(req: Request<unknown, unknown, {email: string}>, res: Response) {
    if(!req.body.email || req.body.email.trim() === "")
      return res.status(400).send("Missing Email Field");

    const ReqColl = this.coreSrv.database.collection<IAccountRequest>("ResetRequest");
    const logInDoc = this.coreSrv.database.collection<IUserDBObject>("Users");
    // Could be replaced with transaction but dont want to atm
    const userPro = await logInDoc.findOne({ email:req.body.email });
    if(!userPro) {
      logger.info(logger.fmt`No User account (${req.body.email}) was found when requesting password reset`);
      return res.send("Verification email has been sent, if there's an account associated with this email");
    }

    const reqID = randomUUID();
    const record = await ReqColl.findOneAndUpdate({ userId: userPro._id }, {
      $set: {
        requestId: reqID,
        createdAt: new Date()
      },
      $setOnInsert: {
        userId: userPro._id,
        requestId: reqID,
        createdAt: new Date(),
        requestType: "password"
      }
    }, { upsert: true, returnDocument: "before" });

    if(record)
      logger.debug(logger.fmt`Updated Existing password reset request for ${record._id.toHexString()}`);

    // Send Email and complete request
    const mailRes = await this.coreSrv.emailAPI.sendMail({
      from: "Olympull <noreply@zhiyan114.com>",
      to: req.body.email,
      subject: "Password Reset Request",
      text: `Please follow the link to reset your password: https://poosd.zhiyan114.com/pwdreset/${reqID}`
    });
    if(typeof(mailRes) === "string" || mailRes.success === false) {
      // User account isnt register if email fails
      const ErrMSG = typeof(mailRes) === "string" ? mailRes : mailRes.message;
      logger.error(`${req.body.email} verification email failed: ${ErrMSG}`);
      return res.status(503).send("An error occured with email service, please try again later");
    }

    logger.info(logger.fmt`Issued new password request: ${reqID} successfully!`);
    return res.send("Verification email has been sent, if there's an account associated with this email");
  }

  async patchHandle(req: Request<{ResetCode: string;}, unknown, {newPassword: string}>, res: Response) {
    if(!req.body.newPassword || req.body.newPassword.trim())
      return res.send(400).send("Missing newPassword Field");

    const DBSession = this.coreSrv.createDBSession();
    try {
      await DBSession.withTransaction(async()=>{
        const db = this.coreSrv.database;
        const userColl = db.collection<IUserDBObject>("Users");
        const reqColl = db.collection<IAccountRequest>("ResetRequest");

        // Check code existance
        const codeData = await reqColl.findOne({ requestId: req.params.ResetCode, requestType: "password" });
        if(!codeData)
          throw new pwdPatchErr(logger.fmt`Attempt to reset user password but invalid code provided: ${req.params.ResetCode}`, PatchErrCode.badResetCode);

        // Update password
        const pwdUpdateState = await userColl.updateOne({ _id: codeData.userId }, {
          $set: {
            password: scryptSync(req.body.newPassword, req.body.newPassword, 64).toString("base64")
          }
        });
        if(!pwdUpdateState.acknowledged)
          throw new pwdPatchErr(logger.fmt`Database failed to respond to a password update request`, PatchErrCode.noDBResponse);
        if(pwdUpdateState.modifiedCount === 0)
          throw new pwdPatchErr(logger.fmt`No user account had their password updated: ${codeData.userId.toHexString()}`, PatchErrCode.genericErr);

        // Delete request code
        const rmPwdReqState = await reqColl.deleteMany({ userId: codeData.userId, requestType: "password" });
        if(!rmPwdReqState.acknowledged)
          throw new pwdPatchErr(logger.fmt`Database failed to respond to a user request deletion request`, PatchErrCode.noDBResponse);
        if(rmPwdReqState.deletedCount > 1)
          logger.warn(logger.fmt`User ${codeData.userId.toHexString()} found multiple password reset request in the database`);
        if(rmPwdReqState.deletedCount === 0)
          throw new pwdPatchErr(logger.fmt`Request code existed before the deletion were called?? Did DBA tempered with records??: ${codeData.userId.toHexString()}`, PatchErrCode.genericErr);

        logger.info(logger.fmt`Successfully updated ${codeData.userId.toHexString()} password`);
        return res.send("Password Successfully Updated!");
      });
    } catch(ex) {
      if(ex instanceof pwdPatchErr) {
        if(ex.code === PatchErrCode.badResetCode)
          return res.status(404).send("Invalid Reset Code");
        if(ex.code === PatchErrCode.noDBResponse)
          return res.status(503).send("Database not responding...");
        if(ex.code === PatchErrCode.genericErr)
          return res.status(500).send("Something bad happen with santization check, review sentry log for more info");
      }

      // Unhandled errors
      captureException(ex);
      return res.status(500).send("Unknown Server Error Occured");
    } finally {
      await DBSession.endSession();
    }
  }
}

type sentryParamType = string & {
    __sentry_template_string__?: string;
    __sentry_template_values__?: unknown[];
};

enum PatchErrCode {
  badResetCode,
  noDBResponse,
  genericErr, // Failed internal santization check (SHOULDNT HAPPEN BTW)
}

class pwdPatchErr extends Error {
  public code: PatchErrCode;
  constructor(msg: sentryParamType, status: PatchErrCode) {
    super(msg);
    if(status === PatchErrCode.genericErr) logger.error(msg);
    else logger.warn(msg);
    this.name = "pwdPatchErr";
    this.code = status;
  }
}