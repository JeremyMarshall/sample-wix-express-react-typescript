

DOCKER_IMAGE ?= sample-wix-express-react-typescript

build: copy-client build-server

install:
	$(MAKE) -C client install
	$(MAKE) -C server install

test:
	$(MAKE) -C client test
	$(MAKE) -C server test

build-client:
	$(MAKE) -C client build

build-server:
	$(MAKE) -C server build


copy-client: build-client
	rm -fr server/src/public/dash
	cp -r client/build server/src/public/dash

codecov:
	codecov

docker-build: build-client build-server
	docker build -t $(DOCKER_IMAGE) server
	
clean:
	$(MAKE) -C client clean
	$(MAKE) -C server clean

	
.PHONY: install test build build-client copy-client build-server codecov clean

