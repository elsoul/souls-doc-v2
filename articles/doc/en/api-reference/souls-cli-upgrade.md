---
id: souls-cli-upgrade
title: SOULs Upgrade
description: SOULs Upgrade command is an auxiliary tool for building API server
---

`souls upgrade` command is mainly used when updating `Gemfile`

## souls help upgrade

```bash
$ souls help upgrade
Commands:
  souls upgrade gemfile         # Update Gemfile/Gemfile.lock Version
  souls upgrade help [COMMAND]  # Describe subcommands or one specific subcommand
```

## upgrade

SOULs command:

```bash
$ souls upgrade gemfile
```

or

```bash
$ souls c irb(main):002:0> SOULs.update_gemfile
```

### souls upgrade gemfile

Update the version of gem in the Gemfile to the latest version.

```bash
$ souls upgrade gemfile
```

or

```bash
$ souls upgrade gem
```
