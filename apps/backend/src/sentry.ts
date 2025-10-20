import sentry, { consoleLoggingIntegration } from "@sentry/node";

sentry.init({
  dsn: process.env["BACKEND_SENTRY_DSN"],
  environment: process.env["ENVIRONMENT"],
  release: `${process.env["ENVIRONMENT"]?.slice(0,4) ?? "????"}-${process.env["RAILWAY_GIT_COMMIT_SHA"]?.slice(0,7) ?? "???????"}`,
  integrations: [
    consoleLoggingIntegration({ levels: ["error"] })
  ],
  enableLogs: true,
  beforeSendLog: (log) => console.log(`[${log.level}: ${log.message}]`) ?? log
});