dev:
	export NODE_OPTIONS=--openssl-legacy-provider && \
	yarn install && \
	yarn run docs:dev

build:
	export NODE_OPTIONS=--openssl-legacy-provider && \
	yarn install && \
	yarn run docs:build
