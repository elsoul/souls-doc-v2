---
id: webdriver
title: WebDriver (Geckodriver/Chronium) インストール
description: ここでは WebDriver (Geckodriver/Chronium) インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x~)
---

:::div{.info}
ここでは WebDriver (Geckodriver/Chronium) インストール について説明します。Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x~)
:::

## WebDriver (Geckodriver/Chronium) インストール

スクレイピングに必要なブラウザを操作する WebDriver の準備をします。

## Windows10 WLS2 (Ubuntu 20.04 LTS)

Windows 10 の [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) を使用しています。

### VcXrsv のインストール

- [VcXrsv](https://sourceforge.net/projects/vcxsrv/)

### Dependency のインストール

```bash
$ sudo apt install libgl1-mesa-dev xorg-dev
```

### XLaunch の起動

VcXsrv のインストール後、スタートメニューから XLaunch を開きます。

ここで、VcXsrv の起動オプションを設定します。

起動オプションですが、`Display number` は後ほど指定する必要がありますので、

「0」にしておきます。

Additional parameters for VcXsrv に「-ac -nowgl」を指定します。

![VcXsrv の起動オプション](/imgs/docs/vcxsrv.png)

続いて設定ファイルを `Win + R` で以下のコマンドを入力し、

```shell
$ shell:startup
```

スタートアップフォルダーに設定ファル `config.xlaunch` を保存してください。

### .profile の編集

`.profile` に `DISPLAY` の設定を書きます。

環境によっては、 `.bashrc` や `.zshrc` に記入してください。

`.profile`

```bash
$ export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0
```

設定ファイルの読み込み

```bash
$ source ~/.profile
```

### Google Chrome の場合(Chromedriver)

WSL2 Ubuntu へ Chrome をインストールします。

```bash
$ sudo apt-get update
$ sudo apt-get install -y curl unzip xvfb libxi6 libgconf-2-4
```

- Google Chrome をインストールします。

```bash
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
$ sudo apt install ./google-chrome-stable_current_amd64.deb
```

```
$ google-chrome --version
```

- [ChromeDriver](https://chromedriver.storage.googleapis.com/index.html) をインストールします。

```bash
$ wget https://chromedriver.storage.googleapis.com/94.0.4606.41/chromedriver_linux64.zip
$ unzip chromedriver_linux64.zip
$ sudo mv chromedriver /usr/local/bin/chromedriver
$ sudo chown root:root /usr/local/bin/chromedriver
$ sudo chmod +x /usr/local/bin/chromedriver
```

### Firefox の場合 (Geckodriver)

- Firefox をインストールします。

```bash
$ sudo apt install firefox
```

- [Geckodriver](https://github.com/mozilla/geckodriver/releases) をインストールします。

```bash
$ wget https://github.com/mozilla/geckodriver/releases/download/v0.29.1/geckodriver-v0.29.1-linux64.tar.gz
$ tar -zxvf geckodriver-v0.29.1-linux64.tar.gz
$ sudo mv geckodriver /usr/local/bin/geckodriver
$ sudo chown root:root /usr/local/bin/geckodriver
$ sudo chmod +x /usr/local/bin/geckodriver
```

## MacOS (Catalina 10.xx.x)

### Google Chrome の場合(Chronium)

- [Google Chrome](https://www.google.com/intl/ja/chrome/) をインストールします。

`brew` コマンドを使って

Chromedriver をインストールします。

```bash
$ brew install chromedriver
```

### Firefox の場合 (Geckodriver)

- [Firefox](https://www.mozilla.org/ja/firefox/mac/) をインストールします。

- [Geckodriver](https://github.com/mozilla/geckodriver/releases) をインストールします。

```bash
$ brew install geckodriver
```
