---
id: souls-cli-server
title: SOULs Server
description: SOULs Server コマンドはAPIサーバー構築のための補助ツールです
---

`souls server` コマンドで SOULs アプリケーションを起動します。

## souls help server

```bash
$ souls help server
Usage:
  souls server

Options:
  [--all], [--no-all]  # Run All API & Workers

Run SOULs APP
```

## server

Foreman を使ってアプリを起動します。

### souls s

```bash
$ souls s
```

or

```bash
$ souls server
```

```ruby
system("foreman start -f Procfile.dev")
```

### souls server --all オプション

API と すべての Worker を起動します。

```bash
$ souls s --all
```

or

```bash
$ souls server --all
```

```ruby
Dir.chdir(SOULs.get_mother_path.to_s) do
  system("foreman start -f Procfile.dev")
end
```
