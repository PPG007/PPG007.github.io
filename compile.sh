#!/bin/bash
OUT_DIR="docs/.vuepress/config"
if [ -d "$OUT_DIR" ]; then
    rm -r $OUT_DIR
fi
pnpm tsc --outDir $OUT_DIR
echo '{"type":"commonjs"}' > $OUT_DIR/package.json
