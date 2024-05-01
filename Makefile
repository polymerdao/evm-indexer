npm-install:
	npm install

build: npm-install
	npx tsc -p tsconfig.json

build-metrics: build
	npx esbuild scripts/metrics.ts --bundle --platform=node --outfile=bin/metrics.cjs