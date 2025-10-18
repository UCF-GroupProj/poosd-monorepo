#!/bin/bash

# Post-Build Script #



# Shareable Values
SRCENV=${ENVIRONMENT:=????}
RELSTR="${SRCENV:0:4}-${RAILWAY_GIT_COMMIT_SHA:0:7}"


# Sentry Deploy Ends
if [ -n "$SENTRY_AUTH_TOKEN" ] && [ -n "$SENTRY_ORG" ]; then
  # Sentry Release info setup
  RELEXIST="$(npx sentry-cli releases info "$RELSTR")"
  if [ -n "$RELEXIST" ]; then
    npx sentry-cli releases set-commits "$RELSTR" --auto --project backend
    npx sentry-cli releases finalize "$RELSTR" --project backend
    npx sentry-cli deploys new -e "${SRCENV:0:4}" -r "$RELSTR" -n "${RAILWAY_GIT_COMMIT_SHA:0:7}" --project backend
    echo "Sentry Release Finalized for $RELSTR..."
  else
    echo "Sentry Release Cannot be Finalized due to missing pre-published release"
  fi

  # Sentry Source Mapping
  npx sentry-cli sourcemaps inject ./apps/backend/dist
  npx sentry-cli sourcemaps upload --release="$RELSTR" --dist="$RAILWAY_GIT_COMMIT_SHA" --project backend ./apps/backend/dist
  echo "Successfully Deployed Source Map"
else
  echo "Sentry Release and Source Mapping cannot be Finalized due to missing required Sentry-Cli variables";
fi