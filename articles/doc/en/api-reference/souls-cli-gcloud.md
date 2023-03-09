---
id: souls-cli-gcloud
title: SOULs Gcloud
description: SOULs Gcloud command is an auxiliary tool for building API servers
---

You can use the `Google Cloud SDK` `souls gcloud` command.

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

## compute

### setup_vpc_nat

The following items are executed.

- Creating a VPC network
- Creating Firewall TCP rules
- Creating Firewall SSH rules
- Creating a network subnet
- Creating a VPC access connector
- Creating a Router
- Obtaining an External IP
- Creating Cloud NAT

SOULs command:

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

### create_network

Create a Google Cloud VPC network

SOULs command:

```bash
$ souls gcloud compute create_network
```

```ruby
def create_network
  app_name = SOULs.configuration.app
  system("gcloud compute networks create #{app_name}")
end
```

### create_firewall_tcp

Creating Google Cloud Firewall TCP rules

SOULs command:

```bash
$ souls gcloud compute create_firewall_tcp
```

```ruby
def create_firewall_tcp(range: "10.124.0.0/28")
  app_name = SOULs.configuration.app
  system(
    "gcloud compute firewall-rules create #{app_name} \
          --network #{app_name} --allow tcp,udp,icmp --source-ranges #{range}"
  )
end
```

### create_firewall_ssh

Creating Google Cloud Firewall SSH rules

SOULs command:

```bash
$ souls gcloud compute create_firewall_ssh
```

```ruby
def create_firewall_ssh
  app_name = SOULs.configuration.app
  system(
    "gcloud compute firewall-rules create #{app_name}-ssh --network #{app_name} \
    --allow tcp:22,tcp:3389,icmp"
  )
end
```

### create_subnet

Create a Google Cloud network subnet

SOULs command:

```bash
$ souls gcloud compute create_subnet
```

```ruby
def create_subnet(range: "10.124.0.0/28")
  app_name = SOULs.configuration.app
  region = SOULs.configuration.region
  system(
    "gcloud compute networks subnets create #{app_name}-subnet \
    --range=#{range} --network=#{app_name} --region=#{region}"
  )
end
```

### create_connector

Creating a Google Cloud VPC Access Connector

SOULs command:

```bash
$ souls gcloud compute create_connector
```

```ruby
def create_connector
  app_name = SOULs.configuration.app
  project_id = SOULs.configuration.project_id
  region = SOULs.configuration.region
  system(
    "gcloud compute networks vpc-access connectors create #{app_name}-connector \
      --region=#{region} \
      --subnet-project=#{project_id} \
      --subnet=#{app_name}-subnet"
  )
end
```

### create_router

Creating a GOogle Cloud Router

SOULs command:

```bash
$ souls gcloud compute create_router
```

```ruby
def create_router
  app_name = SOULs.configuration.app
  region = SOULs.configuration.region
  system("gcloud compute routers create #{app_name}-router --network=#{app_name} --region=#{region}")
end
```

### create_external_ip

Get Google Cloud External IP

SOULs command:

```bash
$ souls gcloud compute create_external_ip
```

```ruby
def create_external_ip
  app_name = SOULs.configuration.app
  region = SOULs.configuration.region
  system("gcloud compute addresses create #{app_name}-worker-ip --region=#{region}")
end
```

### create_nat

Creating Google Cloud Cloud NAT

SOULs command:

```bash
$ souls gcloud compute create_nat
```

```ruby
def create_nat
  app_name = SOULs.configuration.app
  region = SOULs.configuration.region
  system(
    "gcloud compute routers nats create #{app_name}-worker-nat \
          --router=#{app_name}-router \
          --region=#{region} \
          --nat-custom-subnet-ip-ranges=#{app_name}-subnet \
          --nat-external-ip-pool=#{app_name}-worker-ip"
  )
end
```

### network_list

Get the Google Cloud Network List.

SOULs command:

```bash
$ souls gcloud compute network_list
```

```ruby
def network_list
  system("gcloud compute network list")
end
```

## iam

### create_service_account

Create a Google Cloud Service Account.

SOULs command:

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

Generate a Google Cloud Service Account Key.

SOULs command:

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

Add a Google Cloud Iam Policy.

SOULs command:

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

Google Cloud Iam permissions

Add the following roles.

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

SOULs command:

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

Create a Google Cloud PubSub Topic.

SOULs command:

```bash
$ souls gcloud pubsub create_topic topic_name: "send-user-mail"
```

```ruby
def create_topic(topic_name: "send-user-mail")
  system("gcloud pubsub topics create #{topic_name}")
end
```

### topic_list

Get the Google Cloud PubSub Topic List.

SOULs command:

```bash
$ souls gcloud pubsub topic_list
```

```ruby
def topic_list
  system("gcloud pubsub topics list")
end
```

### create_subscription

Create a Google Cloud PubSub Subscription.

SOULs command:

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

Update your Google Cloud PubSub Subscription endpoint.

SOULs command:

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

Get the Google Cloud PubSub Subscription List.

SOULs command:

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

Access the target URL every 10 minutes. This is primarily used to prevent Google Cloud Run from going to sleep every 15 minutes.

SOULs command:

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

Create a Google Cloud SQL Instance.

```bash
$ souls gcloud sql create_instance
```

### setup_private_ip

By this command

- Creating a VPC IP address range
- Creating a VPC Peering Connector
- Enable Cloud SQL Private IP

Is done automatically.

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

Connect your VPC Network to Google Cloud SQL

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

Create an IP range on your Google Cloud VPC Network

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

Create a Google Cloud VPC Connector

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

Add the global IP you are currently using for Google Cloud SQL to your White List.

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
