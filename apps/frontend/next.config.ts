import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { createHash } from "crypto";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
  webpack: (config, { dev }) => {
    if(dev)
      return config;
    // Ignore any type error here, this is intentional
    const rules = config.module.rules.find((rule) => typeof rule.oneOf === "object").oneOf.filter((rule) => Array.isArray(rule.use));
    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (moduleLoader.loader?.includes("css-loader") && !moduleLoader.loader?.includes("postcss-loader")) {
          const cssModule = moduleLoader.options.modules;
          if (cssModule) {
            cssModule.getLocalIdent = (context, _, exportName, options) => {
              return "uwu_"+createHash("sha256").update(context.rootContext+context.resourcePat+exportName).digest("hex").slice(0,8);
            };
          }
        }
      });
    });

    return config;
  }
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "furrynet",

  project: "frontend",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/289hr89ahfiusafba91",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});