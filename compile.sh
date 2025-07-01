#!/bin/bash
OUT_DIR="docs/.vuepress/config"
if [ -d "$OUT_DIR" ]; then
    rm -r $OUT_DIR
fi
tsc
