#!/usr/bin/zsh
docker run -it --rm --env-file=.env -e "CONFIG=$(cat docsearch.json | jq -r tostring)" algolia/docsearch-scraper
