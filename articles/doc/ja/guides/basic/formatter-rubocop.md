---
id: formatter-rubocop
title: Formatter - Rubocop
description: ここでは souls コマンド及び Rubocop を使用します。
---

:::div{.info}
SOULs では Rubocop を Formatter として使用し、できる限りのコードを [Ruby スタイルガイド](https://rubystyle.guide/) に合わせてフォーマットをしています。
:::

## Formatter - Rubocop

Ruby Style Guide

[https://github.com/rubocop/ruby-style-guide](https://github.com/rubocop/ruby-style-guide)

Rubocop

[https://github.com/rubocop/rubocop](https://github.com/rubocop/rubocop)

![rubocop](/imgs/gifs/rubocop-video.gif)

## VScode による自動フォーマット

プログラミングは、あらゆるアプローチから同じ目的を達成するコードを書くことができます。

しかし、チームで開発を行う際に、個々で書き方がバラバラになってしまうことはよくありません。

チームでプロジェクトを進めるには、コードの書き方を統一することは非常に重要になります。

SOULs フレームワークではデフォルトで `.rubocop.yml` を読み込んで整形するため、自動でコードが統一されます。

## Rubocop の実行

`souls test` コマンドでは `rubocop -A` と　`bundle exec rspec` を順番に行っています。
アプリケーションの開発途中に、気が付かないタイピングミス等が入らないような環境設定に整えます。

```bash
$ souls test
```
