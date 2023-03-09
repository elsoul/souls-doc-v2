---
id: create-nodejs-cloud-functions
title: Create Cloud Functions for Node.js runtime
description: This section describes how to create Cloud Functions for the Node.js runtime.
---

:::div{.info}
This section describes how to create Cloud Functions for the Node.js runtime. The SOULs Cloud Functions Node.js runtime defaults to Express.js routing on endpoints.
:::

The SOULs Cloud Functions Node.js runtime defaults to Express.js routing on endpoints.

[Express.js](https://expressjs.com/)

## Create SOULs Functions

Create `functions` using the `souls create functions` command.

```sh
$ souls create functions method1
✓ Created file ./apps/cf_nodejs16_method1/index.js
✓ Created file ./apps/cf_nodejs16_method1/package.json
✓ Created file ./apps/cf_nodejs16_method1/.env.yaml
```

## Directory structure of SOULs Nodejs runtime Cloud Functions

```
apps
├── cf_nodejs16_method1
│   ├── index.js
│   ├── package.json
│   ├── .env.yaml
```

Define the main function in `index.js` .

Here, Express.js routing is specified by the endpoint, so

You can have multiple endpoints.

index.js

```javascript:index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/souls-functions-get', (req, res)=>{
  res.json(req.query)
});

app.get('/souls-functions-get/:id', (req, res)=>{
  res.json(req.params)
});

app.post('/souls-functions-post', (req, res)=>{
  res.json(req.body)
});
exports.cf_nodejs16_task = app;
```

## Run SOULs Functions locally

Install `functions-framework` .

```sh
$ npm install --save-dev @google-cloud/functions-framework
```

```sh
$ npm start
> souls-cf-node16@0.0.1 start
> npx functions-framework --target=cf_nodejs16_method1

Serving function...
Function: cf_nodejs16_method1
Signature type: http
URL: http://localhost:8080/
```

Now access the link below and try calling `GET` Functions.

[http://localhost:8080/souls-functions-get/name](http://localhost:8080/souls-functions-get/name)

```
{
  "id": "name"
}
```

If the response is returned, it is successful.

## Deploy SOULs Nodejs Cloud Functions

Deploy using the SOULs functions command.

```sh
$ cd apps/cf_nodejs16_method1
$ souls functions deploy
```

## Check the URL of SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions url
```

## Check the URLs of all SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions all_url
```
