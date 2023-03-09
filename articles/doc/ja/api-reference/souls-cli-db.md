---
id: souls-cli-db
title: SOULs DB
description: SOULs DB コマンドはAPIサーバー構築のための補助ツールです
---

`souls db` コマンドでは主に `ActiveRecord` の `rake db:` コマンドを呼び出します。

テーブルの追加、削除、カラムの変更、追加、削除時に使います。

## souls help db

```bash
$ souls help db
Commands:
  souls db add_column [CLASS_NAME]            # Create ActiveRecord Migration File
  souls db change_column [CLASS_NAME]         # Create ActiveRecord Migration File
  souls db create                             # Create Database
  souls db create_migration [CLASS_NAME]      # Create ActiveRecord Migration File
  souls db drop_table [CLASS_NAME]            # Create ActiveRecord Migration File
  souls db help [COMMAND]                     # Describe subcommands or one specific subcommand
  souls db migrate                            # Migrate Database
  souls db migrate_reset                      # Reset Database
  souls db model [CLASS_NAME]                 # Generate Model Template
  souls db remove_column [CLASS_NAME]         # Create ActiveRecord Migration File
  souls db rename_column [CLASS_NAME]         # Create ActiveRecord Migration File
  souls db reset                              # Reset Database and Seed
  souls db rspec_model [CLASS_NAME]           # Generate Rspec Model Test from schema.rb
  souls db seed                               # Insert Seed Data
```

## souls db create_migration

下記コマンドと同じ

```bash
$ rake db:create_migration NAME=create_MODEL
```


## souls db create

下記コマンドと同じ

```bash
$ rake db:create
```

## souls db migrate

下記コマンドと同じ

```bash
$ rake db:migrate
```

## souls db migrate_reset

下記コマンドと同じ

```bash
$ rake db:migrate:reset
```

## souls db seed

下記コマンドと同じ

```bash
$ rake db:seed
```

## souls db reset

下記コマンドと同じ

```bash
$ rake db:reset
```

## souls db add_colmun

下記コマンドと同じ

```bash
$ rake db:create_migration NAME=add_column_to_MODEL
```

## souls db rename_colmun

下記コマンドと同じ

```bash
$ rake db:create_migration NAME=rename_column_to_MODEL
```

## souls db remove_colmun

下記コマンドと同じ

```bash
$ rake db:create_migration NAME=remove_column_to_MODEL
```

## souls db drop_table

下記コマンドと同じ

```bash
$ rake db:create_migration NAME=drop_table_to_MODEL
```
