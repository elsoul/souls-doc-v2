---
id: execute-scaffold
title: Scaffold を実行する
description: このチュートリアルは `souls g scaffold` コマンドを使って GraphQL の CRUD API を作成する方法を説明します。
---

:::div{.info}
このチュートリアルは `souls g scaffold` コマンドを使って GraphQL の CRUD API を作成する方法を説明します。GraphQL Ruby について復習する必要がある方はこちらの [graphql-ruby](https://graphql-ruby.org/) を先に読むことをお勧めします。
:::

![scaffold](/imgs/gifs/scaffold-video.gif)

## souls g scaffold_all コマンドの実行

Migration が終わると、`db/schema.rb` が更新されます。

`souls g scaffold_all` コマンドは `db/schema.rb` のタイプをもとに CRUD に必要なファイルと、

それに対応するテストも自動生成します。

```bash
$ souls g scaffold_all
.
.
Created file! : ./app/graphql/types/edges/user_edge.rb
Created file! : ./app/graphql/types/connections/user_connection.rb
Created file! : ./app/graphql/resolvers/user_search.rb
Created file! : ./spec/factories/users.rb
Created file! : ./spec/mutations/base/user_spec.rb
Created file! : ./spec/queries/user_spec.rb
Created file! : ./spec/resolvers/user_search_spec.rb
Created file! : ./spec/policies/user_policy_spec.rb
🎉  Generated SOULs CRUD Files
```

108 つのファイルがデータベーススキーマをもとに自動生成されました。

`souls g scaffold` で自動生成されるファイルの詳細は [SOULs ガイド](/docs/guides/api/basic-architecture/) を参考にしてください。

`souls g scaffold $MODEL_NAME`

1 つの Model 単体での `scaffold` を実行することができます。

```bash
$ souls g scaffold user
```

## souls test コマンドの実行

```bash
$ souls test
Finished in 0.22436 seconds (files took 1.35 seconds to load)
36 examples, 30 failures

Failed examples:
```

36 つのテストに対して 30 つのテストが失敗しています。

### FactoryBot でテストデータを定義する

つづいて、`User` Model のテストデータを生成する `FactoryBot` を

`apps/api/spec/factories/`

内で定義します。

SOULs API/Worker では Faker、 FactoryBot、 Gimei を使用してユーザーのテストデータを生成しています。

Faker

[https://github.com/faker-ruby/faker](https://github.com/faker-ruby/faker)

FactoryBot

[https://github.com/thoughtbot/factory_bot](https://github.com/thoughtbot/factory_bot)

Gimei

[https://github.com/willnet/gimei](https://github.com/willnet/gimei)

実際にアプリをクライアントと共有する際にはできるだけ、
人間に見やすいデータに変換してあげましょう。

```ruby:apps/api/spec/factories/users.rb
require "gimei"
FactoryBot.define do
  factory :user do
    uid { Faker::Internet.password }
    username { Gimei.kanji }
    screen_name { Faker::Internet.unique.username }
    last_name { Gimei.last.hiragana }
    first_name { Gimei.first.hiragana }
    last_name_kanji { Gimei.last.kanji }
    first_name_kanji { Gimei.first.kanji }
    last_name_kana { Gimei.last.katakana }
    first_name_kana { Gimei.last.katakana }
    email { Faker::Internet.unique.email }
    tel { Faker::PhoneNumber.subscriber_number(length: 10) }
    icon_url { "https://picsum.photos/200" }
    birthday { Faker::Date.birthday(min_age: 18, max_age: 65) }
    gender { Gimei.male }
    lang { "ja" }
    category { "user" }
    roles_mask { 1 }
    is_deleted { false }
  end
end
```

```ruby:apps/api/spec/factories/articles.rb
FactoryBot.define do
  factory :article do
    association :user, factory: :user
    title { Faker::Book.unique.title }
    body { Faker::Quote.matz }
    thumnail_url { Faker::Internet.url }
    public_date { Time.now }
    association :article_category, factory: :article_category
    is_public { false }
    just_created { false }
    slug { Faker::Internet.password(min_length: 16) }
    tags { %w[tag1 tag2 tag3] }
    is_deleted { false }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
```

```ruby:apps/api/spec/factories/article_category.rb
FactoryBot.define do
  factory :article_category do
    name { Faker::Books::CultureSeries.culture_ship_class }
    tags { %w[tag1 tag2 tag3] }
    is_deleted { false }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
```

```ruby:apps/api/spec/factories/comment.rb
FactoryBot.define do
  factory :comment do
    association :article, factory: :article
    from { Faker::Games::SuperMario.character }
    body { Faker::JapaneseMedia::StudioGhibli.quote }
    is_deleted { false }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
```

### 再度テストの実行

```bash
$ souls test
Comment Model テスト
  Comment データを書き込む
    valid Comment Model

ArticleCategory Model テスト
  ArticleCategory データを書き込む
    valid ArticleCategory Model

Finished in 1.3 seconds (files took 1.28 seconds to load)
36 examples, 0 failures

Randomized with seed 43312
```

無事、36 つのテストすべてが成功しました。

このように、SOULs フレームワークではテストと共に開発を進めます。

即座にエラーを検知するのは後々の開発時間を大きく短縮させます。

一歩ずつ確実に進みましょう。

## CRUD API （登録・表示・更新・論理削除・削除）の確認

これでもう `User` テーブルにまつわる CRUD API は整いました。

SOULs フレームワークでは一般的な CRUD の削除が２つ存在します。

１つめは論理削除、
削除フラグを立てるのみで、実際には削除しません。
SOULs フレームワークでは `is_deleted` フラグをデフォルトですべてのテーブルに定義しています。

２つめは物理削除
SQL の DELETE 構文でデータをデータベースから削除します。

アプリケーションを運用する上で、ユーザーのご操作による削除は多発します。
ユーザークライアントから削除送信を送る際に、予め論理削除の領域をつくり、
意図せぬデータの損出を防ぎましょう。

データの登録、更新、論理削除、物理削除は `mutation/base` 内で定義されています。

`app/graphql/mutations/base/`

データの 表示は `queries` 、`resolvers` 内で定義されています。

`app/graphql/queries`

`app/graphql/resolvers`

データの型に関する情報は `types` 内で定義されています。

`app/graphql/types`

ファイルの詳細は [SOULs ガイド](/ja/docs/guides/api/graphql-api) を参考にしてください。

それでは `souls g scaffold` コマンドで生成された API をみてみましょう。

### 登録 - createUser Mutation

以下のクエリを実行して、`User` データが登録できることを確認してみましょう。

サンプルクエリ

```ruby
mutation {
  createUser(
    input: {
      uid: "uniq-id"
      username: "SOULs"
      email: "info@test.com"
      }
  ) {
    userEdge {
      node {
        uid
        id
        username
        email
      }
    }
  }
}
```

成功すると、

以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "createUser": {
      "userEdge": {
        "node": {
          "uid": "uniq-id",
          "id": "VXNlcjo0",
          "username": "SOULs",
          "email": "info@test.com"
        }
      }
    }
  }
}
```

### 表示 - userSearch Resolver

先程登録されたデータを取得してみましょう。

データを取得するには、Resolver を使います。

以下のクエリを実行してみましょう。

サンプルクエリ

```ruby
query {
  userSearch(filter: { isDeleted: false }) {
    edges {
      node {
        id
        uid
        username
        email
      }
    }
    nodes {
      id
    }
    pageInfo {
      hasNextPage
    }
  }
}
```

成功すると以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "userSearch": {
      "edges": [
        {
          "node": {
            "id": "VXNlcjo0",
            "uid": "uniq-id",
            "username": "SOULs",
            "email": "info@test.com"
          }
        }
      ],
      "nodes": [
        {
          "id": "VXNlcjo0"
        }
      ],
      "pageInfo": {
        "hasNextPage": false
      }
    }
  }
}
```

無事にデータが登録されていることが確認できました。

### 更新 - updateUser Mutation

次はデータを更新します。

データを更新するときは Mutation を使います。

以下のクエリを実行してみましょう。

サンプルクエリ

```ruby
mutation {
  updateUser(input: {
    id: "VXNlcjo0"
    username: "SOULs API"
    }) {
    userEdge {
      node {
        id
        username
        email
      }
    }
  }
}
```

成功すると以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "updateUser": {
      "userEdge": {
        "node": {
          "id": "VXNlcjo0",
          "username": "SOULs API",
          "email": "info@test.com"
        }
      }
    }
  }
}
```

無事に `username` が更新されました。

### 論理削除 - deleteUser Mutation

SOULs フレームワークの `delete` は　`is_deleted` フラグを `true` にします。
実際のアプリケーションの運用ではユーザーによる誤った操作によるデータの損失を防ぐために、
削除の前にゴミ箱の中に入れるフラグを立てます。

それでは以下のクエリを実行してみましょう。

サンプルクエリ

```ruby
mutation {
  deleteUser(input: { id: "VXNlcjo0" }) {
    user {
      id
      username
      email
    }
  }
}
```

成功すると以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "deleteUser": {
      "user": {
        "id": "VXNlcjo0",
        "username": "SOULs API",
        "email": "info@test.com"
      }
    }
  }
}
```

無事に `is_deleted` フラグが `true` になりました。

### 物理削除 - destroyDeleteUser Mutation

SOULs フレームワークでは `destroyDelete` Mutation が実際にレコードからデータを削除します。

それでは以下のクエリを実行してみましょう。

サンプルクエリ

```ruby
mutation {
  destroyDeleteUser(input: { id: "VXNlcjo0" }) {
    user {
      id
      username
      email
    }
  }
}
```

成功すると以下のようなレスポンスが返却されます。

```json
{
  "data": {
    "destroyDeleteUser": {
      "user": {
        "id": "VXNlcjo0",
        "username": "SOULs API",
        "email": "info@test.com"
      }
    }
  }
}
```

レコードからデータが削除されました。

`User` Model と同様に `Artice`, `ArticleCategory` も完成です。

必要なクエリやパラメーターの詳細はドキュメントを参考にしましょう。

右の DOCS をクリックするとドキュメントが表示されます。

![GraphQL ドキュメント](/imgs/docs/graphql-doc.png)
