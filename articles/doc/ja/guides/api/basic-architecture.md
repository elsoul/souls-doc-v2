---
id: basic-architecture
title: 基本アーキテクチャ
description: ここでは SOULs サーバーレス Ruby GraphQL API フレームワークの基本的なアーキテクチャについて説明します。
---

:::div{.info}
ここでは SOULs サーバーレス Ruby GraphQL API フレームワークの基本的なアーキテクチャについて説明します。
:::

## SOULs API の 全体像

SOULs は GraphQL Ruby を使用しています。

参照 Gem：[graphql-ruby](https://graphql-ruby.org/)

ここでは下の図の赤枠部分の API について説明していきます。

![SOULs API アーキテクチャ](/imgs/docs/SOULs-architecture-api.jpg)

## SOULs API の CRUD ファイル構造

開発を進めていくと、数多くの CRUD のために多くのコードを書くことになります。

> CRUD とは、永続的なデータを取り扱うソフトウェアに要求される 4 つの基本機能である、データの作成（Create）、読み出し（Read）、更新（Update）、削除（Delete）の頭文字を繋げた語。

SOULs フレームワークでは上記の CRUD の削除が２つ存在します。

１つめは論理削除。
削除フラグを立てるのみで、実際には削除しません。
SOULs フレームワークでは `is_deleted` フラグをデフォルトですべてのテーブルに定義しています。

２つめは物理削除。
SQL の DELETE 構文でデータをデータベースから削除します。

アプリケーションを運用する上で、ユーザーのご操作による削除は多発します。

ユーザークライアントから削除送信を送る際に、予め論理削除の領域をつくり、
意図せぬデータの損失を防ぎましょう。

以下、`User` テーブルを作成したときの CRUD に関わるファイルの配置です。

| 動作             | GraphQL  | ファイル名                                                 |
| ---------------- | -------- | ---------------------------------------------------------- |
| 読み出し（単数） | Query    | apps/api/app/graphql/queries/user.rb                       |
| 読み出し（複数） | Query    | apps/api/app/graphql/queries/users.rb                      |
| 読み出し（条件） | Query    | apps/api/app/graphql/resolvers/user_search.rb              |
| 登録             | Mutation | apps/api/app/graphql/mutations/base/create_user.rb         |
| 更新             | Mutation | apps/api/app/graphql/mutations/base/update_user.rb         |
| 論理削除         | Mutation | apps/api/app/graphql/mutations/base/delete_user.rb         |
| 物理削除         | Mutation | apps/api/app/graphql/mutations/base/destroy_delete_user.rb |

データの登録、更新、論理削除、物理削除は `mutation/base` 内で定義されています。

データベースのスキーマを決定し、`souls g scaffold` コマンドを使えば、
GraphQL の実装に必要な以下のファイルを自動で生成します。

| 役割        | ファイルの種類 | ファイルパス                                                        |
| ----------- | -------------- | ------------------------------------------------------------------- |
| GraphQL API | mutation       | apps/api/app/graphql/mutations/base/creat_user.rb                   |
| GraphQL API | mutation       | apps/api/app/graphql/mutations/base/update_user.rb                  |
| GraphQL API | mutation       | apps/api/app/graphql/mutations/base/delete_user.rb                  |
| GraphQL API | mutation       | apps/api/app/graphql/mutations/base/destroy_delete_user.rb          |
| GraphQL API | query          | apps/api/app/graphql/queries/user.rb                                |
| GraphQL API | type           | apps/api/app/graphql/types/user_type.rb                             |
| GraphQL API | resolver       | apps/api/app/graphql/resolvers/user_search.rb                       |
| GraphQL API | connection     | apps/api/app/graphql/types/connections/user_connection.rb           |
| GraphQL API | edge           | apps/api/app/graphql/types/edges/user_edge.rb                       |
| RSpec       | rspec_mutation | apps/api/spec/mutations/base/user_spec.rb                           |
| RSpec       | rspec_query    | apps/api/app/spec/queries/user_spec.rb                              |
| RSpec       | rspec_factory  | apps/api/spec/factories/users.rb                                    |
| RSpec       | rspec_resolver | apps/api/app/spec/resolvers/user_search_spec.rb                     |


## SOULs API のディレクトリ構造

SOULs API のディレクトリ構造は以下のようになっています。

`souls-app/apps/api` ディレクトリ

```
souls-app
├── apps
│   ├── api
│        ├── app
│        │    ├── models
│        │    ├── utils
│        │    ├── graphql
│        │          ├── mutations
│        │          │     ├── base
│        │          │     ├── managers
│        │          │     ├── base_mutation.rb
│        │          │
│        │          ├── queries
│        │          ├── resolvers
│        │          ├── types
│        │          │     ├── base
│        │          │     ├── connections
│        │          │     ├── edges
│        │          │
│        │          ├── s_o_u_ls_api_schema.rb
│        ├── config
│        │      ├── database.yml
│        │      ├── souls.rb
│        │
│        ├── constants
│        ├── db
│        ├── github
│        ├── log
│        ├── spec
│        │    ├── factory
│        │    ├── models
│        │    ├── mutations
│        │    ├── queries
│        │    ├── resolvers
│        │    ├── factory
│        │
│        ├── tmp
│        ├── app.rb
│        ├── Dockerfile
│        ├── Gemfile
│        ├── Gemfile.lock
│        ├── Procfile
```

`souls-app/apps/api/app/graphql/` の中には４つのフォルダと一つのファイルがあります。

`mutations`, `queries`, `resolvers`, `types`, と `s_o_u_ls_api_schema.rb`

これらのファイルが GraphQL を操作しています。

## データベースの設定

ORM は ActiveRecord を採用しているため、Rails を使ったことがある方はいつもと変わらずにそのまま使うことができます。

[Active Record へのリンク](https://guides.rubyonrails.org/active_record_basics.html)

## Docker コンテナの起動

SOULs フレームワークでは development と test 環境には Docker コンテナの PostgreSQL をデフォルトで使用しています。

PostgreSQL コンテナ起動

```bash
$ souls docker psql
```

MySQL をお使いの方も `config/database.yml` と `Gemfile` を変更することで使うことができます。

MySQL コンテナ起動

```bash
$ souls docker mysql
```

## Model 及び Migration ファイル

SOULs API では Active Record を採用しているため、
Rubyist の方にとっては馴染みやすくなっているかと思います。

Active Record が初めての方は[こちらのリンク](https://github.com/rails/rails/tree/main/activerecord)を参考にしてください。

- [Active Record](https://github.com/rails/rails/tree/main/activerecord)

Model ではデータベースのテーブル操作を管理します。
`./app/models/` 内のディレクトリで定義されます。

SOULs フレームワークではユーザーの権限管理に RoleModel を使用しています。

- [role_model](https://github.com/martinrehfeld/role_model)

`souls-app/apps/api/models` と `souls-app/apps/api/db` ディレクトリにデータベースに関するファイルが定義されています。

```
souls-app
├── apps
│   ├── api
│        ├── app
│        ├── models
│        │     ├── article_category.rb
│        │     ├── article.rb
│        │     ├── user.rb
│        │
│        ├── db
│             ├── migrate
│             │     ├── 20200006095538_create_users.rb
│             │     ├── 20200712180236_create_article_categories.rb
│             │     ├── 20200714215521_create_articles.rb
│             │
│             ├── schema.rb
│             ├── seeds.rb
```

ユーザーテーブルを作成する Migration ファイルを見てみます。

```ruby:./souls-app/apps/api/db/migrate/20200006095538_create_users.rb
class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :uid, null: false, unique: true
      t.string :username, null: false, default: ""
      t.string :screen_name, null: false, default: ""
      t.string :last_name, null: false, default: ""
      t.string :first_name, null: false, default: ""
      t.string :last_name_kanji, null: false, default: ""
      t.string :first_name_kanji, null: false, default: ""
      t.string :last_name_kana, null: false, default: ""
      t.string :first_name_kana, null: false, default: ""
      t.string :email, null: false, unique: true
      t.string :tel, null: false, default: ""
      t.string :icon_url, null: false, default: ""
      t.string :birthday, null: false, default: ""
      t.string :gender, null: false, default: ""
      t.string :lang, null: false, default: "ja"
      t.string :category, null: false, default: "user"
      t.integer :roles_mask, null: false, default: 1
      t.boolean :is_deleted, null: false, default: false
      t.timestamps
    end
    add_index :users, :uid
    add_index :users, :screen_name
    add_index :users, :email, unique: true
    add_index :users, :username
    add_index :users, :is_deleted
  end
end
```

Migration ファイル内で型の定義を行い、Migration を実行します。

## Migration の実行

SOULs フレームワークでは以下のコマンドでデータベースを操作することができます。

データベースの作成

```bash
$ souls db create
```

Migration の実行

```bash
$ souls db migrate
```

シードファイルの作成

```bash
$ souls db seed
```

データベースのリセット

```bash
$ souls db migrate_reset
```

データベースのリセットとシードファイルの作成

```bash
$ souls db reset
```

本番環境で実行する場合は、オプション `--e` に `production` を指定してください。

本番環境でのデータベースの操作

データベースの作成

```bash
$ souls db create --e=production
```

Migration の実行

```bash
$ souls db migrate --e=production
```

シードファイルの作成

```bash
$ souls db seed --e=production
```

これらのコマンドは直接本番の環境を操作することができるので、
注意が必要です。

## ローカルサーバーの起動

ローカルサーバーの起動

```bash
$ souls s
```

localhost:4000 にアクセスして

[http://localhost:4000](http://localhost:4000)

次のような画面が表示されれば成功です！

![SOULs Running](/imgs/docs/localhost.png)

## コンソールの起動

SOULs フレームワークでは `souls c` コマンドにより、
アプリと同じ環境の irb を使用することができます。

```bash
$ souls c
irb(main):001:0>
```

本番環境

```bash
$ souls c --e=production
irb(main):001:0>
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
:::

```bash
$ cd ...
$ mv github .github
$ git add .
$ git commit -m 'first deploy'
$ git push origin main
```

GitHub ページの Actions タブを押して、デリバリーのステータスを確認します。

![GitHub Actions](/imgs/docs/github-actions.png)

build が緑色に表示されていれば、無事デプロイ完了です。

Google Cloud Run のエンドポイントにアクセスしてみましょう。

![デプロイ成功](/imgs/docs/success.png)

無事にデプロイが完了しました。
