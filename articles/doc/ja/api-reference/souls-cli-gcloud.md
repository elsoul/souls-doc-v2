---
id: souls-cli-gcloud
title: SOULs Gcloud
description: SOULs Gcloud コマンドはAPIサーバー構築のための補助ツールです
---

`souls gcloud` コマンドでは `Google Cloud SDK` を使用することができます。

- [Google Cloud SDK](https://cloud.google.com/sdk)

## souls help gcloud

```bash
$ souls help gcloud
Commands:
  souls gcloud auth_login           # gcloud config set and gcloud auth login
  souls gcloud compute [COMMAND]    # souls gcloud compute Commands
  souls gcloud config_set           # gcloud config set
  souls gcloud enable_permissions   # Enable Google Cloud APIs for SOULs Framework
  souls gcloud functions [COMMAND]  # souls gcloud functions Commands
  souls gcloud help [COMMAND]       # Describe subcommands or one specific subcommand
  souls gcloud iam [COMMAND]        # souls gcloud iam Commands
  souls gcloud pubsub [COMMAND]     # souls gcloud pubsub Commands
  souls gcloud run [COMMAND]        # souls gcloud run Commands
  souls gcloud scheduler [COMMAND]  # souls gcloud schedluer Commands
  souls gcloud sql [COMMAND]        # souls gcloud sql Commands
```

## auth_login

プロジェクトを設定し、Google Cloud へログインします。

```bash
$ souls gcloud auth_login
```

## compute

`souls gcloud compute` コマンド一覧を表示します。

```bash
$ souls gcloud compute help
  Commands:
    souls compute help [COMMAND]  # Describe subcommands or one specific subcommand
    souls compute setup_vpc_nat   # Set Up VPC Cloud Nat
```

### setup_vpc_nat

以下の項目が実行されます。

- VPC ネットワークの作成
- Firewall TCP ルールの作成
- Firewall SSH ルールの作成
- ネットワークサブネット の作成
- VPC アクセスコネクター の作成
- Router の作成
- External IP の取得
- Cloud NAT の作成

SOULs コマンド:

```bash
$ souls gcloud compute setup_vpc_nat
```

```ruby
def setup_vpc_nat(range: "10.124.0.0/28")
  create_network
  create_firewall_tcp(range: range)
  create_firewall_ssh
  create_subnet(range: range)
  create_connector
  create_router
  create_external_ip
  create_nat
  nat_credit
end
```

## config_set

ローカルの Google Cloud のプロジェクトを設定します。

```bash
souls gcloud config_set
```

## enable_permissions

## functions

## iam

### create_service_account

Google Cloud Service Account を作成します。

SOULs コマンド:

```bash
$ souls gcloud iam create_service_account service_account: "souls-app"
```

```ruby
def create_service_account(service_account: "souls-app")
  `gcloud iam service-accounts create #{service_account} \
  --description="SOULs Service Account" \
  --display-name="#{service_account}"`
end
```

### create_service_account_key

Google Cloud Service Account Key を生成します。

SOULs コマンド:

```bash
$ souls gcloud iam create_service_account_key service_account: "souls-app" project_id: "souls-app"
```

```ruby
def create_service_account(service_account: "souls-app")
  `gcloud iam service-accounts create #{service_account} \
  --description="SOULs Service Account" \
  --display-name="#{service_account}"`
end
```

### add_service_account_role

Google Cloud Iam の Policy を追加します。

SOULs コマンド:

```bash
$ souls gcloud iam add_service_account_role service_account: "souls-app" project_id: "souls-app" role: "roles/firebase.admin"
```

```ruby
def add_service_account_role(
  service_account: "souls-app", project_id: "souls-app", role: "roles/firebase.admin"
)
  system(
    "gcloud projects add-iam-policy-binding #{project_id} \
  --member='serviceAccount:#{service_account}@#{project_id}.iam.gserviceaccount.com' \
  --role=#{role}"
  )
end
```

### add_permissions

Google Cloud Iam の 権限に

以下のロールを追加します。

```ruby
roles = [
    "roles/cloudsql.editor",
    "roles/containerregistry.ServiceAgent",
    "roles/pubsub.editor",
    "roles/datastore.user",
    "roles/iam.serviceAccountUser",
    "roles/run.admin",
    "roles/storage.admin",
    "roles/storage.objectAdmin"
  ]
```

SOULs コマンド:

```bash
$ souls gcloud iam add_permissions service_account: "souls-app" project_id: "souls-app"
```

```ruby
def add_permissions(service_account: "souls-app", project_id: "souls-app")
  roles = [
    "roles/cloudsql.editor",
    "roles/containerregistry.ServiceAgent",
    "roles/pubsub.editor",
    "roles/datastore.user",
    "roles/iam.serviceAccountUser",
    "roles/run.admin",
    "roles/storage.admin",
    "roles/storage.objectAdmin"
  ]
  roles.each do |role|
    add_service_account_role(service_account: service_account, project_id: project_id, role: role)
  end
end
```

## pubsub

### create_topic

Google Cloud PubSub Topic を作成します。

SOULs コマンド:

```bash
$ souls gcloud pubsub create_topic topic_name: "send-user-mail"
```

```ruby
def create_topic(topic_name: "send-user-mail")
  system("gcloud pubsub topics create #{topic_name}")
end
```

### topic_list

Google Cloud PubSub Topic List を取得します。

SOULs コマンド:

```bash
$ souls gcloud pubsub topic_list
```

```ruby
def topic_list
  system("gcloud pubsub topics list")
end
```

### create_subscription

Google Cloud PubSub Subscription を作成します。

SOULs コマンド:

```bash
$ souls gcloud pubsub create_subscription topic_name: "send-user-mail" endpoint: "https:://test.com"
```

```ruby
def create_subscription(
  topic_name: "send-user-mail",
  project_id: "",
  service_account: "",
  endpoint: "https:://test.com"
)
  project_id = SOULs.configuration.project_id if project_id.blank?
  service_account = "#{SOULs.configuration.app}@#{project_id}.iam.gserviceaccount.com" if service_account.blank?
  system(
    "gcloud pubsub subscriptions create #{topic_name}-sub \
    --topic #{topic_name} \
    --topic-project #{project_id} \
    --push-auth-service-account #{service_account} \
    --push-endpoint #{endpoint} \
    --expiration-period never
    "
  )
end
```

### update_subscription

Google Cloud PubSub Subscription のエンドポイントを更新します。

SOULs コマンド:

```bash
$ souls gcloud pubsub update_subscription topic_name: "send-user-mail" endpoint: "https:://test.com"
```

```ruby
def update_subscription(
  topic_name: "send-user-mail",
  endpoint: "https:://test.com"
)
  system("gcloud pubsub subscriptions update #{topic_name}-sub --push-endpoint #{endpoint} ")
end
```

### subscription_list

Google Cloud PubSub Subscription List を取得します。

SOULs コマンド:

```bash
$ souls gcloud pubsub subscription_list
```

```ruby
def subscription_list
  system("gcloud pubsub subscriptions list")
end
```

## run

### awake

対象の URL に 10 分ごとにアクセスします。
これは主に Google Cloud Run の 15 分ごとにスリープ状態に入ることを防ぐときに使用しています。

SOULs コマンド:

```bash
$ souls gcloud run awake URL
```

```ruby
def awake(url)
  app = SOULs.configuration.app
  system(
    "gcloud scheduler jobs create http #{app}-awake
    --schedule '0,10,20,30,40,50 * * * *' --uri #{url} --http-method GET"
  )
end
```

## sql

### create_instance

Google Cloud SQL Instance を作成します。

```bash
$ souls gcloud sql create_instance
```

### setup_private_ip

このコマンドによって

- VPC IP アドレス範囲の作成
- VPC Peering Connector の作成
- Cloud SQL の Private IP の有効化

を自動で行っています。

```bash
$ souls gcloud sql setup_private_ip
```

```ruby
def setup_private_ip
  create_ip_range
  create_vpc_connector
  assign_network
end
```

### assign_network

Google Cloud SQL に VPC Network を接続する

```bash
$ souls gcloud sql assign_network
```

```ruby
def assign_network
  app_name = SOULs.configuration.app
  instance_name = "#{SOULs.configuration.app}-db"
  project_id = SOULs.configuration.project_id
  system("gcloud beta sql instances patch #{instance_name} --project=#{project_id} --network=#{app_name}")
end
```

### create_ip_range

Google Cloud VPC Network に IP 範囲を作成する

```bash
$ souls gcloud sql create_ip_range
```

```ruby
def create_ip_range
  app_name = SOULs.configuration.app
  system(
    "
    gcloud compute addresses create #{app_name}-ip-range \
      --global \
      --purpose=VPC_PEERING \
      --prefix-length=16 \
      --description='peering range for SOULs' \
      --network=#{app_name} \
      --project=#{app_name}"
  )
end
```

### create_vpc_connector

Google Cloud VPC Connector を作成する

```bash
$ souls gcloud sql create_vpc_connector
```

```ruby
def create_vpc_connector
  app_name = SOULs.configuration.app
  system(
    "
    gcloud services vpc-peerings connect \
      --service=servicenetworking.googleapis.com \
      --ranges=#{app_name}-ip-range \
      --network=#{app_name} \
      --project=#{app_name}
    "
  )
end
```

### assign_ip

Google Cloud SQL に 現在使用しているグローバル IP を White List に追加する。

```bash
$ souls gcloud sql assign_ip
```

```ruby
def assign_ip(instance_name: "", ip: "")
  ip = `curl inet-ip.info` if ip.blank?
  project_id = SOULs.configuration.project_id
  instance_name = "#{SOULs.configuration.app}-db" if instance_name.blank?
  system(
    "
    gcloud beta sql instances patch #{instance_name} \
      --project=#{project_id} \
      --assign-ip \
      --authorized-networks=#{ip} \
      --quiet
    "
  )
end
```
