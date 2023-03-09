---
id: add-scraper
title: Add Scraper
description: This section describes how to add a second Worker, Scraper.
---

This section describes how to add a second Worker, Scraper.

## Add Scraper

`souls create worker ${name}` command to add a second worker.

```bash
$ souls create worker scraper
```

`worker-scraper` has been added to `apps` as shown below.

`worker-scraper.yml` `.github/workflow` , the deployment work is the same as before.

```
souls-app（Mother directory）
├── apps
│   ├── api
│   ├── worker-mailer
│   ├── worker-scraper
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── worker-mailer.yml
│          ├── worker-scraper.yml
  .
  .
```

`config.workers` in `config/souls.rb`

`scraper` has been added.

```ruby:config/souls.rb
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "mother"
  config.fixed_gems = ["excluded_gem"]
  config.workers = [
    {
      name: "worker-mailer",
      port: 3000
    },
    {
      name: "worker-scraper",
      port: 3001
    }
  ]
end
```

Similarly, the API directory `config/souls.rb` has been updated.

```ruby:apps/api/config/souls.rb
SOULs.configure do |config|
  config.app = "souls-app"
  config.project_id = "souls-app"
  config.region = "asia-northeast1"
  config.endpoint = "/endpoint"
  config.strain = "api"
  config.fixed_gems = ["excluded_gem"]
  config.workers = [
    {
      name: "worker-mailer",
      port: 3000
    },
    {
      name: "worker-scraper",
      port: 3001
    }
  ]
end
```

In this way, you can add multiple independent workers.

## Add Query

Define the job in `queries` `graphql` directory of SOULs Worker.

```bash
app（Workerルートディレクトリ）
├── apps
│   ├── engines
│   ├── graphql
│   │     ├── queries
│   │     │       ├── base_query.rb
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

Add Queries

```bash
$ souls g job $class_name
```

```bash
$ souls g job seino_scraper
Created file! : ./app/graphql/queries/seino_scraper.rb
🎉  Done!
```

The following files are automatically generated.

```ruby:apps/worker/app/graphql/queries/seino_scraper.rb
module Queries
  class SeinoScraper < BaseQuery
    description "Job Description"
    field :response, String, null: false

    def resolve
      # Define Job Here

      { response: "Job queued!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
```

## Add scraping code

Here as a sample

[From the search for the number of days required by Seino Transportation](https://track.seino.co.jp/lts/leadTimeSearch.do) ,

![Seino search](/imgs/docs/seino-search.png)

** Get the number of days to ship to deliver by the specified date and notify Slack. **

Create `Query` for task processing called.

For getting the Slack webhook URL

[Using Incoming Webhooks in Slack](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8)

Please refer to.

Also, regarding the setting of the `SLACK`

Please refer to [the registration of Github secret key](/docs/tutorial/souls-api-deploy/#github-%E3%82%B7%E3%83%BC%E3%82%AF%E3%83%AC%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC%E3%81%AE%E7%99%BB%E9%8C%B2) from zero to deployment.

If you haven't prepared WebDriver yet

[Installing WebDriver](/docs/dependencies/webdriver/)

Please finish first.

Now let's add the scraping code inside `resolve`

This time, at Seino Transportation, I will write a scraping code to check the delivery date of the package.

```ruby:apps/worker/app/graphql/queries/seino_scraper.rb
module Queries
  class SeinoScraper < BaseQuery
    description "西濃運輸のスクレイパーを実行します。"
    field :response, String, null: false

    argument :day, Integer, required: true
    argument :from_zipcode, String, required: true
    argument :month, Integer, required: true
    argument :to_zipcode, String, required: true
    argument :year, Integer, required: true

    def seino_search(from_zipcode: "2310847", to_zipcode: "1460082", year: "2021", month: "11", day: "29")
      arrival_date = Date.new(year.to_i, month.to_i, day.to_i)
      one_year_later = Date.today >> 12
      raise(StandardError, "Please Set Within 1 Year From Now!") if one_year_later < arrival_date

      month = "%02d" % month
      day = "%02d" % day
      driver = ::SOULsHelper.get_selenium_driver
      url = "https://track.seino.co.jp/lts/leadTimeSearch.do"
      driver.get(url)
      driver.find_element(name: "hatsuPostCode").send_keys(from_zipcode)
      driver.find_element(name: "chakuPostCode").send_keys(to_zipcode)
      drop_down = driver.find_element(name: "year")
      option = ::Selenium::WebDriver::Support::Select.new(drop_down)
      option.select_by(:value, year.to_s)
      drop_down = driver.find_element(name: "month")
      option = ::Selenium::WebDriver::Support::Select.new(drop_down)
      option.select_by(:value, month.to_s)
      drop_down = driver.find_element(name: "day")
      option = ::Selenium::WebDriver::Support::Select.new(drop_down)
      option.select_by(:value, day.to_s)
      driver.find_elements(:name, "hatsuChakuKubun").each do |element|
        element.click if element.attribute("value") == "2"
      end
      driver.find_element(xpath: "//*[@id='alpha-inner']/div/div/form/p[2]/input").click
      from = driver.find_element(class_name: "required-days-from").text
      to = driver.find_element(class_name: "required-days-to").text
      list = ""
      driver.find_elements(class_name: "required-days-result").each do |f|
        rows = f.find_elements(:css, "tr")
        list =
          rows.filter_map do |e|
            e.text if e.text.present?
          end
      end
      from_array = from.split("\n")
      to_array = to.split("\n")
      agents = ["カンガルースーパー9", "カンガルースーパー10", "カンガルービジネス便", "カンガルー特急便", "カンガルーミニ便（法人宛）", "カンガルーミニ便（個人宛）"]
      response = {
        from_zipcode: from_array[0],
        from_address: from_array[1],
        branch_address: from_array[2],
        branch_tel: from_array[3],
        to_zipcode: to_array[0],
        to_address: to_array[1],
        seino_result: []
      }
      list.each_with_index { |text, i| response[:seino_result] << { name: agents[i], arriving: text } }
      driver.quit
      response
    rescue StandardError => e
      raise(StandardError, e)
    end

    def resolve(args)
      res = seino_search(
        from_zipcode: args[:from_zipcode],
        to_zipcode: args[:to_zipcode],
        year: args[:year],
        month: args[:month],
        day: args[:day]
      )
      Slack::Ruby3.push(webhook_url: ENV["SLACK"], message: res.to_s)
      { response: "SeinoScraper Job Queued!" }
    rescue StandardError => e
      GraphQL::ExecutionError.new(e)
    end
  end
end
```

## Run test with `souls s`

Start Worker and check the operation of Scraper.

```bash
$ souls s
```

Well then

[localhostl: 3000 / playground](localhost:3000/playground)

To access

Make sure GraphQL PlayGround is running.

Then send the following Query.

Query

```ruby
query {
  seinoScraper(input: {
    fromZipcode: "1460082"
    toZipcode: "2310847"
    year: 2022
    month: 1
    day: 20
  }) {
    response
  }
}
```

If successful, the following response will be returned.

```json
{
  "data": {
    "seinoScraper": {
      "response": "SeinoScraper Job Queued!"
    }
  }
}
```

And if you look at Slack

![Slack message](/imgs/docs/seino-slack.png)

Scraper has been successfully added.

## Deploy

All you have to do is push to GitHub as before.

```bash
$ git add .
$ git commit -m "add mailer scraper"
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
