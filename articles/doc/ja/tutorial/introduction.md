---
id: introduction
title: はじめに
description: この SOULs チュートリアル は実際に手を動かして学びたい人向けに構成されています。
---

:::div{.info}
この SOULs チュートリアル は実際に手を動かして学びたい人向けに構成されています。コンセプトを順番に学んでいきたい人は [SOULs 基本ガイド](/docs/guides/api/basic-architecture) を参照してください。このチュートリアルとガイドは互いに相補的なものです。
:::

## チュートリアルを始める前に

本チュートリアルは、プログラミング言語 Ruby と GraphQL, Google Cloud, Firebase, GitHub を含めた総合的なクラウドアプリの開発チュートリアルです。

このチュートリアルでは 基本的なブログ API を作成します。**自分はブログを作りたいのではないから、と飛ばしたくなるかもしれませんが、是非目を通してみてください。**このチュートリアルで学ぶ技法はどのような SOULs のアプリにおいても基本的なものであり、マスターすることで SOULs への深い理解が得られます。

このチュートリアルは 5 つ のセクションに分割されています。

- [SOULs API のデプロイ](/ja/docs/tutorial/souls-api-deploy/)
- [Model を作成する](/ja/docs/tutorial/create-model/)
- [Scaffold を実行する](/ja/docs/tutorial/execute-scaffold/)
- [N + 1 クエリ問題を回避する](/ja/docs/tutorial/graphql-batch-loader/)
- [SOULs Worker のデプロイ](/ja/docs/tutorial/souls-worker-deploy/)

### これから作るもの

このチュートリアルではブログ API を通して、SOULs コマンドによる基本的な API の作り方をお見せします。
まだコードが理解できなくても、あるいはよく知らない構文があっても、心配は要りません。このチュートリアルの目的は、SOULs とその構文について学ぶお手伝いをすることです。

SOULs バックエンドには API と Worker の 2 つのタイプがあります。
API は主にデータをフロントエンドへ提供します。Worker は主にタスクの処理を行います。

![SOULs アーキテクチャ](/imgs/docs/SOULs-architecture-tutorial.jpg)

ここでは赤枠部分の SOULs API と Worker を GitHub Actions を使って Google Cloud Run へそれぞれデプロイします。

SOULs フレームワークでは [Monorepo](https://en.wikipedia.org/wiki/Monorepo) によってアプリケーションを管理します。

### 前提知識

Ruby に多少慣れていることを想定していますが、他のプログラミング言語を使ってきた人でも進めていくことはできるはずです。
また、関数、オブジェクト、配列、クラスといったオブジェクト指向プログラミングにおける概念について、馴染みがあることを想定しています。

API には REST API ではなく GraphQL API を採用しているので、
GraphQL を復習する必要がある方はこちらを先に読むことをお勧めします。

[GraphQL](https://graphql.org/)

[graphql-ruby](https://graphql-ruby.org/)

SOULs は GraphQL のエンドポイント一点のみを公開しています。
また、API/Worker ともに内部ルーティングの必要はありません。

本チュートリアルで作成する SOULs GraphQL API は、GraphQL Relay 形式にも対応するレスポンスを返却しています。

[Relay](https://relay.dev/)

本チュートリアルでは GitHub Actions を使って Google Cloud Run にデプロイします。

想いついたアイディアを即座にサーバーレスなクラウド環境にデプロイすることができる SOULs フレームワークをお楽しみください！
