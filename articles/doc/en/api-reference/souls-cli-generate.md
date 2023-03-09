---
id: souls-cli-generate
title: SOULs Generate
description: SOULs Generate command is an auxiliary tool for building API server
---

`souls generate` command automatically generates the files, tests, and type definition information required for CRUD based on `schema.rb`

## souls help generate

```bash
$ souls help generate
Commands:
  souls generate connection [CLASS_NAME]                                     # Generate GraphQL Connection from schema.rb
  souls generate delete_all  [CLASS_NAME]                                    # Generate Scaffold All Tables from schema.rb
  souls generate edge [CLASS_NAME]                                           # Generate GraphQL Edge from schema.rb
  souls generate help [COMMAND]                                              # Describe subcommands or one specific subcommand
  souls generate job [CLASS_NAME]                                            # Generate Job File in Worker
  souls generate manager [MANAGER_NAME] --mutation, --mutation=MUTATION      # Generate GraphQL Mutation Template
  souls generate mutation [CLASS_NAME]                                       # Generate GraphQL Mutation from schema.rb
  souls generate policy [CLASS_NAME]                                         # Generate Policy File Template
  souls generate query [CLASS_NAME]                                          # Generate GraphQL Query from schema.rb
  souls generate resolver [CLASS_NAME]                                       # Generate GraphQL Resolver from schema.rb
  souls generate rspec_factory [CLASS_NAME]                                  # Generate Rspec Factory Test from schema.rb
  souls generate rspec_job [CLASS_NAME]                                      # Generate Rspec Job Test Template
  souls generate rspec_manager [CLASS_NAME] --mutation, --mutation=MUTATION  # Generate Rspec Manager Test Template
  souls generate rspec_mutation [CLASS_NAME]                                 # Generate Rspec Mutation Test from schema.rb
  souls generate rspec_policy [CLASS_NAME]                                   # Generate Rspec Policy Test from schema.rb
  souls generate rspec_query [CLASS_NAME]                                    # Generate Rspec Query Test from schema.rb
  souls generate rspec_resolver [CLASS_NAME]                                 # Generate Rspec Resolver Test from schema.rb
  souls generate scaffold [CLASS_NAME]                                       # Generate Scaffold from schema.rb
  souls generate scaffold_all                                                # Generate Scaffold All Tables from schema.rb
  souls generate type [CLASS_NAME]                                           # Generate GraphQL Type from schema.rb
```

## scaffold

The scaffold command ( `souls g` ) provides CRUD and files needed for testing

It is automatically generated from `db/schema.rb`

```bash
$ souls g scaffold MODEL_NAME
```

## type

GraphQL Type is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g type MODEL_NAME
```

## connection

GraphQL Connection is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g connection MODEL_NAME
```

## edge

GraphQL Edge is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g edge MODEL_NAME
```

## model

Model is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g model MODEL_NAME
```

## mutation

GraphQL Mutation is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g mutation MODEL_NAME
```

## job

Add a Job to the Worker.

```bash
$ souls g job JOB_NAME
```

## job --mailer option

Create a Mutation for the Mailer template.

```bash
$ souls g job JOB_NAME --mailer
```

## policy

Automatically generate Pundit Policy.

SOULs command:

```bash
$ souls g policy MODEL_NAME
```

## query

GraphQL Query is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g query MODEL_NAME
```

## resolver

GraphQL Resolver is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g resolver MODEL_NAME
```

## rspec_factory

RSpec Factory is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_factory MODEL_NAME
```

## rspec_model

RSpec Model is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_model MODEL_NAME
```

## rspec_mutation

RSpec Mutation is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_mutation MODEL_NAME
```

## rspec_policy

RSpec Policy is automatically generated.

SOULs command:

```bash
$ souls g rspec_policy MODEL_NAME
```

## rspec_query

Rspec Query is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_query MODEL_NAME
```

## rspec_resolver

RSpec Resolver is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_resolver MODEL_NAME
```

## rspec_manager

RSpec Manager is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_manager MODEL_NAME
```

## rspec_job

RSpec Manager is automatically generated from `db/schema.rb`

SOULs command:

```bash
$ souls g rspec_job MODEL_NAME
```
