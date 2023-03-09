---
id: add-cloud-nat
title: Outbound static IP address configuration
description: This guide describes how to use a static IP address to allow the Cloud Run service to send requests over Cloud NAT.
---

This guide describes how to use a static IP address to allow the Cloud Run service to send requests over Cloud NAT.

For outbound static IP address settings,

Please refer to [this link.](https://cloud.google.com/run/docs/configuring/static-outbound-ip?hl=ja)

When developing a system, there are many situations where it is necessary to cooperate with an external system.

Depending on the other system, it may be necessary to add all the source IPs to the White list.

In this case, if you simply scale the Worker, it may be difficult to register all the IPs with the other system because the number of outgoing IPs increases as the number of instances increases.

In such a case, create a VPC network and set up Cloud NAT.

![Cloud NAT](/imgs/gifs/souls-cloud-nat.gif)

Cloud NAT allows you to communicate from the same fixed IP via a scalable network router when communicating to the outside world.

## Creating a VPC network

Make the necessary settings to scale the network, such as VPC network and firewall settings.

```bash
$ souls gcloud compute setup_vpc_nat
```

By this command

- Creating a VPC network
- Creating Firewall TCP rules
- Creating Firewall SSH rules
- Creating a network subnet
- Creating a VPC access connector
- Creating a Router
- Obtaining an External IP
- Creating Cloud NAT

Is done automatically.

## Set up a private IP for Cloud SQL

Use the SOULs command to configure your instance of Google Cloud SQL for private IP.

```bash
$ souls gcloud sql setup_private_ip
```

By this command

- Creating a VPC IP address range
- Creating a VPC Peering Connector
- Enable Cloud SQL Private IP

Is done automatically.

## Editing .github / worker-\*.yml

Add the two options output to the console to Workflow in Github Actions.

`.github/workflow/worker.yml`

```diff
# 中略 #
  name: Deploy to Cloud Run
  run: |
    gcloud run deploy ${{ secrets.APP_NAME }}-mailer \
      --service-account=${{ secrets.APP_NAME }}@${{ secrets.GCP_PROJECT_ID }}.iam.gserviceaccount.com \
      --image=gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{secrets.APP_NAME}}-mailer \
+     --vpc-connector=souls-app-connector \
+     --vpc-egress=all \
      --memory=4Gi \
      --region=asia-northeast1 \
      --allow-unauthenticated \
      --platform=managed \
      --quiet \
      --concurrency=80 \
      --port=8080 \
      --set-cloudsql-instances=${{ secrets.GCLOUDSQL_INSTANCE }} \
      --set-env-vars="DB_USER=${{ secrets.DB_USER }}" \
      --set-env-vars="DB_PW=${{ secrets.DB_PW }}" \
      --set-env-vars="DB_HOST=${{ secrets.DB_HOST }}" \
      --set-env-vars="TZ=${{ secrets.TZ }}" \
      --set-env-vars="SLACK=${{ secrets.SLACK }}" \
      --set-env-vars="SECRET_KEY_BASE=${{ secrets.SECRET_KEY_BASE }}" \
      --set-env-vars="PROJECT_ID=${{ secrets.GCP_PROJECT_ID }}"
```

## Editing .github / api.yml

Also connect to the VPC Connector in the API `api.yml`

`--vpc-connector=souls-app-connector`

Add only one line of.

`.github/workflow/api.yml`

```diff
# 中略 #
  name: Deploy to Cloud Run
  run: |
    gcloud run deploy ${{ secrets.APP_NAME }}-mailer \
      --service-account=${{ secrets.APP_NAME }}@${{ secrets.GCP_PROJECT_ID }}.iam.gserviceaccount.com \
      --image=gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{secrets.APP_NAME}}-mailer \
+     --vpc-connector=souls-app-connector \
      --memory=4Gi \
      --region=asia-northeast1 \
      --allow-unauthenticated \
      --platform=managed \
      --quiet \
      --concurrency=80 \
      --port=8080 \
      --set-cloudsql-instances=${{ secrets.GCLOUDSQL_INSTANCE }} \
      --set-env-vars="DB_USER=${{ secrets.DB_USER }}" \
      --set-env-vars="DB_PW=${{ secrets.DB_PW }}" \
      --set-env-vars="DB_HOST=${{ secrets.DB_HOST }}" \
      --set-env-vars="TZ=${{ secrets.TZ }}" \
      --set-env-vars="SLACK=${{ secrets.SLACK }}" \
      --set-env-vars="SECRET_KEY_BASE=${{ secrets.SECRET_KEY_BASE }}" \
      --set-env-vars="PROJECT_ID=${{ secrets.GCP_PROJECT_ID }}"
```

## GitHub Actions Secret key update

Since I created a Private IP for Google Cloud SQL, I used the `PRIVATE_ADDRESS` I got earlier.

Overwrite `DB_HOST` on GitHub.

`PRIVATE_ADDRESS` can be displayed with the following command.

```bash
$ souls gcloud sql list
NAME              DATABASE_VERSION  LOCATION           TIER              PRIMARY_ADDRESS  PRIVATE_ADDRESS  STATUS
souls-app-db  POSTGRES_13       asia-northeast1-b  db-custom-2-7680  31.142.0.103     10.18.0.2        RUNNABLE
```

Set `PRIVATE_ADDRESS` `DB_HOST` on GitHub Secret.

![GitHub Secret](/imgs/docs/db-host.png)

## Deploy

```bash
$ git add .
$ git commit -m "add cloud nat"
$ git push origin main
```
