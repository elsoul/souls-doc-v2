---
id: quickstart
title: クイックスタート
description: ここでは SOULs に必要なパッケージをインストールすれば、すぐに GraphQL API を構築できることを確認します。
---

:::div{.info}
ここでは SOULs に必要なパッケージをインストールすれば、すぐに GraphQL API を構築できることを確認します。
:::

![souls-new](/imgs/gifs/souls-new-video.gif)

## 必要なパッケージのインストール

- [Docker](https://www.docker.com)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Ruby](/ja/docs/dependencies/ruby/)
- [PostgreSQL](/ja/docs/dependencies/psql/)
- [Redis](/ja/docs/dependencies/redis/)
- [Github CLI](/ja/docs/dependencies/github/)

## Github CLI Auth ログイン

```bash
$ gh auth login
```

## Gcloud Auth ログイン

```bash
$ gcloud auth application-default login
```

## SOULs のインストール

```bash
# SOULs を インストール
$ gem install souls

# バージョンチェック
$ souls -v
```

## SOULs GraphQL API アプリケーションの作成

SOULs コマンドを利用して、新しいアプリケーションを作成します。

`souls new` コマンドの実行

```bash
$ souls new souls-app
```

SOULs API ディレクトリに移動します。

```bash
$ cd apps/api
```

## PostgreSQL Docker コンテナの起動

SOULs コマンドを利用して、PostgreSQL13 の Docker コンテナを起動します。

`souls docker` コマンドの実行

```bash
$ souls docker psql
```

## データベースの作成 & Migration

SOULs コマンドを利用して データベースの作成及び Migration を行います。

`souls db` コマンドの実行

```bash
$ souls db create
$ souls db migrate
```

## SOULs GraphQL API の起動

SOULs コマンドを利用して SOULs GraphQL API を起動します。

`souls s` コマンドの実行

```bash
$ souls s
```

それでは

[localhost:4000](http://localhost:4000)

へアクセスしてみましょう。

![localhost:4000](/imgs/docs/localhost.png)

さあこれでアプリを作る準備は完了です。

## SOULs CLI - 補助コマンド

SOULs フレームワークには アプリケーションを開発する上で役に立つ `SOULs CLI` が用意されています。

`souls help` コマンドの実行

```bash
  $ souls help
    Commands:
      souls console              # Run IRB Console
      souls create [COMMAND]     # SOULs Create Worker
      souls db [COMMAND]         # SOULs DB Commands
      souls delete [COMMAND]     # SOULs Delete Commands
      souls docker [COMMAND]     # SOULs Docker Commands
      souls functions [COMMAND]  # SOULs functions Commands
      souls gcloud [COMMAND]     # SOULs Gcloud Commands
      souls generate [COMMAND]   # SOULs Generate Commands
      souls github [COMMAND]     # SOULs Github Commands
      souls help [COMMAND]       # Describe available commands or one specific command
      souls new [APP_NAME]       # Create SOULs APP
      souls server               # Run SOULs APP
      souls sync                 #  SOULs Sync Commands
      souls test                 # Run Rspec & Rubocop
      souls update [COMMAND]     # SOULs Update Commands
      souls upgrade [COMMAND]    # SOULs Upgrade Commands
      souls version              # SOULs Version
```

SOULs フレームワークでは テスト、バージョン管理と共に開発を進めていきます。
以下によく使う `SOULs CLI` コマンドを紹介します。

### テスト - RSpec & Rubocop

SOULs コマンドを利用して RSpec テスト、 Rubocop フォーマットを行います。

`souls test` コマンドの実行

```bash
$ souls test
```

これらの設定は以下のファイル内で定義されています。

`apps/api/.rubocop.yml`

`apps/api/spec/rspec_helper.rb`

### Gemfile & Gemfile.lock 自動更新

SOULs コマンドを利用して `Gemfile` 、 `Gemfile.lock` を最新のバージョンに更新します。

`souls upgrade` コマンドの実行

```bash
$ souls upgrade gemfile
```

![gem-update](/imgs/docs/gem-update.png)

特定の `gem` のバージョンを固定したい場合には

`Gemfile` の自動更新除外設定は以下ファイル内

`config.fixed_gems` の配列の中で定義することができます。

```ruby:apps/api/config/souls.rb
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "api"
  config.fixed_gems = ["selenium-webdriver", "spring"]
  config.workers = []
end
```
