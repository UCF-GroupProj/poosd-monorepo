import sentry, { consoleLoggingIntegration } from "@sentry/node";

sentry.init({
  dsn: process.env["BACKEND_SENTRY_DSN"],
  environment: process.env["ENVIRONMENT"],
  integrations: [
    consoleLoggingIntegration({ levels: ["error"] })
  ],
  enableLogs: true,
  beforeSendLog: (log) => console.log(`[${log.level}: ${log.message}]`) ?? log
});