#!/usr/bin/env bash
# Builds a static design preview (no RSVP saving, no /host) into ./out for GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."
stash=$(mktemp -d)
restore() { mv "$stash/api" src/app/api; mv "$stash/host" src/app/host; rm -rf "$stash"; }
mv src/app/api "$stash/api"
mv src/app/host "$stash/host"
trap restore EXIT
rm -rf .next out
PREVIEW_EXPORT=1 SITE_URL=https://jnemanpour.github.io/Bani-Adam- NEXT_TELEMETRY_DISABLED=1 npx next build
touch out/.nojekyll
