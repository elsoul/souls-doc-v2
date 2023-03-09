---
id: auto-test
title: Automated testing-Rspec
description: The SOULs framework works with `test`. Here, the souls command and Rspec are used.
---

The SOULs framework goes along with`テスト`and development. Here, the souls command and Rspec are used.

## Testing framework-RSpec

SOULs API / Worker uses RSpec as a testing framework.

RSpec

<https://github.com/rspec/rspec>

![rspec](/imgs/gifs/rspec-video.gif)

In the SOULs framework, the `souls g` command automatically generates CRUD tests.

The test directory is mainly under `./spec/`

`factories` , `models` , `queries` , `mutations` , `resolvers` , `policies`

It is classified into 6 categories.

Let's look at each role.

## RSpec --Queries

The directory inside `queries` defines tests for GraphQL Query. The SOULs framework includes the following `user_spec.rb` files by default.

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

This Query Spec corresponds to the following GraphQL Query.

`./app/grahpql/queries/user.rb`

The SOULs framework does not display the database identity directly, but uses an encrypted UUID to manage the information. If you are new to `global_id_field` , please refer to this article.

[global_id_field](https://graphql-ruby.org/schema/object_identification.html)

for that reason,

```ruby:apps/api/app/grahpql/queries/user.rb
 _, data_id = SOULsApiSchema.from_global_id(args[:id])
```

The ID is converted as follows.

## RSpec --Mutations

The directory in `mutations` defines tests for GraphQL Mutation. The SOULs framework includes the following `user_spec.rb` files by default.

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

This Query Spec corresponds to the following GraphQL Query.

`./app/grahpql/mutations/base/user/create_user.rb`

## RSpec --Resolvers

The directory inside `resolvers` defines tests for GraphQL Resolver. The SOULs framework includes the following `user_search_spec.rb` files by default.

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

If you need to manipulate data such as sorting or searching for the main object, define it in Resolver.

## RSpec --Factories

The directory in `factories` defines the test data for the model in the database.

The SOULs API / Worker uses Faker, FactoryBot, and Gimei to generate user test data.

Faker

<https://github.com/faker-ruby/faker>

FactoryBot

<https://github.com/thoughtbot/factory_bot>

Gimei

<https://github.com/willnet/gimei>

When you actually share the app with the client, convert it to human-friendly data as much as possible.

The `Article` Model factory in the relationship with the `User` Model is

`./spec/factories/articles.rb`

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

The line `association :user, factory: :user` defines that it is related to the `User` Model. This allows you to instantly create an `Article` Model without having to create test data from the User Model.

Let's check using the SOULs console.

```bash
 $ souls c
```

Let's create `Article` Model data using FactoryBot.

```bash
 irb(main):001:0> FactoryBot.create( :article ) D, [ 2021 - 07 -21 T10: 48 : 55.758530 2678 ] DEBUG -- : TRANSACTION ( 0 .8ms) BEGIN D, [ 2021 - 07 -21 T10: 48 : 55.761804 2678 ] DEBUG -- : User Exists? ( 3 .1ms) SELECT 1 AS one FROM "users" WHERE "users" . "email" = $1 LIMIT $2 [[ "email" , "daniele@harber.net" ], [ "LIMIT" , 1 ]] D, [ 2021 - 07 -21 T10: 48 : 55.765162 2678 ] DEBUG -- : User Create ( 2 .0ms) INSERT INTO "users" ( "uid" , "username" , "screen_name" , "last_name" , "first_name" , "last_name_kanji" , "first_name_kanji" , "last_name_kana" , "first_name_kana" , "email" , "tel" , "icon_url" , "birthday" , "gender" , "created_at" , "updated_at" ) VALUES ( $1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 , $15 , $16 ) RETURNING "id" [[ "uid" , "EuDrZrPvV8sNi" ], [ "username" , "窪田 政伸" ], [ "screen_name" , "walter" ], [ "last_name" , "まつの" ], [ "first_name" , "はると" ], [ "last_name_kanji" , "佐伯" ], [ "first_name_kanji" , "正之" ], [ "last_name_kana" , "ホリ" ], [ "first_name_kana" , "ミズノ" ], [ "email" , "daniele@harber.net" ], [ "tel" , "6761514902" ], [ "icon_url" , "https://picsum.photos/200" ], [ "birthday" , "1994-03-01" ], [ "gender" , "金田 義弘" ], [ "created_at" , "2021-07-21 10:48:55.762563" ], [ "updated_at" , "2021-07-21 10:48:55.762563" ]] D, [ 2021 - 07 -21 T10: 48 : 55.769609 2678 ] DEBUG -- : TRANSACTION ( 4 .2ms) COMMIT D, [ 2021 - 07 -21 T10: 48 : 55.779854 2678 ] DEBUG -- : TRANSACTION ( 0 .5ms) BEGIN D, [ 2021 - 07 -21 T10: 48 : 55.781527 2678 ] DEBUG -- : ArticleCategory Create ( 1 .5ms) INSERT INTO "article_categories" ( "name" , "tags" , "created_at" , "updated_at" ) VALUES ( $1 , $2 , $3 , $4 ) RETURNING "id" [[ "name" , "General Systems Vehicle" ], [ "tags" , "{tag1,tag2,tag3}" ], [ "created_at" , "2021-07-21 10:48:55.779023" ], [ "updated_at" , "2021-07-21 10:48:55.779028" ]] D, [ 2021 - 07 -21 T10: 48 : 55.784177 2678 ] DEBUG -- : TRANSACTION ( 2 .5ms) COMMIT D, [ 2021 - 07 -21 T10: 48 : 55.785612 2678 ] DEBUG -- : TRANSACTION ( 0 .5ms) BEGIN D, [ 2021 - 07 -21 T10: 48 : 55.788462 2678 ] DEBUG -- : Article Create ( 2 .6ms) INSERT INTO "articles" ( "user_id" , "title" , "body" , "thumnail_url" , "public_date" , "article_category_id" , "just_created" , "slag" , "tags" , "created_at" , "updated_at" ) VALUES ( $1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 ) RETURNING "id" [[ "user_id" , 11 ], [ "title" , "I Sing the Body Electric" ], [ "body" , "Because of the Turing completeness theory, everything one Turing-complete language can do can theoretically be done by another Turing-complete language, but at a different cost. You can do everything in assembler, but no one wants to program in assembler anymore." ], [ "thumnail_url" , "http://nader.biz/hai" ], [ "public_date" , "2021-07-21 10:48:55.772391" ], [ "article_category_id" , 6 ], [ "just_created" , false ], [ "slag" , "EeMnG7jCz9JnTtPc" ], [ "tags" , "{tag1,tag2,tag3}" ], [ "created_at" , "2021-07-21 10:48:55.784725" ], [ "updated_at" , "2021-07-21 10:48:55.784731" ]] D, [ 2021 - 07 -21 T10: 48 : 55.791332 2678 ] DEBUG -- : TRANSACTION ( 2 .6ms) COMMIT => #<Article:0x0000563d5614f7c8
```

I was able to create it safely.

## RSpec --Models

The directory inside `models` defines a test for the model in the database. The SOULs framework includes the following `user_spec.rb` files by default.

```ruby:apps/api/spec/models/user_spec.rb
RSpec.describe("User Model テスト", type: :model) do
  describe "User データを書き込む" do
    it "valid User Model" do
      expect(FactoryBot.build(:user)).to(be_valid)
    end
  end
end
```

Proceed with the test using the FactoryBot you just created. Let's add tests to the Model as needed.
