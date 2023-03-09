---
id: basic-architecture
title: フレームワーク の 全体像
description: ここでは SOULs フレームワーク の全体像について説明します。
---

:::div{.info}
ここでは SOULs フレームワーク の全体像について説明します。
:::

## Monorepo

SOULs フレームワークは [Monorepo](https://en.wikipedia.org/wiki/Monorepo) によってアプリケーションを管理しています。

ウェブアプリケーションには、ユーザーアプリ、管理者アプリ、バックエンド API、Worker によるタスク処理など、

様々な役割がありますが、

1 つの `git リポジトリ` で管理することができます。

これにより、チーム間による開発効率が抜群に改善されます。

![SOULs serverless architecture](/imgs/docs/SOULs-architecture-tutorial.jpg)

## マザーとサービス

SOULs には一つのマザーと複数のサービスがあります。

マザーは [Monorepo](https://en.wikipedia.org/wiki/Monorepo) のルートディレクトリになります。

サービスには

`API`, `Worker`, `Cloud Functions` の 3 種類があり、

`Worker`, `Cloud Functions（CF）` は複数個作成することができます。

`souls-app` マザーディレクトリ

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api（API ディレクトリ）
│   ├── worker-mailer1（Worker ディレクトリ）
│   ├── worker-mailer2（Worker ディレクトリ）
│   ├── cf-ruby27-method1（CF ディレクトリ）
│   ├── cf-python39-method1（CF ディレクトリ）
│
├── config
├── github
│

  .
  .
```

## GitHub Actions による自動デプロイ

SOULs フレームワークでは `Github Actions` を使用して、

CI/CD 環境を構築しています。

`API`, 各 `Worker` ディレクトリの変更を検知し、

変更があった場合には `main` ブランチに `push` するだけでデプロイが完了します。

デプロイの前にテストを実行するので、

万が一テストに失敗した場合にはデプロイがロールバックされるため、

本番環境にはデプロイされません。

これにより、安全で迅速な開発環境のもとプロジェクトを進めることができます。

### CI/CD とは

CI/CD (継続的インテグレーション/継続的デリバリー) とは、アプリケーション開発のステージに自動化を取り入れて、顧客にアプリケーションを提供する頻度を高める手法です。CI/CD から発生した主なコンセプトは、継続的インテグレーション、継続的デリバリー、継続的デプロイメントです。CI/CD は、新規コードの統合によって開発チームや運用チームに生じる問題 (すなわち「インテグレーション地獄」) に対する解決策です。
