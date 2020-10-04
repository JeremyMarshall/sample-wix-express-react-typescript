
FILES := $(shell find src -name '*.ts*' )


build: build/index.html

package-lock.json: package.json
	npm install 

coverage.lcov: $(FILES)
	npm run coverage
	npm run codecov

build/index.html: package-lock.json tsconfig.json $(FILES)
	npm run build 

install: package-lock.json

test: coverage.lcov

clean:
	rm -fr build
	
.PHONY: build clean

