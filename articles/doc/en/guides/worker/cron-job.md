---
id: cron-job
title: Periodic execution of Job
description: This section describes how to periodically execute a Job of SOULs Worker.
---

This section describes how to periodically execute a Job of SOULs Worker.

## Periodic execution of Job Query

You can run Jobs periodically by defining `cron` on top of `resolve` .

```ruby
 module Queries class NewCommentMailer < BaseQuery・・・cron "0 4 * * *" def resolve・・・end end end
```

You can specify `cron` in UNIX cron format as described above and in a human-readable format as shown below.

```css
 cron [TYPE] [INTERVAL_VALUE] [INTERVAL_SCOPE]
```

### End time interval

- TYPE: The daily run interval must include the every prefix.

  Example: `cron "every 12 hours"`

- \[INTERVAL_VALUE]: An integer value and its corresponding unit of time. The units of valid time are:

  minutes or mins

  hours

- \[INTERVAL_SCOPE]: Not applicable. To set a specific start time or time range for running a job, see the start time interval or custom interval syntax.

**Example of end time interval**

The following examples can help you understand how to define a job schedule that uses end time intervals.

- If you want to start execution at 00:00 every day and wait 5 minutes before the next job execution. At the end of each job, the cron service waits 5 minutes before running the next job.

```ruby
 cron "every 5 minutes"
```

- If you want to start execution at 00:00 every day and wait 30 minutes before the next job execution. When each job finishes, the cron service waits 30 minutes before running the next job.

```ruby
 cron "every 30 mins"
```

### Start time interval

- TYPE: The daily run interval must include the every prefix.

Example: `cron every 12 hours`

- \[INTERVAL_VALUE]: An integer value and its corresponding unit of time. The units of valid time are:

  minutes or mins hours

- \[INTERVAL_SCOPE]: Specify the clause corresponding to \[INTERVAL_VALUE]. You can define a custom time range or use the 24-hour synchronized option.

- from \[HH ] to \[HH ] Clause is included to define the specific start time and range for the job to run. HH with time value in 24-hour format Specify with. here,

  HH is an integer from 00 to 23.

  MM is an integer from 00 to 59.

- Use synchronized if you want to specify a 24-hour time range (from 00:00 to 23:59) and divide it evenly by the value of \[INTERVAL_VALUE].

**Important** : The value you specify for \[INTERVAL_VALUE] must be a divisor of 24. Otherwise, you will get an error. That is, the valid values for \[INTERVAL_VALUE] are 1, 2, 3, 4, 6, 8, 12, and 24.

**Example of start time interval**

If you want to use the start time interval to define the job schedule, use the following example as a guide.

- Run daily every 5 minutes from 10:00 to 14:00:

```ruby
 cron "every 5 minutes from 10:00 to 14:00"
```

- Run hourly from 08:00 to 16:00 daily:

```ruby
 cron "every 1 hours from 08:00 to 16:00"
```

- Run every 2 hours starting at 00:00 every day:

```ruby
 cron "every 2 hours synchronized"
```

### Custom interval

- TYPE: Custom interval allows you to define a repeat interval, including the every prefix, or to define a line item list for the date of the month.

  Use the every prefix to define the repeat interval.

  example:

```ruby
 cron "every day 00:00" cron "every monday 09:00"
```

- Ordinal numbers should be used when defining specific dates. Valid values are from the first day of the month to the value that represents the last day of the month. For example:

  1st or first 2nd or second 3rd or third Maximum: 31st or thirtyfirst

example:

```ruby
 cron "1st,3rd tuesday" cron "2nd,third wednesday of month 09:00"
```

- \[INTERVAL_VALUE]: Custom intervals can include specific dates and days of the week to run the job. The list must be comma separated and can contain any of the following values:

- An integer value that represents the date of the month, up to 31 days. For example:

  1

  2

  3

  Up to 31

- Any combination of the following long names or abbreviations for day names:

  monday or mon

  tuesday or tue

  wednesday or wed

  thursday or thu

  friday or fri

  saturday or sat

  sunday or sun

- Use day to specify all days of the week.

example:

```ruby
 cron "2nd monday,thu" cron "1,8,15,22 of month 09:00" cron "1st mon,wednesday,thu of sep,oct,nov 17:00"
```

- \[INTERVAL_SCOPE]: Specify the clause corresponding to the specified \[INTERVAL_VALUE]. The custom interval can be a comma-separated list of specific months or months in the year of [MONTH](%E8%A4%87%E6%95%B0%E6%9C%88%E3%81%AF%E3%82%AB%E3%83%B3%E3%83%9E%E5%8C%BA%E5%88%87%E3%82%8A%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%E3%81%A7%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%E6%9C%88%E3%81%AE%E5%80%A4%E3%81%AB%E3%81%AF%E4%BB%A5%E4%B8%8B%E3%81%AE%E9%95%B7%E3%81%84%E5%90%8D%E5%89%8D%E3%81%A8%E7%9F%AD%E7%B8%AE%E5%BD%A2%E3%82%92%E6%B7%B7%E5%9C%A8%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82) clause. Also, set the specific time to execute the job of [MONTH](%E8%A4%87%E6%95%B0%E6%9C%88%E3%81%AF%E3%82%AB%E3%83%B3%E3%83%9E%E5%8C%BA%E5%88%87%E3%82%8A%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%E3%81%A7%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%E6%9C%88%E3%81%AE%E5%80%A4%E3%81%AB%E3%81%AF%E4%BB%A5%E4%B8%8B%E3%81%AE%E9%95%B7%E3%81%84%E5%90%8D%E5%89%8D%E3%81%A8%E7%9F%AD%E7%B8%AE%E5%BD%A2%E3%82%92%E6%B7%B7%E5%9C%A8%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82) \[HH]. ] Must be defined as. By default, if you omit the of clause, the custom interval runs every month.

- january or jan

  february or feb

  march or mar

  april or apr

  may

  june or jun

  july or jul

  august or aug

  september or sep

  october or oct

  november or nov

  december or dec

- Use month to specify all months.

- \[HH ]: Time value in 24-hour format HH Must be specified in.

  HH is an integer from 00 to 23. MM is an integer from 00 to 59.

example:

```ruby
 cron "1st monday of sep,oct,nov 09:00" cron "1 of jan,april,july,oct 00:00"
```

**Custom interval example**

Use the following examples to help you define your job's schedule with custom intervals.

- Run daily at 00:00:

```ruby
 cron "every day 00:00"
```

- Run every Monday at 09:00:

```ruby
 cron "every monday 09:00"
```

- Run only once at 17:00 on the second Wednesday of March:

```ruby
 cron "2nd wednesday of march 17:00"
```

- Run once at 10:00 on Monday, Wednesday, and Friday in the first two weeks of May, for a total of six times:

```ruby
 cron "1st,second mon,wed,fri of may 10:00"
```

- Run once a week. Execute once every 7 days at 09:00 starting from the 1st day of every month:

```ruby
 cron "1,8,15,22 of month 09:00"
```

- Run every other week. Run once at 04:00 on the first and third Mondays of each month:

```ruby
 cron "1st,third monday of month 04:00"
```

- Run 3 times a year. Run once at 09:00 on the first Monday of September, October, and November:

```ruby
 cron "1st monday of sep,oct,nov 09:00"
```

- Run once every quarter. Run once at 00:00 on the first day of January, April, July, and October:

```ruby
 cron "1 of jan,april,july,oct 00:00"
```
