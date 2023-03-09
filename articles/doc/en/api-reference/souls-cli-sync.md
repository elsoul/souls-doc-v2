---
id: souls-cli-sync
title: SOULs Sync
description: SOULs Sync command is an auxiliary tool for building API server
---

`souls sync` command is mainly used to synchronize files and settings between APIs, Workers, and the cloud.

## souls help sync

```bash
$ souls help sync
Commands:
  souls sync conf            # Sync config/souls.rb Endpoint with Google Cloud Run
  souls sync help [COMMAND]  # Describe subcommands or one specific subcommand
  souls sync models           # Sync Model, DB, Factory Files with API
  souls sync pubsub          # Sync Worker Jobs & Google Cloud Pubsub Subscriptions
```

## souls sync conf

`config/souls.rb` to the latest state.

```bash
$ souls sync conf
```

## souls sync models

Synchronize files related to API Model to all Workers.

```bash
$ souls sync models
```

## souls sync pubsub

By this command

- Check mutation files in all workers
- Get a list of topics and subscriptions on Google Cloud PubSub in the same project
- Find the PubSub topic for the mutation file in the worker and create it if it doesn't
- Delete the PubSub topic if the file for the PubSub topic is not in the mutation

These operations are performed automatically.

```bash
$ souls sync pubsub
```
