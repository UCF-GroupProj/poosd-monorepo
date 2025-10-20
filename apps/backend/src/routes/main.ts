import { RouteHandle } from ".";
import type { Request, Response } from "express";

// Index route '/'
export class Main extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.get("/", this.get.bind(this));
  }

  async get(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }
}