---
id: psql
title: PostgreSQL インストール
description: ここでは PostgreSQL インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)
---

:::div{.info}
ここでは PostgreSQL インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)
:::

## PostgreSQL インストール

## Windows10 WLS2 (Ubuntu 20.04 LTS)

```bash
# Update
$ sudo apt update

# Install PostgreSQL
$ sudo apt install wget curl ca-certificates
$ wget -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
$ sudo apt update
$ sudo apt-get install postgresql postgresql-contrib
```

## MacOS (Catalina 10.xx.x)

```bash
# Install PostgreSQL (Mac env)
$ brew install postgresql
```
