

DIRS := client server
DOCKER_IMAGE ?= sample-wix-express-react-typescript


install:
	npm install --prefix client
	npm install --prefix server

test:
	npm run coverage --prefix client
	npm run codecov --prefix client
	npm run coverage --prefix server
	npm run codecov --prefix server

build-client:
	npm run build --prefix client

build-server:
	npm run build --prefix server

build: copy-client build-server

copy-client: build-client
	rm -fr server/src/public/dash
	cp -r client/build server/src/public/dash

codecov:
	codecov

docker-build: build-client build-server
	docker build -t $(DOCKER_IMAGE) server
	
	
.PHONY: install test build-client build-server build copy-client codecov

