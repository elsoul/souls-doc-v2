---
id: graphql-batch-loader
title: Avoid N + 1 query problems
description: This section describes how to use the Ruby GraphQL Batch Loader to the SOULs framework to avoid N + 1 query issues.
---

:::div{.info}
This section describes how to use the Ruby GraphQL Batch Loader to the SOULs framework to avoid N + 1 query issues.
:::

The SOULs framework uses GraphQL Batch gems.

[Shopify GraphQL Batch Loader](https://github.com/Shopify/graphql-batch)

The SOULs framework comes standard with useful modules in a folder called `utils` .

We can use `association_loader.rb` and `record_loader.rb` to optimize queries.

## Preparation of initial data Seed.rb

The initial data is

`apps/api/db/seeds.rb`

Defined with

`souls db seed`

It can be executed with a command.

Now let's define the initial data.

```ruby:apps/api/db/seeds.rb
require "./app"

Dir[File.expand_path("#{Rack::Directory.new('').root}/spec/factories/*.rb")]
  .each { |file| require file }
Faker::Config.locale = "ja"

def create_article(user_id: 1, article_category_id: 1)
  p(FactoryBot.create(:article, user_id: user_id, article_category_id: article_category_id))
end

def create_comment(article_id: 1)
  p(FactoryBot.create(:comment, article_id: article_id))
end

# Create 10 users
10.times { p(FactoryBot.create(:user)) }

# Create 5 article categories
5.times { p(FactoryBot.create(:article_category)) }

# Fetch an array of all user IDs
user_ids = User.all.map(&:id)

# Fetch an array of all category IDs
article_category_ids = ArticleCategory.all.map(&:id)

# Create 100 articles
100.times { create_article(user_id: user_ids.sample, article_category_id: article_category_ids.sample) }

# Fetch an array of all article IDs
article_ids = Article.all.map(&:id)

# Create 150 comments
150.times { create_comment(article_id: article_ids.sample) }
```

Run the `souls db seed` command.

```bash
$ souls db seed
.
.
<Comment id: 297, article_id: 59, from: "ルイージ", body: "He said Mom was ugly, now go get him!", is_deleted: false, created_at: "2021-08-11 09:21:43.169167000 +0200", updated_at: "2021-08-11 09:21:43.169172000 +0200">
<Comment id: 298, article_id: 87, from: "ワリオ", body: "Aren't you even going to knock? You're the most pa...", is_deleted: false, created_at: "2021-08-11 09:21:43.174292000 +0200", updated_at: "2021-08-11 09:21:43.174297000 +0200">
<Comment id: 299, article_id: 38, from: "プンプン", body: "Take her back to Civilisation.", is_deleted: false, created_at: "2021-08-11 09:21:43.178535000 +0200", updated_at: "2021-08-11 09:21:43.178540000 +0200">
<Comment id: 300, article_id: 9, from: "キャサリン", body: "I give up. I see no point in living if I can’t be ...", is_deleted: false, created_at: "2021-08-11 09:21:43.182621000 +0200", updated_at: "2021-08-11 09:21:43.182627000 +0200">
```

The test data has been created.

## GraphQL Batch Loader usage example

`association_loader.rb` and `record_loader.rb`

Let's take an example of using `RecordLoader` and `AssociationLoader` to bridge the relationship between the `User` and `Article` models as an example.

`RecordLoader` gets the record associated with the ID of the Model column.

`AssociationLoader` gets the records via the relationship defined in the model.

## Implementation of RecordLoader

RecordLoader is called within `Types` .

Take a look at `user_type.rb` .

```ruby:souls-app/apps/api/app/graphql/types/user_type.rb
module Types
  class UserType < BaseObject
    implements GraphQL::Types::Relay::Node

    global_id_field :id
    field :articles, [Types::ArticleType], null: true
    field :birthday, String, null: true
    field :category, String, null: true
    field :created_at, String, null: true
    field :email, String, null: true
    field :first_name, String, null: true
    field :first_name_kana, String, null: true
    field :first_name_kanji, String, null: true
    field :gender, String, null: true
    field :icon_url, String, null: true
    field :is_deleted, Boolean, null: true
    field :lang, String, null: true
    field :last_name, String, null: true
    field :last_name_kana, String, null: true
    field :last_name_kanji, String, null: true
    field :roles_mask, Integer, null: true
    field :screen_name, String, null: true
    field :tel, String, null: true
    field :uid, String, null: true
    field :updated_at, String, null: true
    field :username, String, null: true

    def articles
      Article.where(user_id: object.id)
    end
  end
end
```

Then try sending the following query.

```ruby
query {
  users {
    totalCount
    totalPages
    edges {
      node {
        id
        username
        article {
          id
          title
        }
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

The following response will be returned.

```json
{
  "data": {
    "users": {
      "totalCount": 12,
      "totalPages": 1,
      "edges": [
        {
          "node": {
            "id": "VXNlcjoxMg==",
            "username": "星野 幸治郎",
            "article": [],
            "createdAt": "2021-07-21T11:20:16+02:00",
            "updatedAt": "2021-07-21T11:20:16+02:00"
          }
        },
        {
          "node": {
            "id": "VXNlcjoxMQ==",
            "username": "窪田 政伸",
            "articles": [
              {
                "id": "QXJ0aWNsZToxMDE=",
                "title": "I Sing the Body Electric"
              }
            ],
            "createdAt": "2021-07-21T10:48:55+02:00",
            "updatedAt": "2021-07-21T11:19:44+02:00"
          }
        }
      ]
    }
  }
}
```

`Article` data associated with `User` has been returned. The `User` and `Article` nodes and edges are now connected.

## Fixed N + 1 query problem

But let's take a look at the console.

```bash
16:19:23 web.1   | D, [2021-07-27T16:19:23.552436 #10022] DEBUG -- :    (0.9ms)  SELECT COUNT(*) FROM "users"
16:19:23 web.1   | D, [2021-07-27T16:19:23.554141 #10022] DEBUG -- :    (0.6ms)  SELECT COUNT(*) FROM "users"
16:19:23 web.1   | D, [2021-07-27T16:19:23.556683 #10022] DEBUG -- :   User Load (0.7ms)  SELECT "users".* FROM "users" ORDER BY "users"."created_at" DESC, "users"."id" DESC LIMIT $1  [["LIMIT", 100]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.579808 #10022] DEBUG -- :   Article Load (0.9ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 12]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.581395 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 11]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.590423 #10022] DEBUG -- :   Article Load (0.6ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 10]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.591942 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 9]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.592989 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 8]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.593918 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 7]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.594787 #10022] DEBUG -- :   Article Load (0.4ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 6]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.595776 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 5]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.597971 #10022] DEBUG -- :   Article Load (0.6ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 4]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.599785 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 3]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.602081 #10022] DEBUG -- :   Article Load (0.6ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 2]]
16:19:23 web.1   | D, [2021-07-27T16:19:23.603819 #10022] DEBUG -- :   Article Load (0.5ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" = $1  [["user_id", 1]]
```

Every time I get the `Article` associated with the `User` , I issue the query again. Commonly known as the N + 1 problem, it will later turn into a big bomb in the operation of the app.

Therefore, use GraphQL Batch Loader to optimize the query.

Define the `article` method in `Types::UserType` .

```ruby:app/graphql/types/user_type.rb
module Types
  class UserType < BaseObject
    ## 中略 ##

    def article
      AssociationLoader.for(User, :article).load(object)
    end
  end
end
```

Run the same query again to see the difference in the console.

```bash
16:34:01 web.1   | D, [2021-07-27T16:34:01.607812 #10977] DEBUG -- :    (1.0ms)  SELECT COUNT(*) FROM "users"
16:34:01 web.1   | D, [2021-07-27T16:34:01.609540 #10977] DEBUG -- :    (0.6ms)  SELECT COUNT(*) FROM "users"
16:34:01 web.1   | D, [2021-07-27T16:34:01.611820 #10977] DEBUG -- :   User Load (0.6ms)  SELECT "users".* FROM "users" ORDER BY "users"."created_at" DESC, "users"."id" DESC LIMIT $1  [["LIMIT", 100]]
16:34:01 web.1   | D, [2021-07-27T16:34:01.635055 #10977] DEBUG -- :   Article Load (1.4ms)  SELECT "articles".* FROM "articles" WHERE "articles"."user_id" IN ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)  [["user_id", 12], ["user_id", 11], ["user_id", 10], ["user_id", 9], ["user_id", 8], ["user_id", 7], ["user_id", 6], ["user_id", 5], ["user_id", 4], ["user_id", 3], ["user_id", 2], ["user_id", 1]]
```

The query has been successfully optimized.

GraphQL is very powerful, but like any other database system, it can put strain on your application if used incorrectly.

Try to reduce unnecessary data flow as much as possible and design around batch queries.

## RecordLoader Implementation

RecordLoader is called from `Types`. Looking at the `article_type.rb` file:

```ruby:apps/api/app/graphql/types/article_type.rb
module Types
  class ArticleType < BaseObject
    implements GraphQL::Types::Relay::Node
    global_id_field :id
    field :article_category, Types::ArticleCategoryType, null: false
    field :body, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :is_deleted, Boolean, null: true
    field :is_public, Boolean, null: true
    field :just_created, Boolean, null: true
    field :public_date, GraphQL::Types::ISO8601DateTime, null: true
    field :slug, String, null: true
    field :tags, [String], null: true
    field :thumnail_url, String, null: true
    field :title, String, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :user, Types::UserType, null: false

    def user
      RecordLoader.for(User).load(object.user_id)
    end

    def article_category
      RecordLoader.for(ArticleCategory).load(object.article_category_id)
    end
  end
end
```

A model is defined for each field relation.

```diff
+ field :article_category, Types::ArticleCategoryType, null: false
+ field :user, Types::UserType, null: false
```

Then we can define a related method.

```ruby:apps/api/app/graphql/types/article_type.rb
def user
  RecordLoader.for(User).load(object.user_id)
end

def article_category
  RecordLoader.for(ArticleCategory).load(object.article_category_id)
end
```

Then the following request will work.

```ruby
query {
  articles {
    edges {
      node {
        id
        title
        user {
          id
          username
        }
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

And the following response will be returned:

```json
{
  "data": {
    "articles": {
      "edges": [
        {
          "node": {
            "id": "QXJ0aWNsZToxMDA=",
            "title": "阿Ｑ正伝",
            "user": {
              "id": "VXNlcjoxMA==",
              "username": "西田 成穂"
            }
          }
        },
        {
          "node": {
            "id": "QXJ0aWNsZTo5OQ==",
            "title": "猫の蚤とり武士",
            "user": {
              "id": "VXNlcjo1",
              "username": "小倉 瑞惠"
            }
          }
        },
        {
          "node": {
            "id": "QXJ0aWNsZTo5OA==",
            "title": "吾輩は猫である",
            "user": {
              "id": "VXNlcjo2",
              "username": "小野 未悠"
            }
          }
        },
```

The query has also been successfully optimized.

```bash
09:53:33 web.1   | D, [2021-11-17T09:53:33.130327 #10331] DEBUG -- :   Article Load (1.8ms)  SELECT "articles".* FROM "articles" ORDER BY "articles"."id" DESC LIMIT $1  [["LIMIT", 100]]
09:53:33 web.1   | D, [2021-11-17T09:53:33.158024 #10331] DEBUG -- :   Article Exists? (1.4ms)  SELECT 1 AS one FROM "articles" LIMIT $1 OFFSET $2  [["LIMIT", 1], ["OFFSET", 100]]
09:53:47 web.1   | D, [2021-11-17T09:53:47.657416 #10331] DEBUG -- :   Article Load (2.1ms)  SELECT "articles".* FROM "articles" ORDER BY "articles"."id" DESC LIMIT $1  [["LIMIT", 100]]
09:53:47 web.1   | D, [2021-11-17T09:53:47.679863 #10331] DEBUG -- :   Article Exists? (1.4ms)  SELECT 1 AS one FROM "articles" LIMIT $1 OFFSET $2  [["LIMIT", 1], ["OFFSET", 100]]
09:53:47 web.1   | D, [2021-11-17T09:53:47.685213 #10331] DEBUG -- :   User Load (1.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" IN ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ORDER BY "users"."created_at" DESC  [["id", 10], ["id", 5], ["id", 6], ["id", 3], ["id", 9], ["id", 8], ["id", 4], ["id", 7], ["id", 11], ["id", 2]]
```
