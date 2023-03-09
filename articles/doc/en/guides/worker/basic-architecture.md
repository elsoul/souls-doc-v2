---
id: basic-architecture
title: Basic architecture
description: This section describes the basic architecture of the SOULs serverless Ruby GraphQL Worker framework.
---

This section describes the basic architecture of the SOULs serverless Ruby GraphQL Worker framework.

## Worker role

SOULs uses GraphQL Ruby.

Reference Gem: [graphql-ruby](https://graphql-ruby.org/)

In this SOULs Worker Guide, we will explain the workers in the red frame in the figure below.

![SOULs Worker Architecture](/imgs/docs/SOULs-architecture-worker.jpg)

As you proceed with development, task processing that you want to run separately from the API server will come out.

Let's separate when the task processing increases. If you start developing on one server thinking that, the cost for separating it later may increase enormously.

In the SOULs framework, data processing is left to the API, and other task processing is placed in the Worker.

## Mother and service

As explained in the SOULs API

SOULs have one mother and multiple services.

Services are divided into two categories: APIs and Workers.

The SOULs framework allows you to deploy multiple workers on separate Google Cloud Runs and build a distributed system that scales on a worker-by-worker basis.

In the SOULs framework, [Monorepo](https://en.wikipedia.org/wiki/Monorepo) manages applications in one package.

`souls-app` mother directory

```
souls-app（Mother dir）
├── apps
│   ├── api（Service dir）
│   ├── worker1（Service dir）
│   ├── worker2（Service dir）
│
├── config
│     ├── souls.rb（souls config）
├── github
  .
  .
```

## SOULs Worker directory structure

The directory structure of SOULs Worker is as follows.

`souls-app/apps/worker` directory

```
souls-app
├── apps
│   ├── worker
│        ├── app
│        │    ├── models
│        │    ├── utils
│        │    ├── graphql
│        │          ├── queries
│        │          │     ├── mailers
│        │          │
│        │          ├── types
│        │          │     ├── base
│        │          │
│        │          ├── s_o_u_ls_api_schema.rb
│        ├── config
│        │      ├── database.yml
│        │      ├── souls.rb
│        │
│        ├── constants
│        ├── db
│        ├── log
│        ├── spec
│        │    ├── factory
│        │    ├── models
│        │    ├── spec_helper.rb
│        │
│        ├── tmp
│        ├── app.rb
│        ├── Dockerfile
│        ├── Gemfile
│        ├── Gemfile.lock
│        ├── Procfile
```

There are two folders and one file in `souls-app/apps/api/app/graphql/`

`queries` , `types` , and `s_o_u_ls_api_schema.rb`

These files work with GraphQL, but Workers perform tasks in queries.

Unlike the API, it doesn't display any data, so you don't need a Query or Resolver.

SOULs Workers only make changes to `query`

\* When `db` , `spec` , `models` etc., be sure to make changes in the API directory.

## Preparing a worker

Immediately after being created with `souls new` `apps` only has an API, so

Add the Worker to the repository using the `souls create worker`

```
souls-app（mother dir）
├── apps
│   ├── api（Service dir）
│
├── config
├── github
  .
  .
```

```bash
$ souls create worker mailer
```

`mailer` has been added to `apps` as shown below.

`mailer.yml` `.github/workflow` , deployment will be done automatically for each commit to Mailer as before.

```
souls-app（mother dir）
├── apps
│   ├── api（Service dir）
│   ├── mailer（Service dir）
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── mailer.yml
  .
  .
```

`config.workers` in `config/souls.rb`

`mailer` has been added.

`config/souls.rb`

```ruby
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "mother"
  config.fixed_gems = ["excluded_gem"]
  config.workers = [
    {
      name: "mailer",
      endpoint: "",
      port: 3000
    }
  ]
end
```

Similarly, the API directory `config/souls.rb` has been updated.

```ruby
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "api"
  config.fixed_gems = ["excluded_gem"]
  config.workers = [
    {
      name: "mailer",
      endpoint: "",
      port: 3000
    }
  ]
end
```

`endpoint` is still `""` here, but you can get the URL after deploying.

## Synchronize API and Worker Model information

`souls sync models` command,

Synchronize files related to Model from API.

```bash
$ cd apps/worker-mailer
$ souls sync models
```

## Start local server

It can be started with the `souls s` command as well as the local server startup API.

```bash
$ cd apps/worker-mailer
$ souls s
```

`localhost:3000`

[http://localhost:3000](http://localhost:3000)

If you see a screen like the one below, you're successful!

![SOULs Running](/imgs/docs/local-3000.png)

## Launch console

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

## Add a second Worker

SOULs Worker makes it easy to add multiple Workers.

Let's add a worker called `scraper` like `mailer` created earlier.

```bash
$ souls create worker --name=scraper
```

`scraper` has been added to `apps` as shown below.

`scraper.yml` `.github/workflow` , the deployment work is the same as before.

```
souls-app（mother dir）
├── apps
│   ├── api
│   ├── mailer
│   ├── scraper
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── mailer.yml
│          ├── scraper.yml
  .
  .
```

`config.workers` in `config/souls.rb`

`scraper` has been added.

Similarly, the API directory `config/souls.rb` has been updated.

In this way, you can add multiple independent workers.

SOULs Worker Port

[http://localhost:3000/playground](http://localhost:3000/playground)

If you have more than one worker

`PORT` is

3001, 3002, 3003 ...

It will increase in order from the 3000 series.

All of these associations are automated by SOULs.

## Deploy

All you have to do is push to GitHub as before.

```bash
$ git add .
$ git commit -m "add mailer scraper"
$ git push origin main
```

It takes about 5 minutes to deploy.

## Run souls sync conf

After the deployment is complete, you can automatically update the settings `config/souls.rb`

```bash
$ souls sync conf
```

The mother and API `config/souls.rb` have been updated.

Now you're ready to connect Worker with Pub / Sub messaging.

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
