---
id: graphql-api
title: GraphQL API
description: SOULs では Ruby GraphQL API をすぐに立ち上げることができます。ここでは基本的なブログアプリケーションについて説明します。
---

:::div{.info}
SOULs では Ruby GraphQL API をすぐに立ち上げることができます。ここでは基本的なブログアプリケーションについて説明します。
:::

## Node & Edge

それでは実際に動かしながら Node と Edge の関係を見てみましょう。

ブログアプリケーションの `Article` Model と `User` Model のデータを取得してみます。

アプリをローカルで立ち上げます。

`souls s`

GraphQL Playground へアクセスします。

[localhost:4000/playground](localhost:4000/playground)

そして以下の Query を送信してみます。

```ruby
query {
  articles {
    totalCount
    totalPages
    edges {
      node {
        id
        title
        body
        user {
          id
          username
        }
        isPublic
        createdAt
        updatedAt
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

すると以下のようなレスポンスが返ってきました。

```json
{
  "data": {
    "articles": {
      "totalCount": 100,
      "totalPages": 2,
      "edges": [
        {
          "node": {
            "id": "QXJ0aWNsZToxMDA=",
            "title": "The Proper Study",
            "body": "It is not the responsibility of the language to force good looking code, but the language should make good looking code possible.",
            "user": {
              "id": "VXNlcjoz",
              "username": "長田 帆矩"
            },
            "isPublic": false,
            "createdAt": "2021-07-07T09:00:38+02:00",
            "updatedAt": "2021-07-07T09:00:38+02:00"
          }
        },
        {
          "node": {
            "id": "QXJ0aWNsZTo5OQ==",
            "title": "All the King's Men",
            "body": "Ruby inherited the Perl philosophy of having more than one way to do the same thing. I inherited that philosophy from Larry Wall, who is my hero actually. I want to make Ruby users free. I want to give them the freedom to choose.",
            "user": {
              "id": "VXNlcjo1",
              "username": "村松 雪恵"
            },
            "isPublic": false,
            "createdAt": "2021-07-07T09:00:38+02:00",
            "updatedAt": "2021-07-07T09:00:38+02:00"
          }
        },
```

一回の Query で`Article` に結びついた `User` のデータも取得できていることがわかります。

複数の Model を返すときは `connection` を返します。

`BaseConnection`　には以下の項目がデフォルトで含まれます。

```ruby
edges: [ArticleEdge]
nodes: [Article]
pageInfo: PageInfo!
totalCount: Int!
totalPages: Int!
```

必要に応じてカスタマイズすることができます。

`connection` は `./app/graphql/connections/` 内で定義されます。

``

```ruby:apps/api/app/graphql/connections/article_connection.rb
class Types::ArticleConnection < Types::BaseConnection
  edge_type(Types::ArticleEdge)
end
```

`edge` は `apps/api/app/graphql/types/edges/` 内で定義されます。

```ruby:apps/api/app/graphql/types/edges/article_edge.rb
module Types
  class ArticleEdge < Types::BaseEdge
    node_type(Types::ArticleType)
  end
end
```

これらのファイルは `souls` コマンドによって自動生成されるので、
編集する必要はありません。

## Type

Type ではデータベースのカラムの型を定義します。

`./app/graphql/types` 内の `user_type.rb`　をみてみます。

```ruby:apps/app/graphql/types/user_type.rb
module Types
  class UserType < BaseObject
    implements GraphQL::Types::Relay::Node

    global_id_field :id
    field :birthday, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :email, String, null: true
    field :first_name, String, null: true
    field :first_name_kana, String, null: true
    field :first_name_kanji, String, null: true
    field :icon_url, String, null: true
    field :last_name, String, null: true
    field :last_name_kana, String, null: true
    field :last_name_kanji, String, null: true
    field :screen_name, String, null: true
    field :tel, String, null: true
    field :uid, String, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :username, String, null: true
  end
end
```

ここでは `User` Model のカラムの型を定義していますが、 `global_id_field` は GraphQL の関数です。SOULs フレームワークではデータベースの ID を直接表示せずに、グローバルユニークになるようエンコードした UUID を使って情報を管理します。
`global_id_field` について初めてのかたはこちらの記事を参考にしてください。

[global_id_field](https://graphql-ruby.org/schema/object_identification.html)

フィールド名, カラム名,　型, null 許容　の順番に書き込みます。

## Query

Model からデータを取得するには Query を使います。Query には単数と複数 2 種類の Query があります。

### Query - 単数

一つのレコードを取得するときは単数の Query を使います。

```ruby:apps/api/app/graphql/queries/user.rb
module Queries
  class User < Queries::BaseQuery
    type Types::UserType, null: false
    argument :id, String, required: true

    def resolve(args)
      _, data_id = SOULsApiSchema.from_global_id(args[:id])
      ::User.find(data_id)
    rescue StandardError => e
      GraphQL::ExecutionError.new(e)
    end
  end
end
```

この `User` Query は引数に ID をとって、ID に紐付いたデータを返却します。

アプリケーション上では UUID を使ってデータのやり取りを行うので、
String で送られてきた UUID をデータベースの ID にデコードしています。

```ruby:apps/api/app/graphql/queries/user.rb
_, data_id = SOULsApiSchema.from_global_id(args[:id])
```

このように基本的な CRUD API に関しては

`Queries`,

`Resolvers`,

`ConnectionType`

の 3 つを `./db/schema.rb` をもとに自動生成しています。

CRUD Model とは関係なく、例外的に Query を作成する場合は、通常通り、

```ruby:apps/api/app/graphql/types/base/query_type.rb
field :me, resolver: Queries::Me
```

のように、直接 `./app/graphql/types/base/query_type.rb` に定義することができます。

## Mutation

Mutation には `create`, `update`, `delete`, `destroy_delete`
の 4 つの種類があります。

これらのファイルは `./app/graphql/mutations/base` ディレクトリに作られます。

GraphQL では CRUD（登録、表示、更新、削除） の表示の部分は Query を使い、登録、更新、削除 は Mutation を使います。

### Mutation - 登録

登録に関する `create_user.rb` を見てみます。

```ruby:apps/api/app/graphql/mutations/base/create_user.rb
module Mutations
  module Base::User
    class CreateUser < BaseMutation
      field :error, String, null: true
      field :user_edge, Types::UserType.edge_type, null: false

      argument :birthday, String, required: false
      argument :email, String, required: false
      argument :first_name, String, required: false
      argument :first_name_kana, String, required: false
      argument :first_name_kanji, String, required: false
      argument :icon_url, String, required: false
      argument :last_name, String, required: false
      argument :last_name_kana, String, required: false
      argument :last_name_kanji, String, required: false
      argument :screen_name, String, required: false
      argument :tel, String, required: false
      argument :uid, String, required: false
      argument :username, String, required: false

      def resolve(args)
        data = ::User.new(args)
        raise(StandardError, data.errors.full_messages) unless data.save

        { user_edge: { node: data } }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e)
      end
    end
  end
end
```

`field` でレスポンスする型を定義します。

ここでは `Types::UserType.edge_type` と `error` レスポンスを定義しています。
`edge_type` は フロントエンド Relay に対応する形式を取るために使用しています。

[Relay](https://relay.dev)

`argument` に引数の型を定義し、`required` かどうかを定義します。

引数が `resolver` を通過後、ユーザーデータが保存されれば、`user_edge` が返却されます。
問題がある場合は、GraphQL にエラーを伝えます。

サンプルクエリを使って、ユーザーの新規登録をしてみましょう。

`souls s`

でアプリを立ち上げて、

[localhost:4000/playground](localhost:4000/playground)

からリクエストを送信します。

サンプルリクエスト

```ruby
mutation {
  createUser(
    input: {
      username: "Daan"
      email: "te@mail.com"
      uid: "test-id"
      }
  ) {
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

成功すると、以下のようなレスポンスが返ってきます。

```json
{
  "data": {
    "createUser": {
      "userEdge": {
        "node": {
          "id": "VXNlcjoyNg==",
          "username": "Daan",
          "email": "te@mail.com"
        }
      }
    }
  }
}
```

無事にユーザーをデータベースに登録することができました。

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

## Resolver

実際にアプリを運用する際は、データ取得するときに、毎回すべてのデータを取得するのではなく、
必要なときに、必要な分のデータがほしい場面が数多くあります。
そんなときは Resolver を使ってデータを取得しましょう。

GraphQL には `search_object` という plugin があります。

まだ使ったことがない方はこちらの GitHub のリンクを参考にしてください。

[GitHub: "search_object"](https://github.com/RStankov/SearchObjectGraphQL)

SOULs では `./app.rb` でこれらのプラグインを読み込んでいます。

```ruby
require "search_object"
require "search_object/plugin/graphql"
```

SOULs フレームワークでは `./app/graphql/resolver` 内のディレクトリで、

`./app/grahpql/resolvers/${CLASS_NAME}_search.rb` のようなファイル名で

定義されます。

`user_search.rb` を見てみましょう。

```ruby:apps/api/app/graphql/resolvers/user_search.rb
module Resolvers
  class UserSearch < Base
    include SearchObject.module(:graphql)
    scope { ::User.all }
    type Types::UserType.connection_type, null: false
    description "Search User"

    class UserFilter < ::Types::BaseInputObject
      argument :OR, [self], required: false
      argument :birthday, String, required: false
      argument :email, String, required: false
      argument :end_date, String, required: false
      argument :first_name, String, required: false
      argument :first_name_kana, String, required: false
      argument :first_name_kanji, String, required: false
      argument :icon_url, String, required: false
      argument :is_deleted, Boolean, required: false
      argument :last_name, String, required: false
      argument :last_name_kana, String, required: false
      argument :last_name_kanji, String, required: false
      argument :screen_name, String, required: false
      argument :start_date, String, required: false
      argument :tel, String, required: false
      argument :uid, String, required: false
      argument :username, String, required: false
    end

    option :filter, type: UserFilter, with: :apply_filter
    option :first, type: types.Int, with: :apply_first
    option :skip, type: types.Int, with: :apply_skip

    def apply_filter(scope, value)
      branches = normalize_filters(value).inject { |acc, elem| acc.or(elem) }
      scope.merge(branches)
    end

    def normalize_filters(value, branches = [])
      scope = ::User.all
      scope = scope.where(uid: value[:uid]) if value[:uid]
      scope = scope.where(username: value[:username]) if value[:username]
      scope = scope.where(screen_name: value[:screen_name]) if value[:screen_name]
      scope = scope.where(last_name: value[:last_name]) if value[:last_name]
      scope = scope.where(first_name: value[:first_name]) if value[:first_name]
      scope = scope.where(last_name_kanji: value[:last_name_kanji]) if value[:last_name_kanji]
      scope = scope.where(first_name_kanji: value[:first_name_kanji]) if value[:first_name_kanji]
      scope = scope.where(last_name_kana: value[:last_name_kana]) if value[:last_name_kana]
      scope = scope.where(first_name_kana: value[:first_name_kana]) if value[:first_name_kana]
      scope = scope.where(email: value[:email]) if value[:email]
      scope = scope.where(tel: value[:tel]) if value[:tel]
      scope = scope.where(icon_url: value[:icon_url]) if value[:icon_url]
      scope = scope.where(birthday: value[:birthday]) if value[:birthday]
      scope = scope.where(is_deleted: value[:is_deleted]) unless value[:is_deleted].nil?
      scope = scope.where("created_at >= ?", value[:start_date]) if value[:start_date]
      scope = scope.where("created_at <= ?", value[:end_date]) if value[:end_date]

      branches << scope

      value[:OR].inject(branches) { |acc, elem| normalize_filters(elem, acc) } if value[:OR].present?

      branches
    end
  end
end
```

最初の `argument` で受け付けることのできる型を定義します。
`option` では最初のページをスキップするなど、引数をカスタマイズすることができます。

ユーザーのデータを Resolver から取得してみましょう。

サンプルクエリ

```ruby
query {
  userSearch(filter: { isDeleted: false }) {
    edges {
      node {
        id
        username
        email
        isDeleted
      }
    }
  }
}
```

`filter` に `isDeleted: false` を定義しています。
これにより、ユーザー Model の `is_deleted` カラムが `false` のユーザーを返却しています。
成功すると、以下のようなレスポンスが返ってきます。

```json
{
  "data": {
    "userSearch": {
      "edges": [
        {
          "node": {
            "id": "VXNlcjoyNg==",
            "username": "Daan",
            "email": "te@mail.com",
            "isDeleted": false
          }
        },
        {
          "node": {
            "id": "VXNlcjoyNQ==",
            "username": "Daan",
            "email": "tedsdst@mail.com",
            "isDeleted": false
          }
        },
```
