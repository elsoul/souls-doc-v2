---
id: basic-architecture
title: Overview of the Framework
description: Overview of the SOULs Framework.
---

Overview of the SOULs Framework.

## Monorepo

The SOULs Framework manages applications through [Monorepo.](https://en.wikipedia.org/wiki/Monorepo)

Web applications include user apps, admin apps, back-end APIs, task processing by Workers, etc.

It has various roles,

It can be managed in one `git repository`

This greatly improves the efficiency of development between teams.

![SOULs serverless architecture](/imgs/docs/SOULs-architecture-tutorial.jpg)

## Mother and service

SOULs have one mother and multiple services.

The mother will be the root directory of [Monorepo](https://en.wikipedia.org/wiki/Monorepo).

For service

There are three types,

`API`, `Worker` and `Cloud Functions(CF)`.

You can create multiple Workers and Cloud Functions.

`souls-app` mother directory

```arduino
souls-app（Mother Dir）
├── apps
│   ├── api（API Dir）
│   ├── worker-mailer1（Worker Dir）
│   ├── worker-mailer2（Worker Dir）
│   ├── cf-ruby27-method1（CF Dir）
│   ├── cf-python39-method1（CF Dir）
│
├── config
├── github
│
  .
  .
```

## Automatic deployment with GitHub Actions

The SOULs framework uses `Github Actions` ,

We are building a CI / CD environment.

API, detects changes in each Worker directory,

If there are any changes, `push` `main` branch and the deployment will be complete.

Because we run the tests before deploying

In the unlikely event that the test fails, the deployment will be rolled back, so

It will not be deployed in production.

This allows you to proceed with your project in a safe and fast development environment.

### What is CI / CD?

CI / CD (Continuous Integration / Continuous Delivery) is a method of incorporating automation into the stage of application development to increase the frequency of delivering applications to customers. The main concepts that arose from CI / CD are continuous integration, continuous delivery, and continuous deployment. CI / CD is a solution to the problems that new code integration creates for development and operations teams (ie, "integration hell").
