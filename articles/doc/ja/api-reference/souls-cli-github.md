---
id: souls-cli-github
title: SOULs Github
description: souls gh コマンドは GitHub Actions 環境構築のための補助ツールです
---

`souls github` コマンドでは GitHub CLI を使用することができます。

## souls help gh

```bash
$ souls gh help
Commands:
  souls github add_env --key, --key=KEY --value, --value=VALUE  # Add New env and Sync Github Secret
  souls github help [COMMAND]                                   # Describe subcommands or one specific subcommand
  souls github secret_set
```

## secret_set

`.env.production` で定義されている環境変数を GitHub Secret へ自動登録します。

```bash
$ souls gh secret_set
```

## add_env

`.github/workflows/*.yml`, `.env`, `apps/api/.env`

に環境変数を追加し、GitHub Secret へ同期させます。
対話式で `KEY` と `VALUE` を設定します。

```bash
$ souls gh add_env
KEY:
VALUE:
```
