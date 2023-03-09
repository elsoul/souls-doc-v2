---
id: add-mailer
title: Mailer の追加
description: ここでは SOULs Worker の Mailer の使用方法について説明します。
---

:::div{.info}
ここでは SOULs Worker の Mailer の使用方法について説明します。
:::

## Mailer の追加

`souls create worker` コマンドを使用して、

Mailer Worker を追加します。

```bash
$ souls create worker mailer
```

以下のように、`apps` に `worker-mailer` が追加されました。

`.github/workflow` の中にも `worker-mailer.yml` が自動で追加されているので、
デプロイはこれまでと変わらずコミットごとに自動に行われます。

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api（サービスディレクトリ）
│   ├── worker-mailer（サービスディレクトリ）
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── worker-mailer.yml
  .
  .
```

`config/souls.rb` の `config.workers` に

`worker-mailer` が追加されました。

同様に、API ディレクトリの `config/souls.rb` も更新されています。

## API と Worker の Model 情報の同期

`souls sync models` コマンドを使って、

Model に関わるファイルを API から同期します。

```bash
$ cd apps/worker-mailer
$ souls sync models
```

## ローカルサーバーの起動

ローカルサーバーの起動
API と同様に `souls s` コマンドで起動することができます。

```bash
$ cd apps/worker-mailer
$ souls s
```

localhost:3000 にアクセスして

[http://localhost:3000](http://localhost:3000)

次のような画面が表示されれば成功です！

![SOULs Running](/imgs/docs/local-3000.png)

## Query の追加

SOULs Worker の `graphql` ディレクトリの中の `queries` 内に Mailer を定義していきます。

```bash
app（Workerルートディレクトリ）
├── apps
│   ├── graphql
│   │     ├── queries
│   │     │       ├── base_queries.rb
│   │     ├── types
│   │     │       ├── base
│   │
│   ├── models
│   ├── utils
│
├── config
├── log
├── spec
├── tmp
.
```

## souls g job ${job_name} --mailer コマンドの実行

ブログに新しいコメントが入ったときにメールで通知するジョブを作成します。

`souls g job ${job_name} --mailer` コマンドを使うと、
標準で `Mailgun` 用の `Query` が作成されます。

```bash
$ cd apps/worker-mailer
$ souls g job new_comment_mailer --mailer
Created file! : ./app/graphql/queries/new_comment_mailer.rb
🎉  Done!
```

Mailer Query が作成されました。

SOULs Worker の Mailer はデフォルトで Mailgun を使用しています。

Mailgun については以下のリンクを参考にしてください。

[Mailgun ドキュメント](https://documentation.mailgun.com/en/latest/)

[Gem: mailgun-ruby](https://github.com/mailgun/mailgun-ruby)

## Mailgun の使用

環境変数に `MAILGUN_KEY` と `MAILGUN_DOMAIN` を

`souls gh add_env` コマンドを使用して、追加しましょう。

```bash
$ souls gh add_env
Set Key: MAILGUN_KEY
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/worker-mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/worker-mailer.yml
✓ Set secret MAILGUN_KEY for elsoul/souls-rubyworld
・
・
```

```bash
$ souls gh add_env
Set Key: MAILGUN_DOMAIN
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/worker-mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/worker-mailer.yml
✓ Set secret MAILGUN_DOMAIN for elsoul/souls-rubyworld
・
・
```

SOULs コマンドで作成された `new_comment_mailer.rb` ファイルの中の

`message_params` を

それぞれあなたの Mailgun の設定に書き換えてください。

```ruby:apps/worker-mailer/app/grahpql/queries/new_comment_mailer.rb
module Queries
  class NewCommentMailer < BaseMutation
    description "Mail を送信します。"
    field :response, String, null: false

    def resolve
      # First, instantiate the Mailgun Client with your API key
      mg_client = ::Mailgun::Client.new(ENV['MAILGUN_KEY'])

      # Define your message parameters
      message_params = {
        from: "postmaster@from.mail.com",
        to: "sending@to.mail.com",
        subject: "SOULs Mailer test!",
        text: "It is really easy to send a message!"
      }

      # Send your message through the client
      mg_client.send_message(ENV['MAILGUN_DOMAIN'], message_params)
      { response: "Job done!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
```

## souls s で実行テスト

Worker を起動して、Mailer の動作確認をしてみます。

SOULs API と同様に `souls s` コマンドで Worker を起動することができます。

```bash
$ souls s
```

それでは

[localhostl:3000/playground](localhost:3000/playground)

にアクセスして、

GraphQL PlayGround が起動していることを確認してください。

そして、以下の Query を送信します。

Query

```ruby
mutation {
  newCommentMailer(input: {}) {
    response
  }
}
```

成功すると、以下のレスポンスが返却されます。

```json
{
  "data": {
    "newCommentMailer": {
      "response": "Job done!"
    }
  }
}
```

無事に Mailer が追加されました。
