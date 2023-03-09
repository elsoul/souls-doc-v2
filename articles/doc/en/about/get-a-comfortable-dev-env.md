---
id: get-a-comfortable-dev-env
title: Get a comfortable development environment
description: Thanks to the efforts of the great open source developers and the evolution of IDEs (Integrated Development Environments) like Visual Studio Code, we have a comfortable development environment.
---

This page describes setting up a development environment for SOULs, thanks to the efforts of the great open source developers and the evolution of IDEs (Integrated Development Environments) like [Visual Studio Code](https://code.visualstudio.com/).

## Active Record and Scaffold

Ruby on Rails represents a particularly special development experience. We wanted to achieve a similar development experience with more flexibility in a cloud-native environment, so we adopted Active Record and built a schema-driven Scaffold for distributed systems.

## Code unification by RuboCop

Historically, we've been plagued by esoteric code. Unifying coding styles brings order and transparency to the code base. Simple and easy-to-read code is easy to manage.

## Testing with RSpec

The test suite gives immediate feedback so that changes can be quickly detected if they adversely affect other parts of the system. Independent verification is performed for each part of the code to prevent bugs.

## GitHub Actions (CI / CD)

Code integration issues are minimised by auto-deploying each commit. If the test fails, deployment to production will stop automatically, so you can check the results and make corrections.

## GraphQL API

Designed to improve speed, flexibility, and ease of use for developers, it also provides a Playground environment that allows you to query the database directly. Requests from multiple data sources can be configured with a single API call.

## Supports fixed IP restrictions

Distributed systems that scale to multiple instances to handle requests have had difficulty meeting fixed IP limits. SOULs solves this problem by using Cloud NAT.

## Effortless Routing

The task of routing is simple but often prone to error. SOULs automates routing tasks as much as possible, including GraphQL queries and mutations, as well as Pub / Sub worker topics.

## Docker container

By coding the infrastructure and sharing files, you can create the same environment anywhere. You can continue development on a reproducible infrastructure without struggling with environmental differences such as differences between development and production.
