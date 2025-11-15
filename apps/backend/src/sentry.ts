import sentry, { consoleLoggingIntegration, isInitialized } from "@sentry/node";
import { execSync } from "child_process";

const EnvName = process.env["ENVIRONMENT"] ?? "dev";
const commitHash = process.env["RAILWAY_GIT_COMMIT_SHA"] ?? execSync('git rev-parse HEAD').toString().trim();
sentry.init({
  dsn: process.env["BACKEND_SENTRY_DSN"],
  environment: EnvName,
  release: `${EnvName.slice(0,4)}-${commitHash?.slice(0,7)}`,
  dist: EnvName === "prod" ? commitHash : `${execSync('git rev-parse --abbrev-ref HEAD').toString().trim()}-${commitHash}`,
  integrations: [
    consoleLoggingIntegration({ levels: ["error"] })
  ],
  enableLogs: true,
  beforeSendLog: (log) => console.log(`[${log.level}]: ${log.message} (Ref ID: ${log.attributes?.referenceID})`) ?? log,
  ignoreErrors: EnvName === "prod" ? ["SyntaxError", "ReferenceError"] : []
});

if(isInitialized())
  console.log("Sentry Initialized!");