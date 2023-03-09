---
id: souls-cli-console
title: SOULs Console
description: SOULs Console コマンドはAPIサーバー構築のための補助ツールです
---

`souls console` コマンドは主にデバッグ時に使用します。

## souls help console

```bash
$ souls help console
Usage:
  souls console

Options:
  --e, [--env=ENV]  # Difine APP Enviroment - development | production
                    # Default: development

Run IRB Console
```

## console

アプリと同じ環境の irb を起動します。

## souls c

```bash
$ souls console
```

or

```bash
$ souls c
```

は irb を起動しています。

```bash
$ bundle exec irb
```
