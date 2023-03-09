---
id: auto-test
title: 自動テスト - Rspec
description: SOULs フレームワークでは `テスト` と共に開発を進めます。ここでは souls コマンド及び、Rspecを使用します。
---

:::div{.info}
SOULs フレームワークでは `テスト` と共に開発を進めます。ここでは souls コマンド及び、Rspec を使用します。
:::

## テストフレームワーク - RSpec

SOULs API/Worker では RSpec をテストフレームワークとして使っています。

RSpec

[https://github.com/rspec/rspec](https://github.com/rspec/rspec)

![rspec](/imgs/gifs/rspec-video.gif)

SOULs フレームワークでは `souls g` コマンドにより、
自動で CRUD のテストが生成されます。

テストディレクトリは `./spec/` 以下に主に、

`factories`, `models`, `queries`, `mutations`, `resolvers`, `policies`

の 6 つに分類されます。

それぞれの役割をみてみましょう。

## RSpec - Queries

`queries` 内のディレクトリでは GraphQL Query に対するテストを定義します。
SOULs フレームワークにはデフォルトで以下の `user_spec.rb` ファイルが含まれています。

```ruby:apps/api/spec/queries/user_spec.rb
RSpec.describe("User Query テスト") do
  describe "User データを取得する" do
    let!(:user) { FactoryBot.create(:user) }

    let(:query) do
      data_id = SOULsApiSchema.to_global_id("User", user.id.to_s)

      %(query {
        user(id: \"#{data_id}\") {
          id
          uid
          username
          screenName
          lastName
          firstName
          lastNameKanji
          firstNameKanji
          lastNameKana
          firstNameKana
          email
          tel
          iconUrl
          birthday
        }
      }
    )
    end

    subject(:result) do
      SOULsApiSchema.execute(query).as_json
    end

    it "return User Data" do
      begin
        a1 = result.dig("data", "user")
        raise unless a1.present?
      rescue StandardError
        raise(StandardError, result)
      end
      expect(a1).to(
        include(
          "id" => be_a(String),
          "uid" => be_a(String),
          "username" => be_a(String),
          "screenName" => be_a(String),
          "lastName" => be_a(String),
          "firstName" => be_a(String),
          "lastNameKanji" => be_a(String),
          "firstNameKanji" => be_a(String),
          "lastNameKana" => be_a(String),
          "firstNameKana" => be_a(String),
          "email" => be_a(String),
          "tel" => be_a(String),
          "iconUrl" => be_a(String),
          "birthday" => be_a(String)
        )
      )
    end
  end
end
```

この Query Spec は以下の GraphQL Query に対応しています。

SOULs フレームワークではデータベースの ID を直接表示せずに、暗号化した UUID を使って情報を管理します。
`global_id_field` について初めてのかたはこちらの記事を参考にしてください。

[global_id_field](https://graphql-ruby.org/schema/object_identification.html)

そのため、

```ruby:apps/api/app/grahpql/queries/user.rb
_, data_id = SOULsApiSchema.from_global_id(args[:id])
```

のように ID を変換しています。

## RSpec - Mutations

`mutations` 内のディレクトリでは GraphQL Mutation に対するテストを定義します。
SOULs フレームワークにはデフォルトで以下の `user_spec.rb` ファイルが含まれています。

```ruby:apps/api/spec/mutation/user_spec.rb
RSpec.describe("User Mutation テスト") do
  describe "User データを登録する" do
    let(:user) { FactoryBot.attributes_for(:user) }

    let(:mutation) do
      %(mutation {
        createUser(input: {
          uid: "#{user[:uid]}"
          username: "#{user[:username]}"
          screenName: "#{user[:screen_name]}"
          lastName: "#{user[:last_name]}"
          firstName: "#{user[:first_name]}"
          lastNameKanji: "#{user[:last_name_kanji]}"
          firstNameKanji: "#{user[:first_name_kanji]}"
          lastNameKana: "#{user[:last_name_kana]}"
          firstNameKana: "#{user[:first_name_kana]}"
          email: "#{user[:email]}"
          tel: "#{user[:tel]}"
          iconUrl: "#{user[:icon_url]}"
          birthday: "#{user[:birthday]}"
        }) {
            userEdge {
          node {
              id
              uid
              username
              screenName
              lastName
              firstName
              lastNameKanji
              firstNameKanji
              lastNameKana
              firstNameKana
              email
              tel
              iconUrl
              birthday
              }
            }
          }
        }
      )
    end

    subject(:result) do
      SOULsApiSchema.execute(mutation).as_json
    end

    it "return User Data" do
      begin
        a1 = result.dig("data", "createUser", "userEdge", "node")
        raise unless a1.present?
      rescue StandardError
        raise(StandardError, result)
      end
      expect(a1).to(
        include(
          "id" => be_a(String),
          "uid" => be_a(String),
          "username" => be_a(String),
          "screenName" => be_a(String),
          "lastName" => be_a(String),
          "firstName" => be_a(String),
          "lastNameKanji" => be_a(String),
          "firstNameKanji" => be_a(String),
          "lastNameKana" => be_a(String),
          "firstNameKana" => be_a(String),
          "email" => be_a(String),
          "tel" => be_a(String),
          "iconUrl" => be_a(String),
          "birthday" => be_a(String)
        )
      )
    end
  end
end
```

この Query Spec は以下の GraphQL Query に対応しています。

`./app/grahpql/mutations/base/user/create_user.rb`

## RSpec - Resolvers

`resolvers` 内のディレクトリでは GraphQL Resolver に対するテストを定義します。
SOULs フレームワークにはデフォルトで以下の `user_search_spec.rb` ファイルが含まれています。

```ruby:apps/api/spec/resolvers/user_search_spec.rb
RSpec.describe("UserSearch Resolver テスト") do
  describe "削除フラグ false の User を返却する" do
    let!(:user) { FactoryBot.create(:user) }

    let(:query) do
      %(query {
        userSearch(filter: {
          isDeleted: false
      }) {
          edges {
            cursor
            node {
              id
              uid
              username
              screenName
              lastName
              firstName
              lastNameKanji
              firstNameKanji
              lastNameKana
              firstNameKana
              email
              tel
              iconUrl
              birthday
              }
            }
            nodes {
              id
            }
            pageInfo {
              endCursor
              hasNextPage
              startCursor
              hasPreviousPage
            }
          }
        }
      )
    end

    subject(:result) do
      SOULsApiSchema.execute(query).as_json
    end

    it "return User Data" do
      begin
        a1 = result.dig("data", "userSearch", "edges")[0]["node"]
        raise unless a1.present?
      rescue StandardError
        raise(StandardError, result)
      end
      expect(a1).to(
        include(
          "id" => be_a(String),
          "uid" => be_a(String),
          "username" => be_a(String),
          "screenName" => be_a(String),
          "lastName" => be_a(String),
          "firstName" => be_a(String),
          "lastNameKanji" => be_a(String),
          "firstNameKanji" => be_a(String),
          "lastNameKana" => be_a(String),
          "firstNameKana" => be_a(String),
          "email" => be_a(String),
          "tel" => be_a(String),
          "iconUrl" => be_a(String),
          "birthday" => be_a(String)
        )
      )
    end
  end
end
```

主要なオブジェクトに対してソートや検索など、
データの操作が必要な場合は Resolver 内に定義します。

## RSpec - Factories

`factories` 内のディレクトリではデータベースの Model のテストデータを定義します。

SOULs API/Worker では Faker, FactoryBot, Gimei を使用してユーザーのテストデータを生成しています。

Faker

[https://github.com/faker-ruby/faker](https://github.com/faker-ruby/faker)

FactoryBot

[https://github.com/thoughtbot/factory_bot](https://github.com/thoughtbot/factory_bot)

Gimei

[https://github.com/willnet/gimei](https://github.com/willnet/gimei)

実際にアプリをクライアントと共有する際にはできるだけ、
人間に見やすいデータに変換してあげましょう。

`User` Model とリレーションにある `Article` Model のファクトリーは

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
    slag { Faker::Internet.password(min_length: 16) }
    tags { %w[tag1 tag2 tag3] }
    is_deleted { false }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
```

`association :user, factory: :user` という一行で `User` Model とリレーションにあることを定義しています。
これにより、テストデータをユーザー Model から作成することなく即時に `Article` Model を作成することができます。

SOULs コンソールを使って確認してみましょう。

```bash
$ souls c
```

FactoryBot を使って `Article` Model のデータを作成してみます。

```bash
irb(main):001:0> FactoryBot.create(:article)
D, [2021-07-21T10:48:55.758530 2678] DEBUG -- :   TRANSACTION (0.8ms)  BEGIN
D, [2021-07-21T10:48:55.761804 2678] DEBUG -- :   User Exists? (3.1ms)  SELECT 1 AS one FROM "users" WHERE "users"."email" = $1 LIMIT $2  [["email", "daniele@harber.net"], ["LIMIT", 1]]
D, [2021-07-21T10:48:55.765162 2678] DEBUG -- :   User Create (2.0ms)  INSERT INTO "users" ("uid", "username", "screen_name", "last_name", "first_name", "last_name_kanji", "first_name_kanji", "last_name_kana", "first_name_kana", "email", "tel", "icon_url", "birthday", "gender", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING "id"  [["uid", "EuDrZrPvV8sNi"], ["username", "窪田 政伸"], ["screen_name", "walter"], ["last_name", "まつの"], ["first_name", "はると"], ["last_name_kanji", "佐伯"], ["first_name_kanji", "正之"], ["last_name_kana", "ホリ"], ["first_name_kana", "ミズノ"], ["email", "daniele@harber.net"], ["tel", "6761514902"], ["icon_url", "https://picsum.photos/200"], ["birthday", "1994-03-01"], ["gender", "金田 義弘"], ["created_at", "2021-07-21 10:48:55.762563"], ["updated_at", "2021-07-21 10:48:55.762563"]]
D, [2021-07-21T10:48:55.769609 2678] DEBUG -- :   TRANSACTION (4.2ms)  COMMIT
D, [2021-07-21T10:48:55.779854 2678] DEBUG -- :   TRANSACTION (0.5ms)  BEGIN
D, [2021-07-21T10:48:55.781527 2678] DEBUG -- :   ArticleCategory Create (1.5ms)  INSERT INTO "article_categories" ("name", "tags", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["name", "General Systems Vehicle"], ["tags", "{tag1,tag2,tag3}"], ["created_at", "2021-07-21 10:48:55.779023"], ["updated_at", "2021-07-21 10:48:55.779028"]]
D, [2021-07-21T10:48:55.784177 2678] DEBUG -- :   TRANSACTION (2.5ms)  COMMIT
D, [2021-07-21T10:48:55.785612 2678] DEBUG -- :   TRANSACTION (0.5ms)  BEGIN
D, [2021-07-21T10:48:55.788462 2678] DEBUG -- :   Article Create (2.6ms)  INSERT INTO "articles" ("user_id", "title", "body", "thumnail_url", "public_date", "article_category_id", "just_created", "slag", "tags", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "id"  [["user_id", 11], ["title", "I Sing the Body Electric"], ["body", "Because of the Turing completeness theory, everything one Turing-complete language can do can theoretically be done by another Turing-complete language, but at a different cost. You can do everything in assembler, but no one wants to program in assembler anymore."], ["thumnail_url", "http://nader.biz/hai"], ["public_date", "2021-07-21 10:48:55.772391"], ["article_category_id", 6], ["just_created", false], ["slag", "EeMnG7jCz9JnTtPc"], ["tags", "{tag1,tag2,tag3}"], ["created_at", "2021-07-21 10:48:55.784725"], ["updated_at", "2021-07-21 10:48:55.784731"]]
D, [2021-07-21T10:48:55.791332 2678] DEBUG -- :   TRANSACTION (2.6ms)  COMMIT
=>
#<Article:0x0000563d5614f7c8
```

無事作成することができました。

## RSpec - Models

`models` 内のディレクトリではデータベースの Model のテストを定義します。
SOULs フレームワークにはデフォルトで以下の `user_spec.rb` ファイルが含まれています。

```ruby:apps/api/spec/models/user_spec.rb
RSpec.describe("User Model テスト", type: :model) do
  describe "User データを書き込む" do
    it "valid User Model" do
      expect(FactoryBot.build(:user)).to(be_valid)
    end
  end
end
```

先程作成した、FactoryBot を使ってテストを進めます。
必要に応じて、Model にテストを追加していきましょう。
