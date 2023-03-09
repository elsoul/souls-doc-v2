---
id: update-model
title: Model の作成・追加・更新
description: ここでは souls コマンドを使って新規テーブルの追加、及び、既存の Model にカラムを追加する方法について説明します。
---

:::div{.info}
ここでは souls コマンドを使って新規テーブルの追加、及び、既存の Model にカラムを追加する方法について説明します。
:::

SOULs フレームワークで新しい テーブル を追加するときに必要が作業は以下の 5 つのステップです。

1. Migration ファイルの作成
2. `souls db migrate` コマンドの実行
3. `souls g scaffold` コマンドの実行
4. Model、FactoryBot の定義、
5. `souls test` コマンドの実行

Model の新規作成でも、既存のテーブルへのカラム追加でも、
このステップは変わりません。

SOULs では、新しい API が増えるたびに、新しいテストも追加されていきます。

## User Model を作成する

```bash
$ souls db create_migration user
db/migrate/20210818082734_create_users.rb
🎉  Done!
```

```ruby:apps/api/db/migrate/20210818082734_create_users.rb
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

## souls db migrate の実行

```bash
$ souls db migrate
== 20210818082734 CreateUsers: migrating ======================================
-- create_table(:users)
   -> 0.0223s
-- add_index(:users, :uid)
   -> 0.0054s
-- add_index(:users, :screen_name)
   -> 0.0050s
-- add_index(:users, :email, {:unique=>true})
   -> 0.0050s
-- add_index(:users, :username)
   -> 0.0068s
-- add_index(:users, :is_deleted)
   -> 0.0049s
== 20210818082734 CreateUsers: migrated (0.0498s) =============================
```

## souls g scaffold コマンドの実行

```bash
$ souls g scaffold user
Created file! : ./app/models/user.rb
Created file! : ./app/graphql/types/user_type.rb
Created file! : ./app/graphql/types/edges/user_edge.rb
Created file! : ./app/graphql/types/connections/user_connection.rb
Created file! : ./app/graphql/resolvers/user_search.rb
Created file! : ./spec/factories/users.rb
Created file! : ./spec/models/user_spec.rb
Created file! : ./spec/mutations/base/user_spec.rb
Created file! : ./spec/queries/user_spec.rb
Created file! : ./spec/resolvers/user_search_spec.rb
Created file! : ./app/graphql/queries/user.rb
Created file! : ./app/graphql/queries/users.rb
Created file! : ./app/graphql/mutations/base/user/create_user.rb
Created file! : ./app/policies/user_policy.rb
Created file! : ./spec/policies/user_policy_spec.rb
🎉  Generated SOULs CRUD Files
```

## User Model の定義

続いて `User` Model を定義します。

```ruby:apps/api/app/models/user.rb
class User < ActiveRecord::Base
  include RoleModel
  has_many :article

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  private_constant :VALID_EMAIL_REGEX
  validates :email, presence: true, uniqueness: true, format: { with: VALID_EMAIL_REGEX }

  roles :normal, :user, :admin, :master
  before_create :assign_initial_roles

  # Scope
  default_scope -> { order(created_at: :desc) }

  def assign_initial_roles
    roles << [:normal]
  end
end
```

## FactoryBot の定義

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

## souls test コマンドの実行

Model と Factory の定義が終わったので、
テストでアプリの状態を確認します。

```bash
$ souls test
User Model テスト
  User データを書き込む
    valid User Model

UserSearch Resolver テスト
  削除フラグ false の User を返却する
    return User Data

User Query テスト
  User データを取得する
    return User Data

User Mutation テスト
  User データを登録する
    return User Data

Finished in 0.92612 seconds (files took 1.28 seconds to load)
9 examples, 0 failures

Randomized with seed 15544
```

9 つのテストすべてが成功しました。

## User テーブルにカラムを追加する

続いて、`User` テーブルにカラムを追加してみます。

`User` テーブルに `member_name`, `member_rank`, `is_membership`, `member_badges` カラムを追加します。

| カラム名      | 型      |
| ------------- | ------- |
| member_name   | String  |
| member_rank   | Integer |
| is_membership | Boolean |
| member_badges | Array   |

`souls db add_column` コマンドを使います。

```bash
$ souls db add_column user
db/migrate/20210816092410_add_column_to_users.rb.
🎉  Done!
```

作成された Migration ファイルに新しいカラムを定義します。

```ruby
class AddColumnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :member_name, :string, null: false, default: ""
    add_column :users, :member_rank, :integer, null: false, default: 0
    add_column :users, :member_badges, :string, null: false, array: true, default: []
    add_column :users, :is_membership, :boolean, null: false, default: false
  end
end
```

## souls db migrate コマンドの実行

```bash
$ souls db migrate
== 20210816092410 AddColumnToUsers: migrating =================================
-- add_column(:users, :member_name, :string, {:null=>false, :default=>""})
   -> 0.0019s
-- add_column(:users, :member_rank, :integer, {:null=>false, :default=>0})
   -> 0.0012s
-- add_column(:users, :member_badges, :string, {:null=>false, :array=>true, :default=>[]})
   -> 0.0012s
-- add_column(:users, :is_membership, :boolean, {:null=>false, :default=>false})
   -> 0.0013s
== 20210816092410 AddColumnToUsers: migrated (0.0058s) ========================
```

## souls update の実行

`souls g scaffold user` コマンドで作成した CRUD に関係するすべてのファイルに新しいカラムを追加する必要があります。

`souls update` コマンドを使えば、新しく追加したカラムを自動で必要なファイルに追記することができます。

```bash
$ souls update scaffold user
Updated file! : ./app/graphql/mutations/base/user/create_user.rb
Updated file! : ./app/graphql/mutations/base/user/update_user.rb
Updated file! : ./app/graphql/resolvers/user_search.rb
Updated file! : ./app/graphql/types/user_type.rb
Updated file! : ./spec/factories/users.rb
Updated file! : ./spec/mutations/base/user_spec.rb
Updated file! : ./spec/resolvers/user_search_spec.rb
🎉  Done!
```

パラメーターを扱う 7 つのファイルが更新されました。

| 自動更新されるファイル |
| ---------------------- |
| create mutation        |
| update mutation        |
| resolver               |
| type                   |
| rspec mutation         |
| rspec factory          |
| rspec resolver         |

## souls test コマンドの実行

新しい変更が終わったときには必ずテストでアプリの状態を確認しましょう。

```bash
$ souls test
    return User Data

User Model テスト
  User データを書き込む
    valid User Model

User Mutation テスト
  User データを登録する
    return User Data

Finished in 0.92958 seconds (files took 1.33 seconds to load)
9 examples, 0 failures

Randomized with seed 55205
```

無事カラムを追加することができました。
