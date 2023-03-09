---
id: webdriver
title: WebDriver (Geckodriver / Chronium) installation
description: This section describes the WebDriver (Geckodriver / Chronium) installation. Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x ~)
---

This section describes the WebDriver (Geckodriver / Chronium) installation. Windows10 WLS2 (Linux Ubuntu 20.04 LTS) / MacOS (Catalina 10.xx.x \~)

## WebDriver (Geckodriver / Chronium) installation

Prepare the WebDriver to operate the browser required for scraping.

## Windows10 WLS2 (Ubuntu 20.04 LTS)

I'm using [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) on Windows 10.

### Install VcXrsv

- [VcXrsv](https://sourceforge.net/projects/vcxsrv/)

### Dependency installation

```bash
$ sudo apt install libgl1-mesa-dev xorg-dev
```

### Launch XLaunch

After installing VcXsrv, open XLaunch from the Start menu. Then, set the VcXsrv startup options.

Specify the `Display number` as '0' a boot option.

Specify "-ac -now gl" for Additional parameters for VcXsrv.

![VcXsrv](/imgs/docs/vcxsrv.png)

Then enter the following command in the configuration file with `Win + R`

```shell
$ shell:startup
```

Save the configuration file `config.xlaunch`

### Edit .profile

`DISPLAY` settings in the `.profile`

Add the following information to your Bash profile.

```bash
$ export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}' ):0.0
```

Read the configuration file

```bash
$ source ~/.profile
```

### For Google Chrome (Chrome driver)

Install Chrome on WSL2 Ubuntu.

```bash
$ sudo apt-get update
$ sudo apt-get install -y curl unzip xvfb libxi6 libgconf-2-4
```

- Install Google Chrome.

```bash
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
$ sudo apt install ./google-chrome-stable_current_amd64.deb
```

```css
$ google-chrome --version
```

- Install [Chrome Driver.](https://chromedriver.storage.googleapis.com/index.html)

```bash
$ wget https://chromedriver.storage.googleapis.com/94.0.4606.41/chromedriver_linux64.zip
$ unzip chromedriver_linux64.zip
$ sudo mv chromedriver /usr/local/bin/chromedriver
$ sudo chown root:root /usr/local/bin/chromedriver
$ sudo chmod +x /usr/local/bin/chromedriver
```

### For Firefox (Geckodriver)

- Install Firefox.

```bash
$ sudo apt install firefox
```

- Install[Geckodriver.](https://github.com/mozilla/geckodriver/releases)

```bash
$ wget https://github.com/mozilla/geckodriver/releases/download/v0.29.1/geckodriver-v0.29.1-linux64.tar.gz
$ tar -zxvf geckodriver-v0.29.1-linux64.tar.gz
$ sudo mv geckodriver /usr/local/bin/geckodriver
$ sudo chown root:root /usr/local/bin/geckodriver
$ sudo chmod +x /usr/local/bin/geckodriver
```

## MacOS (Catalina 10.xx.x)

### For Google Chrome (Chronium)

- Install [Google Chrome.](https://www.google.com/intl/ja/chrome/)

Install Chromedriver using Homebrew.

```bash
$ brew install chromedriver
```

### For Firefox (Geckodriver)

- Install [Firefox.](https://www.mozilla.org/ja/firefox/mac/)
- Install[Geckodriver.](https://github.com/mozilla/geckodriver/releases)

Install Geckodriver using Homebrew.

```bash
$ brew install geckodriver
```
