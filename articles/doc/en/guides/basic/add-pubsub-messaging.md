---
id: add-pubsub-messaging
title: Pub / Sub messaging
description: This section describes how to queue SOULs Workers using Google Cloud Pub / Sub.
---

This section describes how to queue SOULs Workers using Google Cloud Pub / Sub.

The SOULs Framework automatically creates Topic and subscriptions for the tasks contained in all Workers.

This chapter [assumes that you have prepared SOULs Workers](/docs/tutorial/souls-worker-deploy/) and that you have a Worker deployed.

## Sync tasks and Pub / Sub messaging

The SOULs Framework's task processing uses Pub / Sub messaging in production to put tasks into queues.

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

## Implement a queue in Mutation

Here, [I prepared the](/docs/tutorial/souls-worker-deploy/) tutorial Worker.

Edit the Mutation in `create_comment.rb`

### Call souls_make_graphql_query

```diff:apps/apis/graphql/mutations/base/comments/create_comment.rb
module Mutations
  module Base::Comment
    class CreateComment < BaseMutation
      field :comment_edge, Types::CommentType.edge_type, null: false
      field :error, String, null: true

      argument :article_id, String, required: false
      argument :body, String, required: false
      argument :from, String, required: false
      argument :is_deleted, Boolean, required: false

      def resolve(args)
        _, article_id = SOULsApiSchema.from_global_id(args[:article_id])
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

`ENV["RACK_ENV"]` is `production` , Google Cloud Pub / Sub queue is put, and when it is `development` `souls_post_to_dev` method is executed from API to Worker.

## Check communication between API and Worker locally

`souls s --all` command to launch the API and Worker at the same time.

```bash
$ souls s --all
```

Let's add a comment from the API `create_comment`

[localhost: 4000 / playground](localhost:4000/playground)

Sample query

```ruby
mutation {
  createComment(input: {
    articleId: "QXJ0aWNsZTox"
    from: "名無し"
    body: "コメント"
  }) {
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

If successful, the following response will be returned

```json
{
  "data": {
    "createComment": {
      "commentEdge": {
        "node": {
          "id": "Q29tbWVudDoxNTg=",
          "article": { "title": "ブログタイトル" },
          "body": "コメント"
        }
      }
    }
  }
}
```

![Mail test](/imgs/docs/mail-test.png)

The email was sent successfully.

## Deploy

Now deploy to production and

Using Pub / Sub messaging

Let's move the Worker.

Commit your changes to GitHub in your mother directory.

```bash
$ git add . $ git commit -m "add pub/sub messaging to new_comment_mailer" $ git push origin main
```

## Put PubSub queues in production

:::div{.warning}
The steps from here onwards use `Worker` and `Mutation` created by [adding Mailer](/docs/guides/worker/add-mailer/) and [Scraper in the SOULs Worker Basic Guide.](/docs/guides/worker/add-scraper/)

We recommend that you read the [SOULs Worker Basic Guide](/docs/guides/worker/basic-architecture/) first.
:::

## Check Mailer PubSub messaging

Here we use Postman as a tool to send POST.

- [Postman](https://www.postman.com/)

Sample query

```ruby
mutation {
  createComment(input: {
    articleId: "QXJ0aWNsZTox"
    from: "名無し"
    body: "コメント"
  }) {
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

![GraphQL Response](/imgs/docs/postman.png)

Log in to [Google Cloud Console and](https://console.cloud.google.com/cloudpubsub/topic/list)

Let's make sure Pub / Sub Topic and Pub / Sub Subscription are running.

![Google Cloud console PubSub](/imgs/docs/pubsub-console.png)

You can see that the message request is queued in the published number graph.

And if you receive an email, you are successful.

If you do not receive the email,

Carefully check [the outgoing static IP address settings.](/docs/guides/worker/add-cloud-nat/)

## Check Scraper PubSub Messaging

Add a Mutation to the API to queue the SeinoScraper created in [Add Scraper.](/docs/guides/worker/add-scraper/)

In SOULs API, files related to CRUD are

`app/graphql/mutations/base`

Was defined within.

If you want to queue a task like this one, create a Manager in the same way.

### Creating a Manager

```bash
$ souls g manager task --mutation=seino_scraper
Created file! : ./app/graphql/mutations/managers/task_manager/seino_scraper.rb
🎉  Done!
```

### Editing Mutation

In the argument,

Source zip code, destination zip code, year of arrival, month of arrival, date of arrival

And publish a PubSub message.

```ruby:app/graphql/mutations/managers/task_manager/seino_scraper.rb
module Mutations
  module Managers::TaskManager
    class SeinoScraper < BaseMutation
      description "seino_scraper description"

      field :response, String, null: false

      argument :day, Integer, required: true
      argument :from_zipcode, String, required: true
      argument :month, Integer, required: true
      argument :to_zipcode, String, required: true
      argument :year, Integer, required: true

      def resolve(args)
        payload = {
          from_zipcode: args[:from_zipcode],
          to_zipcode: args[:to_zipcode],
          year: args[:year],
          month: args[:month],
          day: args[:day]
        }

        souls_worker_trigger(worker_name: "worker-scraper", query_file_name: "seino_scraper", args: payload)
        { response: "queued!" }
      rescue StandardError => e
        GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
```

### Deploy

Now let's go back to the mother directory and deploy.

```bash
$ cd ...
$ git add .
$ git commit -m "add task_manager/seino_scraper"
$ git push origin main
```

### Run Postman

Like Mailer, Postman sends a request.

Sample query

```ruby
mutation {
  seinoScraper(input: {
    fromZipcode: "1460082"
    toZipcode: "2310847"
    year: 2021
    month: 1
    day: 20
  }) {
    response
  }
}
```

If successful, the following response will be returned.

![GraphQL Response](/imgs/docs/postman-scraper.png)

and

![Slack message](/imgs/docs/seino-slack.png)

You've successfully notified Slack.
