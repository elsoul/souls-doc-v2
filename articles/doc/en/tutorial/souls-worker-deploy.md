---
id: souls-worker-deploy
title: Deploy SOULs Worker
description: This turial describes how to send an email using a SOULs Worker.
---

:::div{.info}
This tutorial describes how to send an email using SOULs Worker.
:::

![create-worker](/imgs/gifs/create-worker.gif)

There are two types of SOULs backends: API and Worker. The API hands data storage and retrieval, and workers process data through tasks.

![SOULs Worker Architecture](/imgs/docs/SOULs-architecture-worker.jpg)

Let's create a SOULs Worker `Mailer`, isolate it as a task server, and deploy it.

The API and Worker are each deployed using Google Cloud Run.

## Addition of SOULs Worker

A SOULs Worker can be created with the following command.

```bash
$ souls create worker ${worker_name}
```

Here, add a worker called `worker-mailer`

```bash
$ souls create worker mailer
```

In the SOULs framework, each service is placed in `apps`

The `souls new` command creates the mother and API directories. Workers have been added by the `souls create worker` command.

## Multiple SOULs Worker

There is only one SOULs API, but you can create multiple Workers. I want to process mail and task processing such as scraper to acquire data on another server. Such a scene often occurs in the actual field.

```
souls-app（Mother Dir）
├── apps
│   ├── api（API Dir）
│   ├── worker-mailer（Worker Dir)
│   ├── worker-scraper（Worker Dir)
│   ├── worker-batch（Worker Dir)
|   .
|   .
│
├── config
├── .github
  .
  .
```

## Run souls sync models

This time we will use a common database for the API and Worker. From the worker directory, use the SOULs command to create a Model-related file from the API.

```bash
$ cd apps/worker-mailer
$ souls sync models
🎉  Synced!
```

The following three directories have been created from the API directory.

`app/models` `db` `spec/factories`

## Add Mailer

Define the job in `queries` `graphql` directory of SOULs Worker. This time it's a mailer task, so let's create a Mailer using the `--mailer` `souls g job`

### souls g job ${job_name} --mailer command execution

Create a job to notify you by email when new comments are added to your blog.

`souls g job ${job_name} --mailer` command creates a Query for Mailgun by default.

```bash
$ souls g job new_comment_mailer --mailer
Created file! : ./app/graphql/types/new_comment_mailer_type.rb
Created file! : ./app/graphql/queries/new_comment_mailer.rb
Created file! : ./spec/queries/jobs//new_comment_mailer_spec.rb
🎉  Done!
```

Mailer query has been created.

```
app（Worker Root Dir）
├── apps
│   ├── engines
│   ├── graphql
│   │     ├── queries
│   │     │       ├── base_query.rb
│   │     │       ├── new_comment_mailer.rb
│   │     ├── types
│   │     │       ├── base
│   │     │       ├── workers
│   │     │       ├── s_o_u_ls_api_schema.rb
│   │
│   ├── models
│   ├── utils
│
├── config
├── log
├── spec
├── tmp
.
```

The SOULs Worker Mailer uses Mailgun by default.

Please refer to the link below for Mailgun.

[Mailgun document](https://documentation.mailgun.com/en/latest/)

[Gem: mailgun-ruby](https://github.com/mailgun/mailgun-ruby)

### Using MailGun

The SOULs command creates the file `new_comment_mailer.rb`.

Add the `MAILGUN_KEY` and `MAILGUN_DOMAIN` to your environment, using the `souls gh add_env` command.

```bash
$ souls gh add_env
Set Key: MAILGUN_KEY
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/mailer.yml
✓ Set secret MAILGUN_KEY for elsoul/souls-rubyworld
・
・
```

```bash
$ souls gh add_env
Set Key: MAILGUN_DOMAIN
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/mailer.yml
✓ Set secret MAILGUN_DOMAIN for elsoul/souls-rubyworld
・
・
```

```ruby:apps/worker/app/grahpql/queries/new_comment_mailer.rb
module Queries
  class NewCommentMailer < BaseQuery
    description "Send Mail"
    field :response, String, null: false

    def resolve
      # First, instantiate the Mailgun Client with your API key
      mg_client = ::Mailgun::Client.new(ENV['MAILGUN_KEY'])

      # Define your message parameters
      message_params = {
        from: "postmaster@from.mail.com",
        to: "sending@to.mail.com",
        subject: "SOULs Mailer test!",
        text: "It is really easy to send a message!"
      }

      # Send your message through the client
      mg_client.send_message(ENV['MAILGUN_DOMAIN'], message_params)
      { response: "Job done!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
```

### Run test with souls s

Start the Worker and check the operation of Mailer.

Similar to the SOULs API, you can start a Worker with the `souls s` from its corresponding directory.

```bash
$ souls s
```

Make sure GraphQL PlayGround is running, then access the Playground:
[localhostl:3000/playground](localhost:3000/playground)

Then send the following query:

Query

```ruby
query {
  newCommentMailer(input: {}) {
    response
  }
}
```

If successful, the following response will be returned.

```json
{
  "data": {
    "newCommentMailer": {
      "response": "Job done!"
    }
  }
}
```

## Add mail execution trigger

Now, from the SOULs API, define Mailer to start when a new comment is added to a blog article.

Call the Worker query using the `grahpql_query` method defined in `apps/api/app/graphql/queries/base_query.rb`

```diff:apps/api/app/graphql/queries/base/comment/create_comment.rb
module queries
  module Base::Comment
    class CreateComment < BaseQuery
      field :comment_edge, Types::CommentType.edge_type, null: false
      field :error, String, null: true

      argument :article_id, String, required: false
      argument :body, String, required: false
      argument :from, String, required: false
      argument :is_deleted, Boolean, required: false

      def resolve(args)
        _, args[:article_id] = SOULsApiSchema.from_global_id(args[:article_id])
        data = ::Comment.new(args)
        raise(StandardError, data.errors.full_messages) unless data.save

+       souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer")

        { comment_edge: { node: data } }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e)
      end
    end
  end
end
```

## Attach a Comment to an Article

In `apps/api/app/graphql/types/article_type.rb`, in the comments field:

```diff
+ field :comments, [Types::CommentType], null: true
```

Add the comments method

```diff
+ def comments
+   AssociationLoader.for(Article, :comment).load(object)
+ end
```

```ruby:apps/api/app/graphql/types/article_type.rb
module Types
  class ArticleType < BaseObject
    implements GraphQL::Types::Relay::Node
    global_id_field :id
    field :article_category, Types::ArticleCategoryType, null: false
    field :body, String, null: true
    field :comments, [Types::CommentType], null: true
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

    def comments
      AssociationLoader.for(Article, :comment).load(object)
    end
  end
end
```

## Launch API and Worker all at the same time

The SOULs `souls s --all` command launches the worker and the API from the root directory.

```bash
$ souls s --all
```

The API and Worker have been launched.

SOULs API

[http://localhost:4000/playground](http://localhost:4000/playground)

SOULs Worker

[http://localhost:3000/playground](http://localhost:3000/playground)

If you have more than one worker, the port increases incrementally: 3001, 3002, 3003 ...

These associations are fully automated by SOULs.

Try sending the following query to GraphQL in the SOULs API.

```ruby
query {
  createComment(
    input: { articleId: "QXJ0aWNsZTox" from: "Blog Title" body: "Comment" }
  ) {
    commentEdge {
      node {
        id
        article {
          title
        }
        body
      }
    }
  }
}
```

If successful, the following response will be returned.

```json
{
  "data": {
    "createComment": {
      "commentEdge": {
        "node": {
          "id": "Q29tbWVudDozMDE=",
          "article": { "title": "Blog Title" },
          "body": "Comment"
        }
      }
    }
  }
}
```

Then check the output of the console.

```bash
11:03:45 api.1    | 11:03:45 web.1   | D, [2021-08-15T11:03:45.999251 6609] DEBUG -- :   TRANSACTION (0.5ms)  BEGIN
11:03:46 api.1    | 11:03:46 web.1   | D, [2021-08-15T11:03:46.000219 6609] DEBUG -- :   Comment Create (0.7ms)  INSERT INTO "comments" ("article_id", "body", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id"  [["article_id", 99], ["body", "Comment"], ["created_at", "2021-08-15 11:03:45.994381"], ["updated_at", "2021-08-15 11:03:45.994381"]]
11:03:46 api.1    | 11:03:46 web.1   | D, [2021-08-15T11:03:46.005501 6609] DEBUG -- :   TRANSACTION (4.4ms)  COMMIT
11:03:46 api.1    | 11:03:46 web.1   | "{\"data\":{\"newCommentMailer\":{\"response\":\"Job done!\"}}}"
```

The comment was successfully entered, and the Worker returned a response saying `Job done!`

Also ensure that the email was sent through Mailgun.

## Receive arguments with query

In its current state, it's not clear which blog the comment was posted on.

The `NewCommentMailer` query takes an argument, adds blog information and sends an email.

Edit the worker's `new_comment_mailer.rb`

```diff:apps/worker/app/graphql/queries/mailers/new_comment_mailer.rb
module queries
  module Mailers
    class NewCommentMailer < BaseQuery
      description "Send Mail"
      field :response, String, null: false

+     argument :article_id, Integer, required: true

      def resolve(args)
+       article = ::Article.find(args[:article_id])

        # First, instantiate the Mailgun Client with your API key
        mg_client = ::Mailgun::Client.new(ENV['MAILGUN_KEY'])

        # Define your message parameters
        message_params = {
          from: "postmaster@from.mail.com",
          to: "sending@to.mail.com",
          subject: "SOULs Mailer test!",
+         text: "Article ID:#{article.id}\n Title：#{article.title} \nNew Comment!"
        }

        # Send your message through the client
        mg_client.send_message(ENV["YOUR-MAILGUN-DOMAIN"], message_params)
        { response: "Job done!" }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
```

You can also send options as hashes to SOULs jobs.

```diff:apps/api/app/graphql/mutations/base/comment/create_comment.rb
- souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer")
+ souls_worker_trigger(worker_name: "worker-mailer", query_file_name: "new_comment_mailer", args: { article_id: article_id.to_i })
```

Let's go back to the mother directory, and run the server again.

```bash
$ souls s --all
```

SOULs API

[http://localhost:4000/playground](http://localhost:4000/playground)

Try sending the following query to GraphQL in the SOULs API.

```ruby
query {
  createComment(
    input: { articleId: "QXJ0aWNsZTox" from: "名無し" body: "コメント" }
  ) {
    commentEdge {
      node {
        id
        article {
          title
        }
        body
      }
    }
  }
}
```

When the success response is confirmed

![Mail test](/imgs/docs/mail-test.png)

## Worker deployment

The Worker can be deployed in a similar way to the API.

Just push to `master` branch on GitHub and you're done.

`api.yml` and `worker-mailer.yml` are contained in their respective directories `apps/api` and `apps/worker`.

They will be deployed automatically when the `master` branch changes, allowing developers to focus on business logic.

Now let's go back to the mother directory and deploy.

:::div{.warning}
From here on, if the deployment is successful, Google Cloud credit will start to be used. To claim a free $200 of credit to use with your project, click the link below.

[Google Cloud Credit](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)

In the production environment of SOULs framework, it is set to use `Google Cloud Pub/Sub`. If you are using it in a production environment, please refer to [Pub / Sub messaging.](/docs/guides/api/add-pubsub-messaging/)

Also, to use Mail Gun in a production environment, you need to add the IP of the [outgoing static IP address configured by Cloud NAT to the White list of Mail gun.](/docs/guides/worker/add-cloud-nat/)

\* You can continue this tutorial without deploying. Skip to the [SOULs guide.](/docs/guides/api/basic-architecture/)
:::

```bash
$ git add .
$ git commit -m "add new_comment mailer"
$ git push origin main
```

It takes about 5 minutes to deploy.

## Sync tasks and Pub / Sub messaging

The SOULs framework's task processing uses Pub / Sub messaging in production to put tasks into queues.

As a result, workers can recover in the event that a network malfunction occurs before the task is completed.

** When, where, which task processing ended, did not finish **

:::div{.warning}
Since the Cloud Run URL is issued after the first deployment, PubSub Sync will be executed from the second and subsequent deployments.
:::

No settings are required to allow Worker tasks to be called in Pub / Sub messaging.

This workflow performs the following actions

- Check `query` files in all workers
- Get a list of topics and subscriptions on Google Cloud PubSub in the same project
- Find the PubSub topic for the `query` file in the worker and create it if it doesn't
- Delete the PubSub topic if the file for the PubSub topic is not in the `query`

These operations are performed automatically.

![pubsub](/imgs/docs/pubsub-workflow.png)

PubSub's automatic topic name is

`souls-${worker_name}-${query_file_name}`

For example, in the case of the Mailer Worker `new_comment_mailer.rb`

it will be:

`souls-worker-mailer-new-comment-mailer`

Log in to [Google Cloud Console and](https://console.cloud.google.com/cloudpubsub/topic/list)

We can check that the Pub / Sub Topic and Pub / Sub Subscription have been created on GCP.
