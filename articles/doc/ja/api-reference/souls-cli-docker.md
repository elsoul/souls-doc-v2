---
id: souls-cli-docker
title: SOULs Docker
description: SOULs Docker コマンドはAPIサーバー構築のための補助ツールです
---

`souls docker` コマンドでは `docker` コンテナを立ち上げます。
開発、テスト環境のデータベースを立ち上げる時に使います。

## souls help docker

```bash
$ souls help docker
Commands:
  souls docker help [COMMAND]  # Describe subcommands or one specific subcommand
  souls docker mysql           # Run MySQL Docker Container
  souls docker psql            # Run PostgreSQL13 Docker Container
```

### souls docker psql

Docker を使って PostgreSQL13 のコンテナを立ち上げます。

SOULs コマンド:

```bash
$ souls docker psql
```

```ruby
def psql
  system(
    "docker run --rm -d \
      -p 5433:5432 \
      -v postgres-tmp:/var/lib/postgresql/data \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=souls_test \
      postgres:13-alpine"
  )
  system("docker ps")
end
```

### souls docker mysql

Docker を使って MySQL のコンテナを立ち上げます。

SOULs コマンド:

```bash
$ souls docker mysql
```

```ruby
def mysql
  system(
    "docker run --rm -d \
      -p 3306:3306 \
      -v mysql-tmp:/var/lib/mysql \
      -e MYSQL_USER=mysql \
      -e MYSQL_ROOT_PASSWORD=mysql \
      -e MYSQL_DB=souls_test \
      mysql:latest"
  )
  system("docker ps")
end
```
