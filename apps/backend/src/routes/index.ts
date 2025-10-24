import type { CoreService } from "../CoreService";

export type GetParams<Path extends string> = Path extends `/${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & GetParams<Rest>
  : Path extends `/${infer Param}`
  ? { [K in Param]: string }
  : {}; // eslint-disable-line

export abstract class RouteHandle {
  protected coreSrv: CoreService;
  constructor(service: CoreService) {
    this.coreSrv = service;
  }

  abstract setup(): void;
}


// Export stuff
export { Main } from "./main";
export { DBSandbox } from "./dbsandbox";
export { LogIn } from "./LogIn";