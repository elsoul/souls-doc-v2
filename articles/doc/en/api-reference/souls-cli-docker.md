---
id: souls-cli-docker
title: SOULs Docker
description: SOULs Docker command is an auxiliary tool for building API server
---

`souls docker` command launches a `docker` It is used when setting up a database for development and test environments.

## souls help docker

```bash
$ souls help docker
Commands:
  souls docker help [COMMAND]  # Describe subcommands or one specific subcommand
  souls docker mysql           # Run MySQL Docker Container
  souls docker psql            # Run PostgreSQL13 Docker Container
```

### souls docker psql

Launch a PostgreSQL13 container using Docker.

SOULs command:

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

Launch a MySQL container using Docker.

SOULs command:

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
