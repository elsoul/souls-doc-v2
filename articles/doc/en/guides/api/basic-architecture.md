---
id: basic-architecture
title: Basic architecture
description: This section describes the basic architecture of the SOULs serverless Ruby GraphQL API framework.
---

This section describes the basic architecture of the SOULs serverless Ruby GraphQL API framework.

### CRUD file structure in SOULs API

SOULs uses GraphQL Ruby.

Reference Gem: [graphql-ruby](https://graphql-ruby.org/)

In this souls guide, we will explain the API in the red frame in the figure below.

![SOULs API Architecture](/imgs/docs/SOULs-architecture-api.jpg)

As you progress, you'll end up writing a lot of code for a lot of CRUD.

> CRUD is an acronym for Create, Read, Update, and Delete, which are the four basic functions required of software that handles persistent data. ..

There are two CRUD removals mentioned above in the SOULs framework.

The first is logical deletion. It only sets the delete flag, it does not actually delete it. The SOULs framework defines the `is_deleted` flag on all tables by default.

The second is physical deletion. Deletes data from the database with the SQL DELETE syntax.

In operating the application, deletion by user's operation occurs frequently.

Create a logical deletion area in advance when sending a deletion transmission from the user client to prevent unintentional data loss.

Below is the layout of the files related to CRUD when the `User`

| motion            | GraphQL  | file name                                                              |
| ----------------- | -------- | ---------------------------------------------------------------------- |
| Read (singular)   | Query    | apps / api / app / graphql / queries / user.rb                         |
| Read (multiple)   | Query    | apps / api / app / graphql / queries / users.rb                        |
| Read (condition)  | Query    | apps / api / app / graphql / resolvers / user_search.rb                |
| register          | Mutation | apps / api / app / graphql / mutations / base / create_user.rb         |
| update            | Mutation | apps / api / app / graphql / mutations / base / update_user.rb         |
| Logical deletion  | Mutation | apps / api / app / graphql / mutations / base / delete_user.rb         |
| Physical deletion | Mutation | apps / api / app / graphql / mutations / base / destroy_delete_user.rb |

Data registration, update, logical deletion, and physical deletion are defined in `mutation/base`

Once you have determined the database schema and `souls g scaffold` command, it will automatically generate the following files needed to implement GraphQL:

| role        | File type      | File Path                                                           |
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


### SOULs API directory structure

The directory structure of SOULs API is as follows.

`souls-app/apps/api` directory

```
souls-app
├── apps
│   ├── api
│        ├── app
│        │    ├── models
│        │    ├── utils
│        │    ├── graphql
│        │          ├── mutations
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

There are 4 folders and 1 file in `souls-app/apps/api/app/graphql/`

`mutations` , `queries` , `resolvers` , `types` , and `s_o_u_ls_api_schema.rb`

These files are working with GraphQL.

### Database settings

ORM uses ActiveRecord, so if you've used Rails before, you can continue to use it as usual.

[Link to Active Record](https://guides.rubyonrails.org/active_record_basics.html)

### Start Docker container

The SOULs framework uses PostgreSQL, a Docker container, for the development and test environments by default.

Start PostgreSQL container

```bash
$ souls docker psql
```

MySQL users can also use it by modifying `config/database.yml` and `Gemfile`

MySQL container launch

```bash
$ souls docker mysql
```

### Model and Migration

Database files are defined in the `souls-app/apps/api/models` and `souls-app/apps/api/db`

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

Let's take a look at the Migration file that creates the user table.

```ruby:apps/api/db/migrate/20200006095538_create_users.rb
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

Define the type in the Migration file and run Migration.

### Run Migration

In the SOULs framework, you can operate the database with the following commands.

Create database

```bash
$ souls db create
```

Run Migration

```bash
$ souls db migrate
```

Create seed data

```bash
$ souls db seed
```

Reset Database

```bash
$ souls db migrate_reset
```

Reset Database and Create seed data

```bash
$ souls db reset
```

When executing in a production environment, specify the `--e=production`

Database operations in a production environment

Creating a database

```bash
$ souls db create --e=production
```

Run Migration

```bash
$ souls db migrate --e=production
```

Create seed data

```bash
$ souls db seed --e=production
```

Note that these commands allow you to interact directly with the production environment.

### Start local server

Start local server

```bash
$ souls s
```

Go to localhost: 4000

[http://localhost:4000](http://localhost:4000)

If you see a screen like the one below, you're successful!

![SOULs Running](/imgs/docs/localhost.png)

### Launch console

The SOULs framework allows you to use irb in the same environment as your app with the `souls c`

```bash
$ souls c
irb(main):001:0>
```

Production environment

```bash
$ souls c --e=production
irb(main):001:0>
```

## Deploy

Before deploying, let's test again to make sure the app is working properly.

```bash
$ souls test
```

Make sure that all examples are green and have 0 failures. Now, if the test fails, it will also fail during deployment, so make sure the test is clear.

![SOULs test](/imgs/docs/souls-t.png)

Now let's rename and deploy the `github` directory in the mother directory.

From here on, if the deployment is successful, Google Cloud credits will start to be used.

```bash
$ cd ...
$ mv github .github
$ git add .
$ git commit -m 'first deploy'
$ git push origin main
```

Check the delivery status by pressing the Actions tab on the GitHub page.

![GitHub Actions](/imgs/docs/github-actions.png)

If build is displayed in green, the deployment is complete.

Let's access the Google Cloud Run endpoint.

![Deployment succeeded](/imgs/docs/success.png)

The deployment is completed successfully.
