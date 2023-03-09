---
id: github
title: Github CLI インストール
description: ここでは Github CLI インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)
---

:::div{.info}
ここでは Github CLI インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)
:::

## Github CLI インストール

## Windows10, 11 WLS2 (Ubuntu 20.04 LTS)

Install:

```bash
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0
$ sudo apt-add-repository https://cli.github.com/packages
$ sudo apt update
$ sudo apt install gh
```

Update:

```bash
$ sudo apt update
$ sudo apt install gh
```

## MacOS (Catalina 10.xx.x)

Install:

```bash
$ brew install gh
```

Update:

```bash
$ brew upgrade gh
```
