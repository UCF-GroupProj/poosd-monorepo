import type { CoreService } from "../CoreService";
import type { Request, Response, RequestHandler } from "express";

type MidWareType = {
    get?: RequestHandler[],
    post?: RequestHandler[],
    put?: RequestHandler[],
    patch?: RequestHandler[],
    delete?: RequestHandler[],
}

type paramOptType = {
  paramPath: string;
  middlewares?: RequestHandler[];
  handle(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
}

type paramMethodType = {
  get?: paramOptType;
  post?: paramOptType;
  put?: paramOptType;
  patch?: paramOptType;
  delete?: paramOptType;
}

type mainOptType = {
  middlewares?: RequestHandler[];
  handle(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
}

type mainMethodType = {
  path: string;
  get?: mainOptType;
  post?: mainOptType;
  put?: mainOptType;
  patch?: mainOptType;
  delete?: mainOptType;
}

export abstract class RouteHandle {
  protected coreSrv: CoreService;
  constructor(service: CoreService) {
    this.coreSrv = service;
  }

  middlewares?: MidWareType;
  paramRoutes?: paramMethodType;
  mainRoutes?: mainMethodType;
}


// Export stuff
export { Main } from "./main";