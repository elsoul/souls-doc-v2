---
id: souls-worker-deploy
title: SOULs Worker のデプロイ
description: このチューリアルは SOULs Worker を使ってメールを送信する方法を説明します。
---

:::div{.info}
このチューリアルは SOULs Worker を使ってメールを送信する方法を説明します。
:::

![create-worker](/imgs/gifs/create-worker.gif)

SOULs フレームワークには API と Worker の 2 つのタイプがあります。
API は主にデータをフロントエンドへ提供します。Worker は主にタスクの処理を行います

![SOULs Worker アーキテクチャ](/imgs/docs/SOULs-architecture-worker.jpg)

ここでは Mailer 作成し、SOULs Worker を追加してタスクサーバーとして切り分けてデプロイしてみましょう。

API と Worker はそれぞれ Google Cloud Run にデプロイされます。

## SOULs Worker の追加

SOULs Worker は以下のコマンドで作成することができます。

```bash
$ souls create worker ${worker_name}
```

ここでは `mailer` という Worker を追加します。

```bash
$ souls create worker mailer
```

SOULs フレームワークではマザーディレクトリ以下の `apps` 内に
各サービスが配置されます。

`souls new` コマンドではマザーと API ディレクトリを作成します。
`souls create worker` コマンドによって、Worker が追加されました。

作成されるディレクトリ名は

`worker-${worker_name}`

になります。

## 複数の SOULs Worker

SOULs API は一つですが、 Worker は複数個作成することができます。
メールの処理と、データを取得するスクレイパーなどのタスク処理は別サーバーで処理したい。
というような場面は実際の現場にはよく起こることです。

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api（API ディレクトリ）
│   ├── worker-mailer（Worker ディレクトリ）
│   ├── worker-scraper（Worker ディレクトリ）
│   ├── worker-batch（Worker ディレクトリ）
|   .
|   .
│
├── config
├── .github
  .
  .
```

## souls sync models の実行

今回は API と Worker で共通のデータベースを使います。
Worker ディレクトリで、
SOULs コマンドを使って Model に関連するファイルを API から作成します。

```bash
$ cd apps/worker-mailer
$ souls sync models
Synced! : ["db", "app/models", "spec/factories"]
```

以下の３つのディレクトリが API ディレクトリから作成されました。

`app/models`
`db`
`spec/factories`

## Mailer の追加

SOULs Worker の `graphql` ディレクトリの中の `queries` 内にジョブを定義していきます。
今回はメールタスクなので、`souls g job` コマンドの `--mailer` オプションを使って Mailer を作成しましょう。

### souls g job ${job_name} --mailer コマンドの実行

ブログに新しいコメントが入ったときにメールで通知するジョブを作成します。

`souls g job ${job_name} --mailer` コマンドを使うと
標準で Mailgun 用の Query が作成されます。

```bash
$ souls g job new_comment_mailer --mailer
Created file! : ./app/graphql/types/new_comment_mailer_type.rb
Created file! : ./app/graphql/queries/new_comment_mailer.rb
Created file! : ./spec/queries/jobs//new_comment_mailer_spec.rb
```

Mailer Query が作成されました。

```
app（Workerルートディレクトリ）
├── apps
│   ├── graphql
│   │     ├── queries
│   │     │       ├── base_query.rb
│   │     │       ├── new_comment_mailer.rb
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

SOULs Worker の Mailer はデフォルトで Mailgun を使用しています。

Mailgun については以下のリンクを参考にしてください。

[Mailgun ドキュメント](https://documentation.mailgun.com/en/latest/)

[Gem: mailgun-ruby](https://github.com/mailgun/mailgun-ruby)

### MailGun の使用

環境変数に `MAILGUN_KEY` と `MAILGUN_DOMAIN` を

`souls gh add_env` コマンドを使用して、追加しましょう。

```bash
$ souls gh add_env
Set Key: MAILGUN_KEY
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/mailer.yml
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
Updated file! : apps/mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/mailer.yml
✓ Set secret MAILGUN_DOMAIN for elsoul/souls-rubyworld
・
・
```

SOULs コマンドで作成された `new_comment_mailer.rb` ファイルの中の

`message_params` を

それぞれあなたの Mailgun の設定に書き換えてください。

```ruby:apps/worker/app/grahpql/queries/new_comment_mailer.rb
module Queries
  class NewCommentMailer < BaseQuery
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

### souls s で実行テスト

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
query {
  newCommentMailer {
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

## メール実行トリガーの追加

それでは SOULs API の方から、ブログ記事に新しいコメントが入ったときに Mailer を起動するように定義します。

`apps/api/app/graphql/mutations/base_mutation.rb` に定義されている `grahpql_query` メソッドを使って、Worker の Query を呼び出します。

```diff:apps/api/app/graphql/mutations/base/comment/create_comment.rb
module Mutations
  module Base::Comment
    class CreateComment < BaseMutation
      field :comment_edge, Types::CommentType.edge_type, null: false
      field :error, String, null: true

      argument :article_id, String, required: false
      argument :body, String, required: false
      argument :from, String, required: false
      argument :is_deleted, Boolean, required: false

      def resolve(args)
        _, article_id = SOULsApiSchema.from_global_id(args[:article_id])
        new_record = { **args, article_id: article_id.to_i }
        data = ::Comment.new(new_record)
        raise(StandardError, data.errors.full_messages) unless data.save

+       souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer")

        { comment_edge: { node: data } }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e)
      end
    end
  end
end
```

## Article に Comment エッジをつなげる

`apps/api/app/graphql/types/article_type.rb`

に `comment` field と

```diff
+ field :comments, [Types::CommentType], null: true
```

`comments` メソッドを追記します。

```diff
+ def comments
+   AssociationLoader.for(Article, :comment).load(object)
+ end
```

```ruby:apps/api/app/graphql/types/article_type.rb
module Types
  class ArticleType < BaseObject
    implements GraphQL::Types::Relay::Node

    global_id_field :id
    field :article_category, Types::ArticleCategoryType, null: false
    field :body, String, null: true
    field :comments, [Types::CommentType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :is_deleted, Boolean, null: true
    field :is_public, Boolean, null: true
    field :just_created, Boolean, null: true
    field :public_date, GraphQL::Types::ISO8601DateTime, null: true
    field :slug, String, null: true
    field :tags, [String], null: true
    field :thumnail_url, String, null: true
    field :title, String, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :user, Types::UserType, null: false

    def user
      RecordLoader.for(User).load(object.user_id)
    end

    def article_category
      RecordLoader.for(ArticleCategory).load(object.article_category_id)
    end

    def comments
      AssociationLoader.for(Article, :comment).load(object)
    end
  end
end

```

## API と Worker すべてを同時に起動

`souls s --all` コマンドを使って

SOULs API と Worker を起動します。

```bash
$ souls s --all
```

API と Worker が起動されました。

SOULs API

[http://localhost:4000/playground](http://localhost:4000/playground)

SOULs Worker

[http://localhost:3000/playground](http://localhost:3000/playground)

Worker が 2 つ以上ある場合は、

`PORT` が

3001、3002、3003 ...

のように番号順に増えていきます。

これらの紐付けは SOULs により完全に自動化されています。

SOULs API の GraphQL に以下のクエリを送信してみます。

```ruby
mutation {
  createComment(
    input: { articleId: "QXJ0aWNsZTox" from: "名無し" body: "コメント" }
  ) {
    commentEdge {
      node {
        id
        article {
          title
        }
        body
      }
    }
  }
}
```

成功すると以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "createComment": {
      "commentEdge": {
        "node": {
          "id": "Q29tbWVudDozMDE=",
          "article": {
            "title": "ブログタイトル"
          },
          "body": "コメント"
        }
      }
    }
  }
}
```

そして、コンソールの出力を確認してみます。

```bash
11:03:45 api.1    | 11:03:45 web.1   | D, [2021-08-15T11:03:45.999251 6609] DEBUG -- :   TRANSACTION (0.5ms)  BEGIN
11:03:46 api.1    | 11:03:46 web.1   | D, [2021-08-15T11:03:46.000219 6609] DEBUG -- :   Comment Create (0.7ms)  INSERT INTO "comments" ("article_id", "body", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["article_id", 99], ["body", "コメント"], ["created_at", "2021-08-15 11:03:45.994381"], ["updated_at", "2021-08-15 11:03:45.994381"]]
11:03:46 api.1    | 11:03:46 web.1   | D, [2021-08-15T11:03:46.005501 6609] DEBUG -- :   TRANSACTION (4.4ms)  COMMIT
11:03:46 api.1    | 11:03:46 web.1   | "{\"data\":{\"newCommentMailer\":{\"response\":\"Job done!\"}}}"
```

無事にコメントが入り、Worker から `Job done!` とレスポンスが返却されています。

メールが Mailgun を通じて送信されていることを確認してください。

## Query で引数を受け取る

さきほどの状態では、どのブログにコメントが入ったのかわかりません。

`NewCommentMailer` Query で引数を受け取り、ブログの情報も追加してメールを送ります。

Worker の `new_comment_mailer.rb` を編集します。

```diff:apps/worker/app/graphql/queries/new_comment_mailer.rb
module Queries
  class NewCommentMailer < BaseQuery
    description "Mail を送信します。"
    field :response, String, null: false

+    argument :article_id, Integer, required: true

-    def resolve
+    def resolve(args)
+     article = ::Article.find(args[:article_id])

      # First, instantiate the Mailgun Client with your API key
      mg_client = ::Mailgun::Client.new(ENV['MAILGUN_KEY'])

      # Define your message parameters
      message_params = {
        from: "postmaster@from.mail.com",
        to: "sending@to.mail.com",
        subject: "SOULs Mailer test!",
-       text: "It is really easy to send a message!"
+       text: "ブログ記事 ID:#{article.id}\n タイトル：#{article.title} \nにコメントが入りました！"
      }

      # Send your message through the client
      mg_client.send_message("YOUR-MAILGUN-DOMAIN", message_params)
      { response: "Job done!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
```

そして、SOULs API の実行トリガーにも引数を渡します。

```diff:apps/api/app/graphql/mutations/base/comment/create_comment.rb
- souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer")
+ souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer", args: { article_id: article_id.to_i })
```

もう一度実行してみましょう。

```bash
$ souls s --all
```

SOULs API

[http://localhost:4000/playground](http://localhost:4000/playground)

SOULs API の GraphQL に以下のクエリを送信してみます。

```ruby
mutation {
  createComment(
    input: { articleId: "QXJ0aWNsZTox" from: "名無し" body: "コメント" }
  ) {
    commentEdge {
      node {
        id
        article {
          title
        }
        body
      }
    }
  }
}
```

成功レスポンスが確認されると

![メールテスト](/imgs/docs/mail-test.png)

無事にメールが届きました。

## Worker のデプロイ

続いて、Worker のデプロイですが、

GitHub の `main` ブランチに Push するだけで完了です。

`.github/workflows/` ディレクトにある

`api.yml` と `worker-mailer.yml` が

`apps/api` または `apps/worker` 以下のディレクトリの変更を検知し、

変更がある場合には自動でデプロイされます。

これであとはビジネスロジックに集中することができます。

それではマザーディレクトリに戻ってデプロイしてみましょう。

:::div{.warning}
ここから先のステップでデプロイが成功すると Google Cloud のクレジットが使用開始されますが、

以下のリンクから $200 分の無料クレジットを獲得することができます。

[Google Cloud クレジットリンク](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)

SOULs フレームワークの本番環境では標準で `Google Cloud Pub/Sub` 使用する設定になっています。
本番環境でご利用の方は [Pub/Sub メッセージング](/ja/docs/guides/api/add-pubsub-messaging/) を参考にしてください。

また、本番環境で MailGun を使用するには Mailgun の White list に [Cloud NAT](/ja/docs/guides/worker/add-cloud-nat/) で設定した外向き静的 IP アドレスの IP の追加を行う必要があります。

※ デプロイをしなくてもこのチュートリアルを続けることはできます。[SOULs ガイド](/ja/docs/guides/api/basic-architecture/)へスキップしてください。
:::

```bash
$ git add .
$ git commit -m "add new_comment mailer"
$ git push origin main
```

デプロイまでに 5 分ほどかかります。

## タスクと Pub/Sub メッセージングの同期

SOULs フレームワークのタスク処理は、本番環境では Pub/Sub メッセージングを使用して、
タスクキューを入れます。

これにより、万が一タスクが終了する前にネットワークに不具合が生じた場合など、

** いつ、どこで、どのタスク処理が、終わったのか、終わらなかったのか **

の状態を把握できるようになります。

:::div{.warning}
※初回デプロイ後に Cloud Run の URL が発行されるので PubSub Sync は２回目以降のデプロイ時から実行されます。
:::

Worker のタスクを Pub/Sub メッセージングで呼び出せるようにするための設定は必要ありません。

GitHub Actions の Workflow でこのフローを自動化しています。

![pubsub](/imgs/docs/pubsub-workflow.png)

このワークフローでは

- Worker 内のすべての `query` ファイルをチェック
- 同一プロジェクト内の Google Cloud PubSub 上にある トピックとサブスクリプションのリストを取得
- Worker 内にある `query` ファイルに対する PubSub トピックを検索し、なければ作成
- PubSub トピックに対するファイルが `query` 内になければ PubSub トピックを削除

これらの作業を自動で行っています。

PubSub トピック名は

`souls-${worker_name}-${topic}`

例えば、

Mailer Worker の `new_comment_mailer.rb` の場合

`souls-worker-mailer-new-comment-mailer`

となります。

[Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list) へログインして、

Pub/Sub Topic と Pub/Sub Subscription が作成されていることを確認してみましょう。
