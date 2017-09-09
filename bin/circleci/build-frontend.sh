#!/bin/bash
set -ex
NODE_ENV=production ENABLE_PONTOON=1 ENABLE_DEV_CONTENT=1 ENABLE_DEV_LOCALES=1 npm run static
zip -r $CIRCLE_ARTIFACTS/frontend.zip frontend/build
