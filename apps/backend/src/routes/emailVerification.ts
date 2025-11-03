import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";

export class emailVerification extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/verifyemail/:verifyCode")
        .get(this.getHandle.bind(this))
        .patch(this.patchHandle.bind(this));
    this.coreSrv.webServer.post("/verifyemail", this.postHandle.bind(this));
  }

  async getHandle(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }

  async postHandle(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }

  async patchHandle(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }
}