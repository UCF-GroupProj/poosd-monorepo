import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";

export class Main extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.get("/card/:cardID", this.getHandle.bind(this));
    this.coreSrv.webServer.get("/card/summary", this.summaryHandle.bind(this));
  }

  async getHandle(req: Request<{cardID: string}>, res: Response) {
    return res.send("Hello World! :3");
  }

  async summaryHandle(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }
}