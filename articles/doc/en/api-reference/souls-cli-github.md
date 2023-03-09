---
id: souls-cli-github
title: SOULs Github
description: The souls gh command is an auxiliary tool for building a GitHub Actions environment
---

You can use the GitHub CLI with the `souls github` command.

## souls help gh

```bash
$ souls gh help
Commands:
  souls github add_env --key, --key=KEY --value, --value=VALUE  # Add New env and Sync Github Secret
  souls github help [COMMAND]                                   # Describe subcommands or one specific subcommand
  souls github secret_set
```

## secret_set

The environment variables defined in `.env.production` are automatically registered in GitHub Secret.

```bash
 $ souls gh secret_set
```

## add_env

`.github/workflows/*.yml` , `.env` , `apps/api/.env`

Add an environment variable to and sync to GitHub Secret.

```bash
 $ souls gh add_env
 KEY:
 VALUE:
```
