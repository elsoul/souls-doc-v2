---
id: github
title: Github CLI installation
description: This section describes the Github CLI installation. Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)
---

This section describes the Github CLI installation. Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x)

## Github CLI installation

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

Install with Homebrew:

```bash
$ brew install gh
```

Update:

```bash
$ brew upgrade gh
```
