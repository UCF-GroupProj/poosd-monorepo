import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import type { IAccountRequest } from "@repo/utils/types";
import { logger } from "@sentry/node";
import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";

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
    return res.send("Hello World! :3");
  }

  async patchHandle(req: Request<{verifyCode: string}>, res: Response) {
    return res.send("Hello World! :3");
  }
}