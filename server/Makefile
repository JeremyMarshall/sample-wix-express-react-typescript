
FILES := $(shell find src -name '*.ts*' )


build: dist/index.js

package-lock.json: package.json
	npm install 

coverage.lcov: $(FILES)
	npm run coverage
	npm run codecov

dist/index.js: package-lock.json tsconfig.json $(FILES)
	npm run build 

install: package-lock.json

test: coverage.lcov

clean:
	rm -fr dist
	
.PHONY: install  build test clean

