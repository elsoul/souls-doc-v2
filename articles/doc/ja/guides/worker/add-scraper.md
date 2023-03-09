---
id: add-scraper
title: Scraper の追加
description: ここでは 2 つめの Worker, Scraper の追加をする方法を説明します。
---

:::div{.info}
ここでは 2 つめの Worker, Scraper の追加をする方法を説明します。
:::

## Scraper の追加

`souls create worker` コマンドを使用して、
2 つめの Worker を追加します。

```bash
$ souls create worker scraper
```

以下のように、`apps` に `scraper` が追加されました。

`.github/workflow` の中にも `worker-scraper.yml` が自動で追加されているので、
デプロイ作業はこれまでと変わりはありません。

```
souls-app（マザーディレクトリ）
├── apps
│   ├── api
│   ├── mailer
│   ├── worker-scraper
│
├── config
├── .github
│   ├── workflow
│          ├── api.yml
│          ├── mailer.yml
│          ├── worker-scraper.yml
  .
  .
```

このように、複数の独立した Worker を追加していくことができます。

## Query の追加

SOULs Worker の `graphql` ディレクトリの中の `queries` 内にジョブを定義していきます。

```bash
app（Workerルートディレクトリ）
├── apps
│   ├── graphql
│   │     ├── queries
│   │     │       ├── base_query.rb
│   │     ├── types
│   │     │       ├── base
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

## Job を追加する

```bash
$ souls g job ${job_name}
```

```bash
$ souls g job seino_scraper
Created file! : ./app/graphql/queries/seino_scraper.rb
🎉  Done!
```

以下のファイルが自動生成されます。

```ruby:apps/worker-scraper/app/graphql/queries/seino_scraper.rb
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

## スクレイピングコードの追加

ここではサンプルとして

[西濃運輸の所要日数検索](https://track.seino.co.jp/lts/leadTimeSearch.do) から、

![西濃運輸の所要日数検索](/imgs/docs/seino-search.png)

** 指定日までに届けるには何日までに発送を行えばよいか、
を取得し、 Slack で通知する。**

という タスク処理の `Query` を作成します。

Slack の Webhook URL の取得については

[Slack での Incoming Webhook の利用](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-での-Incoming-Webhook-の利用)

を参考にして下さい。

また、環境変数 `SLACK` の設定については

ゼロからデプロイまで の [Github シークレットキーの登録](/ja/docs/tutorial/souls-api-deploy/#github-シークレットキーの登録) を参考にして下さい。

WebDriver の準備がまだの方は

[WebDriver のインストール](/ja/docs/dependencies/webdriver/)

を先に終了してください。

それでは、`resolve` 内にスクレイピングのコードを追加しましょう。

今回は西濃運輸で、荷物の配送日のチェックをするスクレイピングコードを書きます。

```ruby:apps/worker-scraper/app/graphql/queries/seino_scraper.rb
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

## `souls s` で実行テスト

Worker を起動して、Scraper の動作確認をしてみます。

```bash
$ souls s
```

それでは

[localhostl:3000/playground](localhost:3000/playground)

にアクセスして、

GraphQL PlayGround が起動していることを確認してください。

そして、以下の Query を送信します。

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

成功すると、以下のレスポンスが返却されます。

```json
{
  "data": {
    "seinoScraper": {
      "response": "SeinoScraper Job Queued!"
    }
  }
}
```

そして Slack を見ると

![Slack メッセージ](/imgs/docs/seino-slack.png)

無事に Scraper が追加されました。

## デプロイ

デプロイ作業はこれまでと同様に GitHub へ Push するだけです。

```bash
$ git add .
$ git commit -m "add scraper"
$ git push origin main
```

デプロイまでに 5 分ほどかかります。

## souls sync conf の実行

デプロイ完了後、以下のコマンドで `config/souls.rb` の設定を自動更新することができます。

```bash
$ souls sync conf
```

これで Worker と Pub/Sub メッセージングを結び付ける準備ができました。

## タスクと Pub/Sub メッセージングの同期

SOULs フレームワークのタスク処理は、本番環境では Pub/Sub メッセージングを使用して、
タスクキューを入れます。

これにより、万が一タスクが終了する前にネットワークに不具合が生じた場合など、

** いつ、どこで、どのタスク処理が、終わったのか、終わらなかったのか **

の状態を把握できるようになります。

:::div{.warning}
※初回デプロイ後に Cloud Run の URL が発行されるので PubSub Sync は２回目以降のデプロイ時から実行されます。
:::

Worker のタスクを Pub/Sub メッセージングで呼び出せるようにするための設定は必要ありません。

GitHub Actions の Workflow でこのフローを自動化しています。

![pubsub](/imgs/docs/pubsub-workflow.png)

このワークフローでは

- Worker 内のすべての `query` ファイルをチェック
- 同一プロジェクト内の Google Cloud PubSub 上にある トピックとサブスクリプションのリストを取得
- Worker 内にある `query` ファイルに対する PubSub トピックを検索し、なければ作成
- PubSub トピックに対するファイルが `query` 内になければ PubSub トピックを削除

これらの作業を自動で行っています。

PubSub トピック名は

`souls-${worker_name}-${query_file_name}`

例えば、

Mailer Worker の `new_comment_mailer.rb` の場合

`souls-worker-mailer-new-comment-mailer`

となります。

[Google Cloud Console](https://console.cloud.google.com/cloudpubsub/topic/list) へログインして、

Pub/Sub Topic と Pub/Sub Subscription が作成されていることを確認してみましょう。
