---
id: create-ruby-cloud-functions
title: Create Cloud Functions for Ruby runtime
description: This section describes how to create Cloud Functions for the Ruby runtime.
---

:::div{.info}
This section describes how to create Cloud Functions for the Ruby runtime. The SOULs Cloud Functions Ruby runtime defaults to Sinatra routing on endpoints.
:::

The SOULs Cloud Functions Ruby runtime defaults to Sinatra routing on endpoints.

[Sinatra](https://github.com/sinatra/sinatra)

## SOULs Create Ruby Runtime Cloud Functions

Create `functions` using the `souls create functions` command.

```sh
$ souls create functions method1
✓ Created file ./apps/cf_ruby27_method1/app.rb
✓ Created file ./apps/cf_ruby27_method1/Gemfile
✓ Created file ./apps/cf_ruby27_method1/.env.yaml
```

## SOULs Ruby Runtime Cloud Functions Directory Structure

```
apps
├── cf_ruby27_method1
│   ├── app.rb
│   ├── Gemfile
│   ├── .env.yaml
```

Define the main function in `app.rb`

Here, `Sinatra` 's routing is specified by the endpoint, so

You can have multiple endpoints.

app.rb

```ruby:app.rb
require "functions_framework"
require "sinatra/base"
require "dotenv/load"

class App < Sinatra::Base
  get "/souls-functions-get/:name" do
    "SOULs Functions Job Done! - #{params['name']}"
  end

  post "/souls-functions-post" do
    params = JSON.parse(request.body.read)
    "SOULs Functions Job Done! - #{params['name']}"
  end
end

FunctionsFramework.http("souls_functions") do |request|
  App.call(request.env)
end
```

## Run SOULs Functions locally

```sh
$ bundle install
$ souls functions dev
I, [2021-12-30T21:49:48.089478 #7135]  INFO -- : FunctionsFramework v0.11.0
I, [2021-12-30T21:49:48.089532 #7135]  INFO -- : FunctionsFramework: Loading functions from "./app.rb"...
I, [2021-12-30T21:49:48.218867 #7135]  INFO -- : FunctionsFramework: Looking for function name "souls_functions"...
I, [2021-12-30T21:49:48.218926 #7135]  INFO -- : FunctionsFramework: Starting server...
I, [2021-12-30T21:49:48.230537 #7135]  INFO -- : FunctionsFramework: Serving function "souls_functions" on port 8080...
```

Now access the link below and try calling `GET` Functions.

[http://localhost:8080/souls-functions-get/hello-world](http://localhost:8080/souls-functions-get/hello-world)

```
SOULs Functions Job Done! - hello-world
```

If the response is returned, it is successful.

## Deploy SOULs Ruby runtime Cloud Functions

Deploy using the SOULs functions command.

```sh
$ cd apps/cf_ruby27_method1
$ souls functions deploy
```

## Check the URL of SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions url
```

## Check the URLs of all SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions all_url
```
