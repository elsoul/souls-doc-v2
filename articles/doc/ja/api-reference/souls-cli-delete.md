---
id: souls-cli-delete
title: SOULs Delete
description: SOULs Delete コマンドはAPIサーバー構築のための補助ツールです
---

`souls delete` コマンドでは `souls generate` コマンドで自動生成した CRUD に関するファイル、テスト、型定義ファイルを削除します。

## souls help delete

```bash
$ souls help delete
Commands:
  souls delete connection [CLASS_NAME]                                     # Delete GraphQL Connection
  souls delete edge [CLASS_NAME]                                           # Delete GraphQL Edge
  souls delete help [COMMAND]                                              # Describe subcommands or one specific subcommand
  souls delete job [CLASS_NAME]                                            # Delete Job File in Worker
  souls delete manager [MANAGER_NAME] --mutation, --mutation=MUTATION      # Delete GraphQL Mutation Template
  souls delete mutation [CLASS_NAME]                                       # Delete GraphQL Mutation
  souls delete policy [CLASS_NAME]                                         # Delete Policy File Template
  souls delete query [CLASS_NAME]                                          # Delete GraphQL Query
  souls delete resolver [CLASS_NAME]                                       # Delete GraphQL Resolver
  souls delete rspec_factory [CLASS_NAME]                                  # Delete Rspec Factory Test from schema.rb
  souls delete rspec_job [CLASS_NAME]                                      # Delete Rspec Job Test Template
  souls delete rspec_manager [CLASS_NAME] --mutation, --mutation=MUTATION  # Delete Rspec Manager Test Template
  souls delete rspec_mutation [CLASS_NAME]                                 # Delete Rspec Mutation Test from schema.rb
  souls delete rspec_policy [CLASS_NAME]                                   # Delete Rspec Policy Test
  souls delete rspec_query [CLASS_NAME]                                    # Delete Rspec Query Test
  souls delete rspec_resolver [CLASS_NAME]                                 # Delete Rspec Resolver Test
  souls delete scaffold [CLASS_NAME]                                       # Delete Scaffold
  souls delete scaffold_all                                                # Delete Scaffold All Tables from schema.rb
  souls delete type [CLASS_NAME]                                           # Delete GraphQL Type
```

## scaffold

コマンドでは `souls g scaffold` コマンドで自動生成した CRUD に関するファイル、テストファイルを削除します。

```bash
$ souls delete scaffold MODEL_NAME
```

## type

GraphQL Type を削除します。

SOULs コマンド:

```bash
$ souls delete type MODEL_NAME
```

## connection

GraphQL Connection を削除します。

SOULs コマンド:

```bash
$ souls delete connection MODEL_NAME
```

## edge

GraphQL Edge を削除します。

SOULs コマンド:

```bash
$ souls delete edge MODEL_NAME
```

## model

Model を削除します。

SOULs コマンド:

```bash
$ souls delete model MODEL_NAME
```

## mutation

GraphQL Mutation を削除します。

SOULs コマンド:

```bash
$ souls delete mutation MODEL_NAME
```

## job

Worker に Job を追加します。

```bash
$ souls delete job $JOB_NAME
```

## job --mailer オプション

Mailer テンプレートの Mutation を作成します。

```bash
$ souls delete job $JOB_NAME --mailer
```

## policy

Pundit Policy を自動で生成します。

SOULs コマンド:

```bash
$ souls delete policy MODEL_NAME
```

## query

GraphQL Query を削除します。

SOULs コマンド:

```bash
$ souls delete query MODEL_NAME
```

## resolver

GraphQL Resolver を削除します。

SOULs コマンド:

```bash
$ souls delete resolver MODEL_NAME
```

## rspec_factory

RSpec Factory を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_factory MODEL_NAME
```

## rspec_model

RSpec Model を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_model MODEL_NAME
```

## rspec_mutation

RSpec Mutation を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_mutation MODEL_NAME
```

## rspec_policy

RSpec Policy を自動で生成します。

SOULs コマンド:

```bash
$ souls delete rspec_policy MODEL_NAME
```

## rspec_query

Rspec Query を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_query MODEL_NAME
```

## rspec_resolver

RSpec Resolver を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_resolver MODEL_NAME
```

## rspec_manager

RSpec Manager を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_manager MODEL_NAME
```

## rspec_job

RSpec Manager を削除します。

SOULs コマンド:

```bash
$ souls delete rspec_job MODEL_NAME
```
