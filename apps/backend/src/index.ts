import "./sentry"; // LOAD FIRST
import { CoreService } from "./CoreService";
import {
  Main
} from "./routes";


// Main Runner
const MainService = new CoreService();
MainService.setup([
  Main
]);