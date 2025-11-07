import { RouteHandle } from "./baseHandle";
import { json, type Request, type Response } from "express";

type param = { ResetCode: string; }

export class PWDReset extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/pwdreset/:ResetCode")
        .get(this.getHandle.bind(this))
        .patch(json({strict: true}), this.patchHandle.bind(this))
    this.coreSrv.webServer.post("/pwdreset", json({strict: true}), this.postHandle.bind(this));
  }

  async getHandle(req: Request<{ ResetCode: string; }>, res: Response) {
    return res.send("Hello World! :3");
  }

  async postHandle(req: Request, res: Response) {

  }

  async patchHandle(req: Request<{ ResetCode: string; }, res: Response) {

  }
}