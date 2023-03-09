---
id: create-ruby-cloud-functions
title: Ruby ランタイム の Cloud Functions を作成する
description: ここでは Ruby ランタイム の Cloud Functions を作成する方法について説明します。
---

:::div{.info}
ここでは Ruby ランタイム の Cloud Functions を作成する方法について説明します。SOULs Cloud Functions の Ruby ランタイム では Sinatra の ルーティングがエンドポイントにデフォルトで設定されています。
:::

SOULs Cloud Functions の Ruby ランタイム では Sinatra の ルーティングがエンドポイントにデフォルトで設定されています。

[Sinatra](https://github.com/sinatra/sinatra)

## SOULs Ruby ランタイム Cloud Functions を作成する

`souls create functions` コマンドを使って `functions` を作成します。

```sh
$ souls create functions method1
✓ Created file ./apps/cf-ruby27-method1/app.rb
✓ Created file ./apps/cf-ruby27-method1/Gemfile
✓ Created file ./apps/cf-ruby27-method1/.env.yaml
```

## SOULs Ruby ランタイム Cloud Functions のディレクトリ構造

```
apps
├── cf_ruby27_method1
│   ├── app.rb
│   ├── Gemfile
│   ├── .env.yaml
```

`app.rb` にメイン関数を定義します。

ここでは `Sinatra` の ルーティングをエンドポイントで指定しているので、

複数のエンドポイントを持つことができます。

```ruby:app.rb
require "functions_framework"
require "sinatra/base"
require "dotenv/load"

class App < Sinatra::Base
  get "/souls-functions-get/:name" do
    "SOULs Functions Job Done! - #{params['name']}"
  end

  post "/souls-functions-post" do
    params = JSON.parse(request.body.read)
    "SOULs Functions Job Done! - #{params['name']}"
  end
end

FunctionsFramework.http("cf-ruby27-method1") do |request|
  App.call(request.env)
end
```

## SOULs Functions をローカルで実行する

```sh
$ bundle install
$ souls functions dev
I, [2021-12-30T21:49:48.089478 #7135]  INFO -- : FunctionsFramework v0.11.0
I, [2021-12-30T21:49:48.089532 #7135]  INFO -- : FunctionsFramework: Loading functions from "./app.rb"...
I, [2021-12-30T21:49:48.218867 #7135]  INFO -- : FunctionsFramework: Looking for function name "souls_functions"...
I, [2021-12-30T21:49:48.218926 #7135]  INFO -- : FunctionsFramework: Starting server...
I, [2021-12-30T21:49:48.230537 #7135]  INFO -- : FunctionsFramework: Serving function "souls_functions" on port 8080...
```

それでは下のリンクにアクセスして `GET` の Functions を呼び出してみます。

[http://localhost:8080/souls-functions-get/hello-world](http://localhost:8080/souls-functions-get/hello-world)

```
SOULs Functions Job Done! - hello-world
```

とレスポンスが返却されれば成功です。

## SOULs Ruby ランタイム Cloud Functions のデプロイ

SOULs functions コマンドを使ってデプロイします。

```sh
$ cd apps/cf-ruby27-method1
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
