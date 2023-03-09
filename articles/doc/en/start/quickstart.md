---
id: quickstart
title: Quick start
description: This page describes installation process and initialization of GraphQL.
---

You can build the GraphQL API immediately by installing the required packages for SOULs.

![souls-new](/imgs/gifs/souls-new-video.gif)

## Installation of required packages

- [Docker](https://www.docker.com)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Ruby](/docs/dependencies/ruby/)
- [PostgreSQL](/docs/dependencies/psql/)
- [Redis](/docs/dependencies/redis/)
- [Github CLI](/docs/dependencies/github/)

## Github CLI Auth login

```bash
$ gh auth login
```

## Gcloud Auth Login

```bash
$ gcloud auth application-default login
```

## Install SOULs

```bash
# Install SOULs
# $ gem install souls
# Check version
# $ souls -v
```

## Creating a SOULs GraphQL API application

Create a new application using the SOULs command.

Executing the `souls new` command creates an empty app with an API:

```bash
$ souls new souls-app
$ cd apps/api
```

The next commands use the API configuration, so `cd souls/apps/api` moves us to the appropriate directory.

## Start PostgreSQL Docker container

Use the SOULs command to start the Docker container for PostgreSQL13.

Executing the `souls docker` command

```bash
$ souls docker psql
```

## Database Creation & Migration

Use the SOULs `db` commands to create and migrate the database.

```bash
$ souls db create
$ souls db migrate
```

## Launch SOULs GraphQL API

Invoke the SOULs GraphQL API using the SOULs `s` command.

```bash
$ souls s
```

Next, access to

[localhost:4000](http://localhost:4000)

![localhost:4000](/imgs/docs/localhost.png)

## SOULs CLI - Standard Commands

```bash
$ souls help
  Commands:
    souls console              # Run IRB Console
    souls create [COMMAND]     # SOULs Create Worker
    souls db [COMMAND]         # SOULs DB Commands
    souls delete [COMMAND]     # SOULs Delete Commands
    souls docker [COMMAND]     # SOULs Docker Commands
    souls functions [COMMAND]  # SOULs functions Commands
    souls gcloud [COMMAND]     # SOULs Gcloud Commands
    souls generate [COMMAND]   # SOULs Generate Commands
    souls github [COMMAND]     # SOULs Github Commands
    souls help [COMMAND]       # Describe available commands or one specific command
    souls new [APP_NAME]       # Create SOULs APP
    souls server               # Run SOULs APP
    souls sync                 #  SOULs Sync Commands
    souls test                 # Run Rspec & Rubocop
    souls update [COMMAND]     # SOULs Update Commands
    souls upgrade [COMMAND]    # SOULs Upgrade Commands
    souls version              # SOULs Version
```

SOULs framework comes with built-in testing, type-checks and versioning. You can view these from the `SOULs CLI` commands, which we'll introduce in this section.


## Test --RSpec & Rubocop

Use the SOULs `test` command to perform RSpec tests and Rubocop formatting.

```bash
$ souls test
```

These settings are defined in the following files.

`apps/api/.rubocop.yml`

`apps/api/spec/rspec_helper.rb`

## Gemfile & Gemfile.lock Automatic update

Use the SOULs `upgrade` command to update `Gemfile` and `Gemfile.lock` to the latest version.

```bash
$ souls upgrade gemfile
```

![gem-update](/imgs/docs/gem-update.png)

If you want to lock the versions of gems, they can be defined as the array of `config.fixed_gems` in the `Gemfile`.

```ruby:apps/api/config/souls.rb
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "api"
  config.fixed_gems = [ "selenium-webdriver", "spring" ]
  config.workers = []
end
```
