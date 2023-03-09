---
id: introduction
title: Introduction
description: This SOULs tutorial is designed for those who want to learn practically developing a mini-application.
---

:::div{.info}
This SOULs tutorial is designed for those who want to learn by practically developing a mini-application. For those who want to learn the concepts through the API reference, please refer to the [SOULs Basic Guide.](/docs/guides/api/basic-architecture) This tutorial and reference are complementary to each other.
:::

## Before starting the tutorial

This tutorial is a comprehensive cloud application development tutorial that includes the programming languages Ruby and technologies GraphQL, Google Cloud, Firebase, and GitHub.

In this tutorial you will create a basic blogging API. \*\* You may want to skip it because you don't want to create a blog, but please take a look. \*\* The techniques you will learn in this tutorial are basic to any SOULs app, and mastering them will give you a deeper understanding of SOULs.

This tutorial is divided into 5 sections.

- [From zero to deploy](/docs/tutorial/souls-api-deploy/)
- [Create a Model](/docs/tutorial/create-model/)
- [Run Scaffold](/docs/tutorial/execute-scaffold/)
- [Try connecting GraphQL edges](/docs/tutorial/graphql-batch-loader)
- [Preparing SOULs Worker](/docs/tutorial/souls-worker-deploy/)

### What to make from now on

This tutorial will show you how to create a basic API with SOULs commands through the blog API. If you don't understand the code at any point, don't worry. The purpose of this tutorial is to help you learn about SOULs and its syntax.

There are two types of SOULs backends: API and Worker. The API is responsible for handling data storage and retrieval. Workers mainly handle logic and processing. The diagram below explains the general arhchitecture.

![SOULs Architecture](/imgs/docs/SOULs-architecture-tutorial.jpg)

Here, the SOULs API and Worker in the red frame are deployed to Google Cloud Run using GitHub Actions respectively.

The SOULs framework manages applications with [Monorepo.](https://en.wikipedia.org/wiki/Monorepo)

### Prerequisite knowledge

I'm assuming you're a little familiar with Ruby, but anyone who has used other programming languages should be able to get started. We also assume that you are familiar with concepts in object-oriented programming such as functions, objects, arrays, and classes.

The API uses the GraphQL API instead of the REST API, so if you need to review GraphQL, I recommend reading this first.

[GraphQL](https://graphql.org/)

[graphql-ruby](https://graphql-ruby.org/)

SOULs exposes only one GraphQL endpoint. Also, neither API / Worker requires internal routing.

The SOULs GraphQL API created in this tutorial returns a response that also supports the GraphQL Relay format.

[Relay](https://relay.dev/)

This tutorial uses GitHub Actions to deploy to Google Cloud Run.

Enjoy the SOULs framework that allows you to instantly deploy your ideas to a serverless cloud environment!
