---
id: souls-cli-sync
title: SOULs Sync
description: SOULs Sync コマンドはAPIサーバー構築のための補助ツールです
---

`souls sync` コマンドは主に API, Worker, クラウド間のファイルや設定を同期するときに使います。

## souls help sync

```bash
$ souls help sync
Commands:
  souls sync conf            # Sync config/souls.rb Endpoint with Google Cloud Run
  souls sync help [COMMAND]  # Describe subcommands or one specific subcommand
  souls sync models           # Sync Model, DB, Factory Files with API
  souls sync pubsub          # Sync Worker Jobs & Google Cloud Pubsub Subscriptions
```

## souls sync conf

`config/souls.rb` の内容を最新の状態に更新します。

```bash
$ souls sync conf
```

## souls sync models

API の Model に関するファイルを すべての Worker へ同期します。

```bash
$ souls sync models
```

## souls sync pubsub

このコマンドにより

- すべての Worker 内の mutation ファイルをチェック
- 同一プロジェクト内の Google Cloud PubSub 上にある トピックとサブスクリプションのリストを取得
- Worker 内にある mutation ファイルに対する PubSub トピックを検索し、なければ作成
- PubSub トピック に対するファイルが mutation 内になければ PubSub トピックを削除

これらの作業を自動で行っています。

```bash
$ souls sync pubsub
```
