---
id: cron-job
title: Job の定期実行
description: ここでは SOULs Worker の Job を定期実行する方法を説明します。
---

:::div{.info}
ここでは SOULs Worker の Job を定期実行する方法を説明します。
:::

## Job Query の定期実行

`resolve` の上に `cron` を定義することで、
Job を定期実行することができます。

```ruby
module Queries
  class NewCommentMailer < BaseQuery
    ・
    ・
    ・

    cron "0 4 * * *"
    def resolve
      ・
      ・
      ・
    end
  end
end
```

`cron` について、上記のように UNIX cron 形式での指定と、
下記のように人間の読みやすい形での指定が可能です。

```
cron [TYPE] [INTERVAL_VALUE] [INTERVAL_SCOPE]
```

### 終了時刻の間隔

- [TYPE]: 毎日実行する間隔には every 接頭辞を含める必要があります。

  例: `cron "every 12 hours"`

- \[INTERVAL_VALUE\]: 整数値とそれに対応する時間の単位。有効な時間の単位は次のとおりです。

  minutes または mins

  hours

- \[INTERVAL_SCOPE\]: 該当しません。ジョブを実行する特定の開始時刻または時間範囲を設定するには、開始時刻の間隔またはカスタムの間隔の構文をご覧ください。

**終了時刻の間隔の例**

終了時刻の間隔を使用するジョブのスケジュールの定義方法の理解には、以下の例が参考になります。

- 毎日 00:00 に実行を開始し、次回のジョブ実行まで 5 分間待機する場合。各ジョブが終了すると、cron サービスは 5 分間待機してから次のジョブを実行します。

```ruby
cron "every 5 minutes"
```

- 毎日 00:00 に実行を開始し、次回のジョブ実行まで 30 分間待機する場合。各ジョブが終了すると、cron サービスは 30 分間待機してから次のジョブを実行します。

```ruby
cron "every 30 mins"
```

### 開始時刻の間隔

- [TYPE]: 毎日実行する間隔には every 接頭辞を含める必要があります。

例: `cron every 12 hours`

- \[INTERVAL_VALUE\]: 整数値とそれに対応する時間の単位。有効な時間の単位は次のとおりです。

  minutes または mins
  hours

- [INTERVAL_SCOPE]: \[INTERVAL_VALUE\] に対応する句を指定します。カスタム時間範囲を定義するか、24 時間の synchronized オプションを使用できます。
- from [HH:MM] to [HH:MM] 句を含めて、ジョブを実行する特定の開始時刻と範囲を定義します。
  時刻の値を 24 時間形式の HH:MM で指定します。ここで、

  HH は 00 から 23 までの整数です。

  MM は 00 から 59 までの整数です。

- 24 時間の時間範囲（from 00:00 to 23:59）を指定し、それを \[INTERVAL_VALUE\] の値で均等に分割する場合は、synchronized を使用します。

**重要**: \[INTERVAL_VALUE\] に指定する値は 24 の約数でなければなりません。そうでないと、エラーが発生します。つまり \[INTERVAL_VALUE\] の有効な値は、1、2、3、4、6、8、12、24 です。

**開始時刻の間隔の例**

開始時刻の間隔を使用してジョブのスケジュールを定義する場合は、以下の例を参考にしてください。

- 毎日 10:00 ～ 14:00 に 5 分間隔で実行する:

```ruby
cron "every 5 minutes from 10:00 to 14:00"
```

- 毎日 08:00 ～ 16:00 に 1 時間ごとに実行する:

```ruby
cron "every 1 hours from 08:00 to 16:00"
```

- 毎日 00:00 を起点として 2 時間ごとに実行する:

```ruby
cron "every 2 hours synchronized"
```

### カスタムの間隔

- [TYPE]: カスタムの間隔では、every 接頭辞を含めて繰り返しの間隔を定義するか、月の日付の明細リストを定義できます。

  繰り返しの間隔を定義するには、every 接頭辞を使用します。

  例:

```ruby
cron "every day 00:00"
cron "every monday 09:00"
```

- 具体的な日付を定義する場合は、序数を使用する必要があります。有効な値は、月の初日からその月の最終日を表す値までです。たとえば、次のようになります。

  1st または first
  2nd または second
  3rd または third
  最大値: 31st または thirtyfirst

例:

```ruby
cron "1st,3rd tuesday"
cron "2nd,third wednesday of month 09:00"
```

- \[INTERVAL_VALUE\]: カスタムの間隔には、ジョブを実行する具体的な日付や曜日を含めることができます。リストはカンマ区切りで定義する必要があり、以下のいずれかの値を含めることができます。

- その月の日付を表す整数値で、最大 31 日まで。たとえば、次のようになります。

  1

  2

  3

  最大 31

- 曜日名を表す次の長い名前または短縮形の任意の組み合わせ:

  monday または mon

  tuesday または tue

  wednesday または wed

  thursday または thu

  friday または fri

  saturday または sat

  sunday または sun

- すべての曜日を指定するには、day を使用します。

例:

```ruby
cron "2nd monday,thu"
cron "1,8,15,22 of month 09:00"
cron "1st mon,wednesday,thu of sep,oct,nov 17:00"
```

- [INTERVAL_SCOPE]: 指定した \[INTERVAL_VALUE\] に対応する句を指定します。カスタムの間隔には、年内の特定のひと月または複数の月のカンマ区切りのリストを指定する of [MONTH] 句を指定できます。また、ジョブを実行する具体的な時刻を of [MONTH] [HH:MM] のように定義する必要があります。
  of 句を省略した場合のデフォルトでは、カスタムの間隔は毎月実行されます。

- [month]: 複数月はカンマ区切りのリストで指定します。月の値には以下の長い名前と短縮形を混在させることができます。

  january または jan

  february または feb

  march または mar

  april または apr

  may

  june または jun

  july または jul

  august または aug

  september または sep

  october または oct

  november または nov

  december または dec

- すべての月を指定するには、month を使用します。

- [HH:MM]: 時刻の値を 24 時間形式の HH:MM で指定する必要があります。

  HH は 00 から 23 までの整数です。
  MM は 00 から 59 までの整数です。

例:

```ruby
cron "1st monday of sep,oct,nov 09:00"
cron "1 of jan,april,july,oct 00:00"
```

**カスタムの間隔の例**

カスタムの間隔を使用してジョブのスケジュールを定義する場合は、以下の例を参考にしてください。

- 毎日 00:00 に実行する:

```ruby
cron "every day 00:00"
```

- 毎週月曜日の 09:00 に実行する:

```ruby
cron "every monday 09:00"
```

- 3 月の第 2 水曜日の 17:00 に 1 回だけ実行する:

```ruby
cron "2nd wednesday of march 17:00"
```

- 5 月の最初の 2 週の月曜日、水曜日、金曜日の 10:00 に 1 回ずつ、つまり合計で 6 回実行する:

```ruby
cron "1st,second mon,wed,fri of may 10:00"
```

- 1 週間に 1 回実行する。毎月 1 日を起点として 7 日ごとの 09:00 に 1 回実行する:

```ruby
cron "1,8,15,22 of month 09:00"
```

- 隔週で実行する。毎月第 1 および第 3 月曜日の 04:00 に 1 回実行する:

```ruby
cron "1st,third monday of month 04:00"
```

- 毎年 3 回実行する。9 月、10 月、11 月の第 1 月曜日の 09:00 に 1 回実行する:

```ruby
cron "1st monday of sep,oct,nov 09:00"
```

- 四半期ごとに 1 回実行する。1 月、4 月、7 月、10 月の初日の 00:00 に 1 回実行する:

```ruby
cron "1 of jan,april,july,oct 00:00"
```
