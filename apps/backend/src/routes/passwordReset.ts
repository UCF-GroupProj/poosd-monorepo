import { logger } from "@sentry/node";
import { RouteHandle } from "./baseHandle";
import { json, type Request, type Response } from "express";
import type { IAccountRequest } from "@repo/utils/types";

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

  async postHandle(req: Request, res: Response) {

  }

  async patchHandle(req: Request<{ ResetCode: string; }>, res: Response) {

  }
}