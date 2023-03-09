---
id: add-mailer
title: Add Mailer
description: This section describes how to use Mailer for SOULs Workers.
---

This section describes how to use Mailer for SOULs Workers.

## Add Mailer

`souls create worker ${name}` command

Add a Mailer Worker.

```bash
$ souls create worker mailer
```

`worker-mailer` has been added to `apps` as shown below.

`worker-mailer.yml` `.github/workflow` , deployment will be done automatically for each commit as before.

```
souls-app（Mother Dir）
├── apps
│   ├── api（API Dir）
│   ├── worker-mailer（Worker Dir）
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── worker-mailer.yml
  .
  .
```

`config.workers` in `config/souls.rb`

`mailer` has been added.

Similarly, the API directory `config/souls.rb` has been updated.

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

Go to localhost: 3000

[http://localhost:3000](http://localhost:3000)

If you see a screen like the one below, you're successful!

![SOULs Running](/imgs/docs/local-3000.png)

## Add Mutation

Define Mailer in `mutations` `graphql` directory of SOULs Worker.

```bash
app（Workerルートディレクトリ）
├── apps
│   ├── engines
│   ├── graphql
│   │     ├── mutations
│   │     │       ├── base_mutation.rb
│   │     ├── types
│   │     │       ├── base
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

## souls g job ${job_name} --mailer command execution

Create a job to notify you by email when new comments are added to your blog.

`souls g job ${job_name} --mailer` command creates a `Mutation` `Mailgun` by default.

```bash
$ cd apps/worker-mailer
$ souls g job new_comment_mailer --mailer
Created file! : ./app/graphql/mutations/new_comment_mailer.rb
🎉  Done!
```

Mailer Mutation has been created.

The SOULs Worker Mailer uses Mailgun by default.

Please refer to the link below for Mailgun.

[Mailgun document](https://documentation.mailgun.com/en/latest/)

[Gem: mailgun-ruby](https://github.com/mailgun/mailgun-ruby)

## Using Mailgun

The mailgun settings are stored in the environment variables `YOUR-API-KEY` and `YOUR-MAILGUN-DOMAIN`.
You can set these using `souls gh add_env`.

```bash
$ souls gh add_env
Set Key: MAILGUN_KEY
Set Value: xxxxxxxxxxx
Updated file! : .env.production
Updated file! : .env
Updated file! : apps/worker-mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/worker-mailer.yml
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
Updated file! : apps/worker-mailer/.env
Updated file! : .github/workflows/api.yml
Updated file! : .github/workflows/worker-mailer.yml
✓ Set secret MAILGUN_DOMAIN for elsoul/souls-rubyworld
・
・
```

The NewCommendMailer will now look as follows:

```ruby:apps/worker-mailer/app/grahpql/mutations/new_comment_mailer.rb
module Mutations
  class NewCommentMailer < BaseMutation
    description "Mail を送信します。"
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
      mg_client.send_message("YOUR-MAILGUN-DOMAIN", message_params)
      { response: "Job done!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
```

## Run test with souls s

Start Worker and check the operation of Mailer.

Similar to the SOULs API, you can start a Worker with the `souls s`

```bash
$ souls s
```

Well then

[localhostl:3000/playground](localhost:3000/playground)

To access

Make sure GraphQL PlayGround is running.

Then send the following Query.

Query

```ruby
mutation {
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

Mailer has been successfully added.
