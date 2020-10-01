[![codecov](https://codecov.io/gh/JeremyMarshall/sample-wix-express-react-typescript/branch/master/graph/badge.svg)](https://codecov.io/gh/JeremyMarshall/sample-wix-express-react-typescript)
[![Build Status](https://travis-ci.org/JeremyMarshall/sample-wix-express-react-typescript.svg?branch=master)](https://travis-ci.org/JeremyMarshall/sample-wix-express-react-typescript)
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# sample-wix-express-react-typescript

This is an evolution of the [sample wix rest app](https://github.com/wix-incubator/sample-wix-rest-app.git)

It differs in that it has a react front end and an express backend. The whole thing is [typescript](https://www.typescriptlang.org)

It is split into two 
* [client](./client) which is react
* [server](./server) which is express

The react part is built separately and served by the server via the static directory

Or you can run the client on port 3000 and the server on port 5000 and the client will proxy to the server

There is a [Makefile](./Makefile) to test, build and create a docker image

You can also run the `npm` commands from the subdirectories

## Configuration

Read the sample-wix-res-app readme!

The setup is the same with ngrok and creating an app

| Wix field | value | 
| --------- | ----- |
| Redirect URL | `https://<ngrok>/api/wix/login` |
| App URL | `https://<ngrok>/api/wix/signup` |

Add a dashboard component with URL
https://<ngrok>/dash
  
Add a webhook for App Management -> App removed
`https://<ngrok>/api/wix/webhooks/removed`
  
## Environment

You will need a file in server/env/development.env
```
# Environment
NODE_ENV=development

# Server
PORT=5000
HOST=localhost

# WIX
APP_ID=<app key in wix>
PUBLIC_KEY=<base64 encoded wix public key>
SECRET=<secret>
```
And a similar one for production

## Etcd

Áou will need an etcd server to keep track of the refresh tokens for your users.

## How it works

Wix sends an instance token when your uses call your app

This uses that token as a header to the rest calls to serve data

That token is used to find the instance, then the refresh token then a JSON token to validate requests

## CI

There is a working travis plan and a codecov coverage plan

## TODO

Better documentation
fix the deprecated packages
write some actual tests
make some nice react components
the docker image can't get to the etcd server on a mac
  
 



