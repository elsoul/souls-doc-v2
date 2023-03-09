---
id: basic-architecture
title: 基本アーキテクチャ
description: ここでは SOULs サーバーレス Ruby GraphQL Worker フレームワークの基本的なアーキテクチャについて説明します。
---

:::div{.info}
ここでは SOULs サーバーレス Ruby GraphQL Worker フレームワークの基本的なアーキテクチャについて説明します。
:::

## Worker の役割

ここでは下の図の赤枠部分の Worker について説明していきます。

![SOULs Worker アーキテクチャ](/imgs/docs/SOULs-architecture-worker.jpg)

開発を進めていくと、API サーバーとは分離して稼働させたいタスク処理などがでてきます。

タスク処理が多くなってきたら分離しよう。と思って一つのサーバーで開発始めると、後々に分離させるためのコストが膨大に膨れ上がってしまう可能性があります。

SOULs フレームワークでは データ処理は API に任せ、それ以外のタスク処理は Worker に配置します。

## SOULs Worker のディレクトリ構造

SOULs Worker のディレクトリ構造は以下のようになっています。

チュートリアルでは `mailer` と `scraper` という `worker-name` を使用して説明します。

`souls-app/apps/worker-mailer` ディレクトリ

```
souls-app
├── apps
│   ├── worker-mailer
│        ├── app
│        │    ├── models
│        │    ├── graphql
│        │          ├── queries
│        │          │     ├── base_query.rb
│        │          │
│        │          ├── types
│        │          │     ├── base
│        │          │
│        │          ├── s_o_u_ls_api_schema.rb
│        ├── config
│        │      ├── database.yml
│        │      ├── souls.rb
│        │
│        ├── constants
│        ├── db
│        ├── log
│        ├── spec
│        │    ├── factory
│        │    ├── models
│        │    ├── spec_helper.rb
│        │
│        ├── tmp
│        ├── app.rb
│        ├── Dockerfile
│        ├── Gemfile
│        ├── Gemfile.lock
│        ├── Procfile
```

Worker では Query でタスクの実行を行います。

API とは異なり、データの表示は行わないので、Mutation や Resolver は必要ありません。

:::div{.warning}
SOULs Worker では `query` のみに変更を加えます。

※`db`, `spec/factories`, `models` などに変更を加える場合は必ず API ディレクトリで行うようにしましょう。
:::

## Worker の作成

`souls create worker ${worker-name}` コマンドを使って Worker をリポジトリに追加します。

作成されるディレクトリ名は

`worker-${worker_name}`

になります。

```bash
$ souls create worker mailer
```

以下のように、`apps` に `worker-mailer` が追加されました。

`.github/workflow` の中にも `worker-mailer.yml` が自動で追加されているので、
デプロイはこれまでと変わらず Mailer へのコミット毎に自動で行われます。

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

`localhost:3000` にアクセスして

[http://localhost:3000](http://localhost:3000)

次のような画面が表示されれば成功です！

![SOULs Running](/imgs/docs/local-3000.png)

## コンソールの起動

SOULs フレームワークでは `souls c` コマンドにより、
アプリと同じ環境の irb を使用することができます。

```bash
$ souls c
irb(main):001:0>
```

本番環境

```bash
$ souls c --e=production
irb(main):001:0>
```

## 2 つめの Worker の追加

SOULs Worker では複数の Worker を簡単に追加することができます。

先程作成した `mailer` 同様に `scraper` という Worker を追加してみます。

```bash
$ souls create worker scraper
```

以下のように、`apps` に `worker-scraper` が追加されました。

`.github/workflow` の中にも `worker-scraper.yml` が自動で追加されているので、
デプロイ作業はこれまでと変わりはありません。

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api
│   ├── worker-mailer
│   ├── worker-scraper
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── worker-mailer.yml
│          ├── worker-scraper.yml
  .
  .
```

`config/souls.rb` の `config.workers` に

`scraper` が追加されました。

同様に、API ディレクトリの `config/souls.rb` も更新されています。

このように、複数の独立した Worker を追加していくことができます。

SOULs Worker の Port

[http://localhost:3000/playground](http://localhost:3000/playground)

Worker が 2 つ以上ある場合は、

`PORT` が

3001, 3002, 3003 ...

のように 3000 番台から順に増えていきます。

これらの紐付けは SOULs によって全て自動化されています。

## デプロイ

デプロイ作業はこれまでと同様に GitHub へ Push するだけです。

```bash
$ git add .
$ git commit -m "add mailer scraper"
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

`souls-${worker_name}-${query_file_name}`

例えば、

Mailer Worker の `new_comment_mailer.rb` の場合

`souls-worker-mailer-new-comment-mailer`

となります。

[Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list) へログインして、

Pub/Sub Topic と Pub/Sub Subscription が作成されていることを確認してみましょう。
