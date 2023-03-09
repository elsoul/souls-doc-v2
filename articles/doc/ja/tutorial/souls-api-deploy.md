---
id: souls-api-deploy
title: SOULs API のデプロイ
description: SOULs では GraphQL API/Worker を GitHub Actions を使って Google Cloud Run へデプロイする CI / CD サイクルを構築することができます。
---

:::div{.info}
SOULs では GraphQL API/Worker を GitHub Actions を使って Google Cloud Run へデプロイする CI / CD サイクルを構築することができます。　強力な自動テストと自動デプロイを体感しましょう。
:::

## 動作確認

[クイックスタート](/ja/docs/start/quickstart/)
を終了し、アプリが動いていることを確認してください。
このチュートリアルではクイックスタートで作成したアプリを使って開発を進めていきます。

```bash
$ cd souls-app
```

## GitHub リポジトリを作成・PUSH

GitHub に新しいリポジトリを作成しましょう。

[GitHub リンク](https://github.com)

新しいリポジトリを上記のサイトで作成後、
以下のコマンドでソースコードをアップロードします。

マザーディレクトリから実行します。

```bash
$ git add .
$ git commit -m 'first commit'
$ git remote add origin git@github.com:YOURREPO/YOURAPP.git
$ git push origin main
```

### Google Cloud のプロジェクトを作成する

これまで Google Cloud を使ったことがない方はこちらのリンクを参考にプロジェクトを作成しましょう。

[プロジェクトの作成方法](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

:::div{.success}
はじめての方はもちろん、既に Google Cloud を使用中の方も

以下のリンクから $200 分の無料クレジットを獲得することができます。

[Google Cloud クレジットリンク](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)
:::

### Google Cloud IAM の 権限の準備

`souls` コマンドで Google Cloud に必要なシークレットキー、`SOULS_GCP_SA_KEY` を取得します。
また、デプロイに必要な権限を付与します。
そして自動的に Github シークレットの 環境変数 `SOULS_GCP_SA_KEY` にシークレットキーが登録されます。

SOULs Gcloud コマンドの実行

```bash
$ souls gcloud iam setup_key
```

### CLoud SQL Instance の作成

`souls gcloud` コマンドでは

```bash
$ souls gcloud ${service_name} ${method_name} --option ...
```

のように `${method_name}` のあとに `--option` を渡して、
`gcloud` コマンドを実行することができます。

以下のコマンドでヘルプを表示することができます。

```bash
$ souls gcloud help
```

それでは Google Cloud SQL のインスタンスを作成してみます。

```bash
$ souls gcloud sql create_instance
```

### .env の自動生成

先程の `souls gcloud sql create_instance` コマンドによって作成された

Google Cloud SQL のインスタンス情報などが

API ディレクトリ

`apps/api/.env`

マザーディレクトリ

`.env.production`

に出力され自動で GitHub Secret へ登録されます。

![souls-gh-secret](/imgs/gifs/souls-gh-secret.gif)

すべての環境変数が登録されると次の画像のようになります。

![GitHub Secret](/imgs/docs/github-secret5.png)

### Cloud SQL へ IP の追加

`souls gcloud sql` コマンドを使って、

現在のグローバル IP から Google Cloud SQL へアクセスできるように設定します。

```bash
$ souls gcloud sql assign_ip
```

### データベースの Migration

API ディレクトリで、
`souls` コマンドを使って本番データベースを作成、Migration します。

```bash
$ cd apps/api
$ souls db create --e=production
$ souls db migrate --e=production
```

## デプロイ

デプロイの前に、テストでもう一度アプリが正しく動作していることを確認しましょう。

```bash
$ souls test
```

すべての examples が緑色で 0 failures であることを確認します。ここで、テストが失敗すると、デプロイ途中で同じく失敗するので、テストがクリアなことを確認しましょう。

![SOULs テスト](/imgs/docs/souls-t.png)

それでは マザーディレクトリにある、`github` ディレクトリの名前を変更してデプロイしましょう。

:::div{.warning}
ここから先のステップでデプロイが成功すると Google Cloud のクレジットが使用開始されますが、

以下のリンクから $200 分の無料クレジットを獲得することができます。

[Google Cloud クレジットリンク](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)

※ デプロイをしなくてもこのチュートリアルを続けることはできます。[Model を作成する](/ja/docs/tutorial/create-model/)へスキップしてください。
:::

マザーディレクトリへ戻ります。

```bash
$ cd ...
```

`github` ディレクトリの名前を変更して、`GitHub Actions` を Push 時に反映させます。

```bash
$ mv github .github
$ git add .
$ git commit -m 'first deploy'
$ git push origin main
```

## GitHub ワークフローの確認

以下のコマンドで、稼働中の GitHub Workflow のログを表示することができます。

```bash
$ souls gh watch
```

![GitHub Actions](/imgs/gifs/souls-gh-watch.gif)

## 更新・デバック

`souls` コマンドを使って更新・デバックをしてみましょう。

コンソールに入って Model のデータを確認します。

```bash
$ souls c
```

`SOULs` フレームワークは irb コンソールを標準で使用しています。
irb について初めての方は[こちらのリンク](https://github.com/ruby/irb)を参考にしてください。

[GitHub: irb](https://github.com/ruby/irb)

```bash
irb(main):001:0> User.all
D, [2021-07-14T11:40:11.797378 #11805] DEBUG -- :   User Load (3.0ms)  SELECT "users".* FROM "users" ORDER BY "users"."created_at" DESC
=>
[#<User:0x000055c1cf1da538
  id: 20,
  uid: "RgGrTeEkX8j0V",
  username: "岡田 律華",
  screen_name: "jere_farrell",
  last_name: "おかだ",
  first_name: "りか",
  last_name_kanji: "岡田",,
```

本番環境では、`RACK_ENV` を `production` に設定しましょう。
本番環境のデータベースをコンソールから直接デバッグできることはとても強力です。
取り扱いには十分に注意しましょう。

```bash
$ souls c --e=production
```

`Gemfile` のアップデートを `souls` コマンドを使ってやってみます。

```bash
$ souls upgrade gemfile
```

このコマンドは現在 `Gemfile` に定義されているバージョンと最新のバージョンに差異がないかを確認し、最新バージョンがある場合は `gem` のアップデート、さらに `Gemfile` を最新のバージョンに上書きをします。
