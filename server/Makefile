
FILES := $(shell find src -name '*.ts*' )
DOCKER_IMAGE ?= sample-wix-express-react-typescript
DOCKERID := docker.id


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
	rm -fr dist $(DOCKERID)

docker-build: $(DOCKERID)

$(DOCKERID): dist/index.js
	docker build --iidfile $(DOCKERID) -t $(DOCKER_IMAGE) .
	
.PHONY: build install test clean docker-build

