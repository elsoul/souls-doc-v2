---
id: souls-cli-upgrade
title: SOULs Upgrade
description: SOULs Upgrade コマンドはAPIサーバー構築のための補助ツールです
---

`souls upgrade` コマンドは主に `Gemfile` のアップデートの時に使います。

## souls help upgrade

```bash
$ souls help upgrade
Commands:
  souls upgrade gemfile         # Update Gemfile/Gemfile.lock Version
  souls upgrade help [COMMAND]  # Describe subcommands or one specific subcommand
```

## upgrade

SOULs コマンド:

```bash
$ souls upgrade gemfile
```

or

```bash
$ souls c
irb(main):002:0> SOULs.update_gemfile
```

### souls upgrade gemfile

Gemfile にある gem のバージョンを最新版に更新します。

```bash
$ souls upgrade gemfile
```

or

```bash
$ souls upgrade gem
```
