---
id: basic-architecture
title: Basic architecture
description: This section describes the basic architecture of SOULs Functions.
---

:::div{.info}
This section describes the basic architecture of SOULs Functions.
:::

![rspec](/imgs/gifs/souls-create-functions.gif)

## The big picture of SOULs Functions

SOULs use Google Cloud Functions.

[Google Cloud Functions](https://cloud.google.com/functions)

- No server provisioning, management or upgrades required
- Automatic scaling according to load
- Integrated monitoring, logging and debugging capabilities
- Per-role and per-function levels of built-in security based on the principle of least privilege
- Key networking features for hybrid and multi-cloud scenarios

By using Cloud Functions in SOULs, you can create applications not only with `Ruby` but also with `Node.js` , `Python` , and `Go` .

| Runtime | Versions       |
| ------- | -------------- |
| Ruby    | 2.7, 2.6       |
| Node.js | 16, 14, 12, 10 |
| Python  | 3.9, 3.8, 3.7  |
| Go      | 1.16, 1.13     |

## Directory structure of SOULs Functions

Interactively with the `souls create functions` command

Select the runtime and version,

Automatically generate the files needed to deploy Cloud Functions.

```sh
$ souls create functions ${method_name}
```

SOULs Functions creates multiple Cloud Functions.

The function directory name is

cf-${Runtime}-${Function}

| Runtime | Version | Function |
| ------- | ------- | -------- |
| Node.js | 16      | method1  |
| Python  | 3.9     | method2  |

The folders name will be

`cf-node16-method1`

`cf-python39-method2`

Once done,

It will be automatically generated if you need to go to the front CloudFuncion.

```
souls-app（Mother Dir）
├── apps
│   ├── api（API Dir）
│   ├── worker-mailer（Worker Dir）
│   ├── worker-scraper（Worker Dir）
│   ├── cf-node16-method1（Functions Dir）
│   ├── cf-python39-method2（Functions Dir）
│
├── config
├── github
│
```

## SOULs Functions Command

Show SOULs Functions command list

`souls functions help`

```
$ souls functions help
Commands:
  souls functions all_url         # Get SOULs Functions All URL
  souls functions delete [name]   # Delete SOULs Functions
  souls functions deploy          # Deploy Cloud Functions
  souls functions describe        # Describe SOULs Functions
  souls functions dev             # Check SOULs Functions dev
  souls functions help [COMMAND]  # Describe subcommands or one specific subcommand
  souls functions url             # Get SOULs Functions URL
```

## Create SOULs Functions

- [Create Ruby Runtime Cloud Functions](/docs/guides/functions/create-ruby-cloud-functions)
- [Create Node.js Runtime Cloud Functions](/docs/guides/functions/create-nodejs-cloud-functions)
- [Create Python Runtime Cloud Functions](/docs/guides/functions/create-python-cloud-functions)
- [Create Go Runtime Cloud Functions](/docs/guides/functions/create-go-cloud-functions)
