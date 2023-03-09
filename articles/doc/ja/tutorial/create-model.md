---
id: create-model
title: Model を作成する
description: このチュートリアルは `souls db` コマンドを使って マイグレーションファイル を作成する方法を説明します。
---

:::div{.info}
このチュートリアルは `souls db` コマンドを使って マイグレーションファイル を作成する方法を説明します。ActiveRecord について復習する必要がある方はこちらの [ActiveRecord](https://github.com/rails/rails/tree/main/activerecord) を先に読むことをお勧めします。
:::

![create_migration](/imgs/gifs/create-migration-video.gif)

[クイックスタート](/ja/docs/start/quickstart/)
を終了し、アプリが動いていることを確認してください。
このチュートリアルではクイックスタートで作成したアプリを使って開発を進めていきます。

ここでは API ディレクトリで作業を行います。

## テストを実行する

SOULs フレームワークではテストと共に開発を進めていきます。

api ディレクトリに移動して、SOULs API を起動することを確認してください。

まずはテストを実行します。

```bash
$ cd apps/api
$ souls test
Inspecting 32 files
................................

31 files inspected, no offenses detected
Run options: exclude {:uses_external_service=>true, :long=>true}

All examples were filtered out

Randomized with seed 10663

Finished in 0.13387 seconds (files took 1.38 seconds to load)
0 examples, 0 failures

Randomized with seed 10663
```

0 つのテストが確認されました。

## Migration ファイルの作成

`souls db create_migration` コマンドを使って Migration ファイルを作成します。

```bash
$ souls db create_migration ${table_name}
```

`${table_name}` にはテーブル名が入るので、
ここでは `user` を指定します。

```bash
$ souls db create_migration user
db/migrate/20210930154336_create_users.rb
Created file! : ./app/models/user.rb
Created file! : ./spec/models/user_spec.rb
```

`souls db create_migration` コマンドによって以下の 5 つのファイルが生成されました。

| ファイル名          | 役割             | パス             |
| ------------------- | ---------------- | ---------------- |
| \*\_create_users.rb | マイグレーション | API ディレクトリ |
| user.rb             | Model            | API ディレクトリ |
| user_spec.rb        | Rspec            | API ディレクトリ |

それでは生成されたファイルを確認してみます。

### Migration ファイル

```ruby:apps/api/db/migrate/20210930151749_create_users.rb
class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|

      t.boolean :is_deleted, null: false, default: false
      t.timestamps
    end
  end
end
```

SOULs フレームワークではデフォルトで以下の３つのカラムが作成されます。

| カラム名   | 型       |
| ---------- | -------- |
| is_deleted | Boolean  |
| created_at | DateTime |
| updated_at | DateTime |

これらのカラムは後に登場する `souls g scaffold` コマンドで自動生成されるファイルと
関連するので、これらのカラムは変更しないようにしましょう。

### Model ファイル

```ruby:apps/api/app/models/user.rb
class User < ActiveRecord::Base
end
```

User Model が生成されました。

### Rspec ファイル

```ruby:app/api/spec/models/user_spec.rb
RSpec.describe "User Model テスト", type: :model do
  describe "User データを書き込む" do
    it "valid User Model" do
      expect(FactoryBot.build(:user)).to be_valid
    end
  end
end
```

User Model に対する `Rspec` ファイルが生成されました。

## Migration ファイルの定義

先程生成された Migration ファイルに `User` テーブルのカラムを定義します。

```ruby:db/migrate/20210728081544_create_users.rb
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

## souls db コマンドの実行

`souls help` と実行することで、

SOULs CLI コマンドを確認することができます。

`souls db` コマンドのヘルプを表示させてみます。

```bash
$ souls db help
  Commands:
    souls db add_column [CLASS_NAME]            # Create ActiveRecord Migration File
    souls db change_column [CLASS_NAME]         # Create ActiveRecord Migration File
    souls db create                             # Create Database
    souls db create_migration [CLASS_NAME]      # Create ActiveRecord Migration File
    souls db drop_table [CLASS_NAME]            # Create ActiveRecord Migration File
    souls db help [COMMAND]                     # Describe subcommands or one specific subcommand
    souls db migrate                            # Migrate Database
    souls db migrate_reset                      # Reset Database
    souls db model [CLASS_NAME]                 # Generate Model Template
    souls db remove_column [CLASS_NAME]         # Create ActiveRecord Migration File
    souls db rename_column [CLASS_NAME]         # Create ActiveRecord Migration File
    souls db reset                              # Reset Database and Seed
    souls db rspec_model [CLASS_NAME]           # Generate Rspec Model Test from schema.rb
    souls db seed                               # Insert Seed Data
```

`souls db` コマンドを実行して新しいテーブルを追加します。

`souls db create` コマンドの実行

```bash
$ souls db create
Created database 'souls-api-dev'
Created database 'souls-api-test'
```

`souls db migrate` コマンドの実行

```bash
$ souls db migrate
== 20210930154336 CreateUsers: migrating ======================================
-- create_table(:users)
   -> 0.0193s
-- add_index(:users, :uid)
   -> 0.0054s
-- add_index(:users, :screen_name)
   -> 0.0050s
-- add_index(:users, :email, {:unique=>true})
   -> 0.0050s
-- add_index(:users, :username)
   -> 0.0052s
-- add_index(:users, :is_deleted)
   -> 0.0052s
== 20210930154336 CreateUsers: migrated (0.0454s) =============================
```

コマンドのヘルプ詳細を表示することもできます。

```bash
$ souls db help create
Usage:
  souls db create

Options:
  --e, [--env=ENV]  # Difine APP Enviroment - development | production
                    # Default: development

Create Database
```

本番環境での実行は `--e=production` で環境変数を指定します。

```bash
$ souls db create --e=production
$ souls db migrate --e=production
```

## Article Model を作成する

同様に、`Article` Model を作成します。

ここでは `Article` のカテゴリーを動的に管理するために、今回は `ArticleCategory` を `Article` にリレーションを付けて作成してみます。

ブログの記事にコメントも書けるように `Comment` テーブルも追加します。

## Migration を作成する

先程と同様に `souls db create_migration` コマンドで Migration ファイルを作成します。

```bash
$ souls db create_migration article_category
$ souls db create_migration article
$ souls db create_migration comment
```

## Migration ファイルの定義

それぞれ Migration ファイルを定義します。

```ruby:apps/api/db/migrate/20210809135704_create_article_categories.rb
class CreateArticleCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :article_categories do |t|
      t.string :name, null: false
      t.text :tags, array: true, default: []
      t.boolean :is_deleted, null: false, default: false
      t.timestamps
    end
    add_index :article_categories, :name
    add_index :article_categories, :is_deleted
  end
end
```

```ruby:apps/api/db/migrate/20210809135706_create_articles.rb
class CreateArticles < ActiveRecord::Migration[6.1]
  def change
    create_table :articles do |t|
      t.belongs_to :user
      t.string :title, null: false, unique: true
      t.text :body, null: false, default: ""
      t.string :thumnail_url, null: false, default: ""
      t.datetime :public_date, null: false, default: Time.now + 30.days
      t.belongs_to :article_category, null: false
      t.boolean :is_public, default: false, null: false
      t.boolean :just_created, default: true, null: false
      t.string :slug, null: false, unique: true
      t.text :tags, array: true, default: []
      t.boolean :is_deleted, null: false, default: false
      t.timestamps
    end
    add_index :articles, :slug, unique: true
    add_index :articles, :title, unique: true
    add_index :articles, :is_public
    add_index :articles, :is_deleted
  end
end
```

```ruby:apps/api/db/migrate/20210810101552_create_comments.rb
class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.belongs_to :article
      t.string :from, null: false, default: "名無し"
      t.text :body, null: false, default: ""
      t.boolean :is_deleted, null: false, default: false
      t.timestamps
    end
  end
end
```

## souls db コマンドの実行

`souls db migrate` コマンドを実行します。

```bash
$ souls db migrate
```

## Model の定義

Model に `ActiveRecord` のリレーションを定義します。

```ruby:apps/api/models/article_category.rb
class ArticleCategory < ActiveRecord::Base
  has_many :article
end
```

```ruby:apps/api/models/article.rb
class Article < ActiveRecord::Base
  belongs_to :user
  belongs_to :article_category
  has_many :comment
end
```

```ruby:apps/api/models/comment.rb
class Comment < ActiveRecord::Base
  belongs_to :article, dependent: :destroy
end
```

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
