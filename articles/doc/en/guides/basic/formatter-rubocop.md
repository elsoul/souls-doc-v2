---
id: formatter-rubocop
title: Formatter - Rubocop
description: Here we use the souls command and Rubocop.
---

SOULs uses Rubocop as a Formatter to format as much code as possible to the [Ruby style guide](https://rubystyle.guide/) .

## Formatter --Rubocop

Ruby Style Guide

<https://github.com/rubocop/ruby-style-guide>

Rubocop

<https://github.com/rubocop/rubocop>

![rubocop](/imgs/gifs/rubocop-video.gif)

## Automatic formatting with VScode

Programming allows you to write code that achieves the same goal from any approach.

However, when developing as a team, it is not good for each individual to write differently.

Unifying the way you write code is very important for a team to work on a project.

The SOULs framework reads and `.rubocop.yml` by default, so the code is automatically unified.

## Run Rubocop

The `souls test` command runs `rubocop -A` and `bundle exec rspec` in sequence. Set up the environment so that you will not make typos that you do not notice during application development.

```bash
$ souls test
```
