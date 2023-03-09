---
id: souls-cli-create
title: SOULs Create
description: SOULs Create コマンドはAPIサーバー構築のための補助ツールです
---

`souls create` コマンドで `Worker` を作成します。

## souls help create

```bash
$ souls help create
Commands:
  souls create functions [name]  # Create SOULs functions
  souls create help [COMMAND]    # Describe subcommands or one specific subcommand
  souls create worker [name]     # Create SOULs Worker
```

## souls create worker

`Worker` の名前を指定して実行します。

```bash
$ souls create worker ${worker_name}
```

## souls create functions

`Cloud Functions` の名前を指定して実行します。

```bash
$ souls create functions ${functions_name}
```
