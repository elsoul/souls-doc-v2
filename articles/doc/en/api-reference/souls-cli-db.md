---
id: souls-cli-db
title: SOULs DB
description: SOULs DB command is an auxiliary tool for building API server
---

`souls db` command primarily `ActiveRecord` 's `rake db:` command.

Used when adding, deleting, changing columns, adding, and deleting tables.

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

## souls db create

Same as the command below

```bash
$ rake db:create
```

## souls db migrate

Same as the command below

```bash
$ rake db:migrate
```

## souls db migrate_reset

Same as the command below

```bash
$ rake db:migrate:reset
```

## souls db seed

Same as the command below

```bash
$ rake db:seed
```

## souls db reset

Same as the command below

```bash
$ rake db:reset
```

## souls db add_colmun

Same as the command below

```bash
$ rake db:create_migration NAME=add_column_to_ MODEL
```

## souls db rename_colmun

Same as the command below

```bash
$ rake db:create_migration NAME=rename_column_to_ MODEL
```

## souls db remove_colmun

Same as the command below

```bash
$ rake db:create_migration NAME=remove_column_to_ MODEL
```

## souls db drop_table

Same as the command below

```bash
$ rake db:create_migration NAME=drop_table_to_ MODEL
```
