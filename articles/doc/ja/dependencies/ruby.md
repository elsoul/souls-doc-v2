---
id: ruby
title: Ruby インストール
description: ここでは Ruby インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x~)
---

:::div{.info}
ここでは Ruby インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x~)
:::

## Ruby インストール

## Windows10 WLS2 (Ubuntu 20.04 LTS)

```bash
# Update
$ sudo apt update

# Install dependencies
$ sudo apt install git curl autoconf bison build-essential \
    libssl-dev libyaml-dev libreadline6-dev zlib1g-dev \
    libncurses5-dev libffi-dev libgdbm6 libgdbm-dev libdb-dev

# Install rbenv
$ curl -fsSL https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-installer | bash

# If you are using Bash:
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ source ~/.bashrc

# If you are using Zsh:
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
$ echo 'eval "$(rbenv init -)"' >> ~/.zshrc
$ source ~/.zshrc

# Check ruby versions
$ rbenv install --list

# Install ruby 3.0~
$ rbenv install 3.0.0

# Set ruby version
$ rbenv local 3.0.0

# Ruby version (using rbenv)
$ ruby -v
ruby 3.0.0p0 (2020-12-25 revision 95aff21468) [x86_64-linux]
```

## MacOS (Catalina 10.xx.x)

```bash
# Install xcode
$ xcode-select --install

# Install Homebrew
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Check if Homebrew is installed
$ brew doctor
=> Your system is ready to brew.

# Update brew
$ brew update

# Install rbenv
$ brew install rbenv

# If you are using Bash:
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ source ~/.bashrc

# If you are using Zsh:
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
$ echo 'eval "$(rbenv init -)"' >> ~/.zshrc
$ source ~/.zshrc

# Check ruby versions
$ rbenv install --list

# Install ruby 3.0~
$ rbenv install 3.0.1

# Set ruby version
$ rbenv local 3.0.1

# Check Ruby version
$ ruby -v
ruby 3.0.1p64 (2021-04-05 revision 0fb782ee38) [x86_64-linux]
```
