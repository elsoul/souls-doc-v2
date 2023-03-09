---
id: souls-api-deploy
title: Deploy SOULs API
description: SOULs allows you to build CI / CD cycles that deploy GraphQL API / Worker to Google Cloud Run using GitHub Actions.
---

:::div{.info}
SOULs allows you to build CI / CD cycles that deploy GraphQL API / Worker to Google Cloud Run using GitHub Actions. Experience powerful automated testing and automated deployment.
:::

## Operation check

[Exit the quick start](/docs/start/quickstart/) and make sure the app is running. In this tutorial, we will proceed with development using the application created in the quick start.

```bash
$ cd souls-app
```

## Create GitHub repository and push

Let's create a new repository on GitHub.

[GitHub link](https://github.com)

After creating a new repository on the above site, upload the source code with the following command.

Run from the mother directory.

```bash
$ git add .
$ git commit -m 'first commit'
$ git remote add origin git@github.com:YOURREPO/YOURAPP.git
$ git push origin main
```

## Preparing a serverless environment using Google Cloud

The SOULs API allows you to operate the cloud using `souls`. Write the required settings to `./config/souls.rb` The work required for deployment is only the first time.

### Create a Google Cloud project

If you have never used Google Cloud before, use this link to create a project.

[How to create a project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

:::div{.success}
Whether you've used Google Cloud before or it's your first time, you can get $200 free credit by using the link below:

[Google Cloud Credit](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)
:::

### Preparing Google Cloud IAM permissions

The next command sets the `SOULS_GCP_SA_KEY`, required for Google Cloud from the app. It also grants the necessary permissions for deployment.

Then, the secret key is automatically registered to the environment variable `SOULS_GCP_SA_KEY` of the Github secret.

```bash
$ souls gcloud iam setup_key
```

### Creating a CLoud SQL Instance

The SOULs `gcloud` command is used as follows

```bash
$ souls gcloud ${service_name} ${method_name} --option ...
```

You can run the `gcloud` command by passing `--option` after `${method_name}` , as in.

You can display the help with the following command.

```bash
$ souls gcloud help
```

Now let's create an instance on Google Cloud SQL.

```bash
$ souls gcloud sql create_instance
```

### .env settings

.env settings are input automatically when the instance is created.
The API settings can be found in `apps/api/.env` and production settings for the whole app in `.env.production`.

![souls-gh-secret](/imgs/gifs/souls-gh-secret.gif)

This sets up all the initial values of the required secret keys for the workflow like this.

![GitHub Secret](/imgs/docs/github-secret5.png)

### Add IP to Cloud SQL

`souls gcloud sql` command,

Set up access to Google Cloud SQL from your current global IP.

```bash
$ souls gcloud sql assign_ip
```

### Database migration

In the API directory, `souls` command to create and migrate your production database.

```bash
$ cd apps/api
$ souls db create --e=production
$ souls db migrate --e=production
```

## Deploy

Before deploying, let's test again to make sure the app is working properly.

```bash
$ souls test
```

Make sure that all examples are green and have 0 failures. The deployment to production can only complete if all tests are passing, so ensure that they're all green.

![SOULs test](/imgs/docs/souls-t.png)

:::div{.warning}
Now let's rename and deploy the `github` directory in the mother directory.

From here on, if the deployment is successful, Google Cloud credit will start to be used. Claim a free $200 of credit to get started using the link below.

[Google Cloud Credit](https://cloud.google.com/partners/partnercredit?pcn_code=0014M00001h3BjPQAU)

\* You can continue this tutorial without deploying. Skip [to Create Model.](/docs/tutorial/create-model/)
:::

Return to the mother directory:

```bash
$ cd ...
```

Then push with `Github Actions`.

```bash
$ mv github .github
$ git add .
$ git commit -m 'first deploy'
$ git push origin main
```

## Confirm GitHub Workflow

You can show the log of the deploy using the following command.

```bash
$ souls gh watch
```

![GitHub Actions](/imgs/gifs/souls-gh-watch.gif)

## Update / Debug

Let's update and debug using the `souls` console. Enter the console and check the Model data.

```bash
$ souls c
```

The `SOULs` framework uses the irb console. If you are new to irb, please refer to [this link.](https://github.com/ruby/irb)

[GitHub: irb](https://github.com/ruby/irb)

```bash
irb(main):001:0> User.all
D, [2021-07-14T11:40:11.797378 #11805] DEBUG -- :   User Load (3.0ms)  SELECT "users".* FROM "users" ORDER BY "users"."created_at" DESC
=>
[#<User:0x000055c1cf1da538
  id: 20,
  uid: "RgGrTeEkX8j0V",
  username: "岡田 律華",
  screen_name: "jere_farrell",
  last_name: "おかだ",
  first_name: "りか",
  last_name_kanji: "岡田",,
```

In a production environment, set `RACK_ENV` to `production` Being able to debug a production database directly from the console is very powerful. Be careful when handling it.

```bash
$ souls c --e=production
```

You can update the Gemfile using a SOULs command as well.

```bash
$ souls upgrade gemfile
```

This command checks if there is a difference between the version `Gemfile` and the latest version, updates the `gem` if there is the latest version, and overwrites the version to the `Gemfile`.
