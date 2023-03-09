---
id: basic-architecture
title: 基本アーキテクチャ
description: ここでは SOULs Functions の基本的なアーキテクチャについて説明します。
---

:::div{.info}
ここでは SOULs Functions の基本的なアーキテクチャについて説明します。
:::

![rspec](/imgs/gifs/souls-create-functions.gif)

## SOULs Functions の 全体像

SOULs は Google Cloud Functions を使用しています。

[Google Cloud Functions](https://cloud.google.com/functions)

- サーバーのプロビジョニング、管理、アップグレードが不要
- 負荷に応じた自動スケーリング
- 統合されたモニタリング、ロギング、デバッグ機能
- 最小権限の原則に基づいた、ロールごと、および関数ごとのレベルの組み込みセキュリティ
- ハイブリッド クラウド シナリオおよびマルチクラウド シナリオ向けの主要ネットワーキング機能

SOULs では Cloud Functions を使用することで、`Ruby` だけではなく、
`Node.js` や `Python`, `Go` と組み合わせてアプリケーションを作成することができます。

| ランタイム | 対応バージョン |
| ---------- | -------------- |
| Ruby       | 2.7, 2.6       |
| Node.js    | 16, 14, 12, 10 |
| Python     | 3.9, 3.8, 3.7  |
| Go         | 1.16, 1.13     |

## SOULs Functions のディレクトリ構造

`souls create functions` コマンドを使うと対話式で

ランタイムとバージョンを選択し、

Cloud Functions をデプロイするのに必要なファイルを自動で生成します。

```sh
$ souls create functions ${method_name}
```

SOULs Functions は `apps` ディレクトリに `worker` と同様に複数個の `functions` を作成することができます。

functions ディレクトリ名は

cf-${ランタイム名}-${関数名}

となります。

例えば、下記のように

| ランタイム | バージョン | 関数名  |
| ---------- | ---------- | ------- |
| Node.js    | 16         | method1 |
| Python     | 3.9        | method2 |

の SOULs Functions を作成すると、

`cf-node16-method1`

`cf-python39-method2`

という名前のフォルダーが作成され、

その中に Cloud Funcion へデプロイするのに必要なファイルが自動生成されます。

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api（API ディレクトリ）
│   ├── worker-mailer（Worker ディレクトリ）
│   ├── worker-scraper（Worker ディレクトリ）
│   ├── cf-node16-method1（Functions ディレクトリ）
│   ├── cf-python39-method2（Functions ディレクトリ）
│
├── config
├── github
│
```

## SOULs Functions コマンド

コマンド一覧を表示します。

`souls functions help`

```
$ souls functions help
Commands:
  souls functions all_url         # Get SOULs Functions All URL
  souls functions delete [name]   # Delete SOULs Functions
  souls functions deploy          # Deploy Cloud Functions
  souls functions describe        # Describe SOULs Functions
  souls functions dev             # Check SOULs Functions dev
  souls functions help [COMMAND]  # Describe subcommands or one specific subcommand
  souls functions url             # Get SOULs Functions URL
```

## SOULs Cloud Functions を作成する

- [Ruby ランタイム Cloud Functions を作成する](/ja/docs/guides/functions/create-ruby-cloud-functions)
- [Node.js ランタイム Cloud Functions を作成する](/ja/docs/guides/functions/create-nodejs-cloud-functions)
- [Python ランタイム Cloud Functions を作成する](/ja/docs/guides/functions/create-python-cloud-functions)
- [Go ランタイム Cloud Functions を作成する](/ja/docs/guides/functions/create-go-cloud-functions)
