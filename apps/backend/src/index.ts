import "./sentry"; // LOAD FIRST
import { CoreService } from "./CoreService";
import {
  Main,
  DBSandbox,
  LogIn
} from "./routes";


// Main Runner
const MainService = new CoreService();
MainService.setup([
  Main,
  DBSandbox,
  LogIn
]);