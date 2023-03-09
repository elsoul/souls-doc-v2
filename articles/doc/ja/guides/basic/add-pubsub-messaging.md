---
id: add-pubsub-messaging
title: Pub/Sub メッセージング
description: ここでは Google Cloud Pub/Sub を使って SOULs Worker にキューを入れる方法について説明します。
---

:::div{.info}
ここでは Google Cloud Pub/Sub を使って SOULs Worker にキューを入れる方法について説明します。
:::

SOULs フレームワークではすべての Worker に含まれるタスクに対して、自動で Topic と subscription を作成します。

この章では [SOULs Worker のデプロイ](/ja/docs/tutorial/souls-worker-deploy/) を終了し、Worker がデプロイされていることが前提です。

## タスクと Pub/Sub メッセージングの自動同期

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

`souls-${worker_name}-${query_file_name}`

例えば、

Mailer Worker の `new_comment_mailer.rb` の場合

`souls-worker-mailer-new-comment-mailer`

となります。

[Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list) へログインして、

Pub/Sub Topic と Pub/Sub Subscription が作成されていることを確認してみましょう。

## Mutation にキューを実装する

ここではチュートリアル [SOULs Worker のデプロイ](/ja/docs/tutorial/souls-worker-deploy/) で用意した

`create_comment.rb` の Mutation を編集します。

### souls_make_graphql_query メソッドの呼び出し

```diff:apps/apis/graphql/mutations/base/comments/create_comment.rb
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
        data = ::Comment.new(args)
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

`ENV["RACK_ENV"]` が `production` のときは、 Google Cloud Pub/Sub キューを入れ、
`development` のときには、API から Worker へ `souls_post_to_dev` メソッドが実行されます。

## ローカルで API 、Worker 間の通信を確認

`souls s --all` コマンドを使って、API と Worker をそれぞれ同時に起動します。

```bash
$ souls s --all
```

API の `create_comment` からコメントを追加してみます。

[localhost:4000/playground](localhost:4000/playground)

サンプルクエリ

```ruby
mutation {
  createComment(input: {
    articleId: "QXJ0aWNsZTox"
    from: "名無し"
    body: "コメント"
  }) {
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

成功すると以下のようなレスポンスが返却され

```json
{
  "data": {
    "createComment": {
      "commentEdge": {
        "node": {
          "id": "Q29tbWVudDoxNTg=",
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

![メールテスト](/imgs/docs/mail-test.png)

無事にメールが送信されました。

## デプロイ

それでは本番環境にデプロイして、

Pub/Sub メッセージングを使用して、

Worker を動かしてみましょう。

マザーディレクトリ で変更を GitHub にコミットしましょう。

```bash
$ git add .
$ git commit -m "add pub/sub messaging to new_comment_mailer"
$ git push origin main
```

## 本番環境で PubSub キューを入れる

:::div{.warning}
※ ここから先のステップは SOULs Worker 基本ガイドの [Mailer の追加](/ja/docs/guides/worker/add-mailer/) と [Scraper の追加](/ja/docs/guides/worker/add-scraper/) で作成した `Worker` と `Mutation` を使用します。

先に [SOULs Worker 基本ガイド](/ja/docs/guides/worker/basic-architecture/) を読むことをお勧めします。
:::

## Mailer PubSub メッセージングの確認

ここでは POST を送信するツールとして Postman を使います。

- [Postman](https://www.postman.com/)

サンプルクエリ

```ruby
mutation {
  createComment(input: {
    articleId: "QXJ0aWNsZTox"
    from: "名無し"
    body: "コメント"
  }) {
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

![サンプルクエリ例](/imgs/docs/postman.png)

[Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list) へログインして、

Pub/Sub Topic と Pub/Sub Subscription が実行されていることを確認してみましょう。

![Google Cloud console Pub/Sub](/imgs/docs/pubsub-console.png)

メッセージリクエストのパブリッシュ数のグラフでキューが入っていることがわかります。

そしてメールをが届いていれば成功です。

もし、メールが届かない場合は、

[外向きの静的 IP アドレスの設定](/ja/docs/guides/worker/add-cloud-nat/) をよく確認してみてください。

## Scraper PubSub メッセージングの確認

[Scraper の追加](/ja/docs/guides/worker/add-scraper/) で作成した SeinoScraper にキューを入れる Mutation を API に追加します。

SOULs API では CRUD に関するファイルは

`app/graphql/mutations/base`

内で定義されていました。

今回のような、タスクにキューを入れる場合には同様に Manager を作成します。

### Manager の作成

```bash
$ souls g manager task --mutation=seino_scraper
Created file! : ./app/graphql/mutations/managers/task_manager/seino_scraper.rb
🎉  Done!
```

### Mutation の編集

引数に、

送り元郵便番号, 送り先郵便番号, 到着年, 到着月, 到着日

取って、PubSub メッセージを発行します。

```ruby:app/graphql/mutations/managers/task_manager/seino_scraper.rb
module Mutations
  module Managers::TaskManager
    class SeinoScraper < BaseMutation
      description "seino_scraper description"

      field :response, String, null: false

      argument :day, Integer, required: true
      argument :from_zipcode, String, required: true
      argument :month, Integer, required: true
      argument :to_zipcode, String, required: true
      argument :year, Integer, required: true

      def resolve(args)
        payload = {
          from_zipcode: args[:from_zipcode],
          to_zipcode: args[:to_zipcode],
          year: args[:year],
          month: args[:month],
          day: args[:day]
        }

        souls_worker_trigger(worker_name: "worker-scraper", query_file_name: "seino_scraper", args: payload)
        { response: "queued!" }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
```

### デプロイ

それでは マザーディレクトリ に戻ってデプロイしてみましょう。

```bash
$ cd ...
$ git add .
$ git commit -m "add task_manager/seino_scraper"
$ git push origin main
```

### Postman の実行

Mailer と同様に、Postman でリクエストを送信します。

サンプルクエリ

```ruby
mutation {
  seinoScraper(input: {
    fromZipcode: "1460082"
    toZipcode: "2310847"
    year: 2021
    month: 1
    day: 20
  }) {
    response
  }
}
```

成功すると以下のようなレスポンスが返却されます。

![GraphQL レスポンス](/imgs/docs/postman-scraper.png)

そして

![スクレイパー成功](/imgs/docs/seino-slack.png)

無事、Slack に通知がきました。
