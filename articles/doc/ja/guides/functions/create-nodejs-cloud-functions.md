---
id: create-nodejs-cloud-functions
title: Node.js ランタイム の Cloud Functions を作成する
description: ここでは Node.js ランタイム の Cloud Functions を作成する方法について説明します。
---

:::div{.info}
ここでは Node.js ランタイム の Cloud Functions を作成する方法について説明します。SOULs Cloud Functions の Node.js ランタイム では Express.js の ルーティングがエンドポイントにデフォルトで設定されています。
:::

SOULs Cloud Functions の Node.js ランタイム では Express.js の ルーティングがエンドポイントにデフォルトで設定されています。

[Express.js](https://expressjs.com/)

## SOULs Functions を作成する

`souls create functions` コマンドを使って `functions` を作成します。

```sh
$ souls create functions method1
✓ Created file ./apps/cf-nodejs16-method1/index.js
✓ Created file ./apps/cf-nodejs16-method1/package.json
✓ Created file ./apps/cf-nodejs16-method1/.env.yaml
```

## SOULs Nodejs ランタイム Cloud Functions のディレクトリ構造

```
apps
├── cf_nodejs16_method1
│   ├── index.js
│   ├── package.json
│   ├── .env.yaml
```

`index.js` にメイン関数を定義します。

ここでは Express.js の ルーティングをエンドポイントで指定しているので、

複数のエンドポイントを持つことができます。

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
exports.cfNodejs16Task = app;
```

## SOULs Functions をローカルで実行する

`functions-framework` をインストールします。

```sh
$ npm install --save-dev @google-cloud/functions-framework
```

```sh
$ npm start
> souls-cf-node16@0.0.1 start
> npx functions-framework --target=cf-nodejs16-method1

Serving function...
Function: cf-nodejs16-method1
Signature type: http
URL: http://localhost:8080/
```

それでは下のリンクにアクセスして `GET` の Functions を呼び出してみます。

[http://localhost:8080/souls-functions-get/name](http://localhost:8080/souls-functions-get/name)

```
{
  "id": "name"
}
```

とレスポンスが返却されれば成功です。

## SOULs Nodejs Cloud Functions のデプロイ

SOULs functions コマンドを使ってデプロイします。

```sh
$ cd apps/cf-nodejs16-method1
$ souls functions deploy
```

## SOULs Functions の URL を確認する

SOULs functions コマンドを使って確認します。

```sh
$ souls functions url
```

## すべての SOULs Functions の URL を確認する

SOULs functions コマンドを使って確認します。

```sh
$ souls functions all_url
```

## SOULs Functions を削除する

SOULs functions コマンドを使って削除します。

```sh
$ souls functions delete ${functions_name}
```
