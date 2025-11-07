import { CoreService } from "./CoreService";
import {
  Main,
  DBSandbox,
  LogIn,
  emailVerification
} from "./routes";


// Main Runner
const MainService = new CoreService();
MainService.setup([
  Main,
  DBSandbox,
  LogIn,
  emailVerification
]);