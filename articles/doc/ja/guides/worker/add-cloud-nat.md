---
id: add-cloud-nat
title: 外向きの静的 IP アドレスの設定
description: このガイドでは、静的 IP アドレスを使用して Cloud Run サービスから Cloud NAT を経由してリクエストを送信できるようにする方法について説明します。
---

:::div{.info}
このガイドでは、静的 IP アドレスを使用して Cloud Run サービスから Cloud NAT を経由してリクエストを送信できるようにする方法について説明します。
:::

![Cloud NAT](/imgs/gifs/souls-cloud-nat.gif)

外向きの静的 IP アドレスの設定については、

[こちらのリンク](https://cloud.google.com/run/docs/configuring/static-outbound-ip?hl=ja) を参考にしてください。

システムを開発していくと、外部のシステムと連携しなくてはならない場面が多々あります。

相手側のシステムによっては送信元の IP を White リストにすべて登録する必要があることもあります。

この場合、単純に Worker をスケールさせた場合に、インスタンスが増えた分、外向きの IP も増えていくため、
すべての IP を相手側のシステムに登録することが困難な場合があります。

そんなときは VPC ネットワークを作成し、Cloud NAT を設定しましょう。

Cloud NAT を設定すると外部へ通信をする際に、スケーラブルなネットワークルーター を経由し、
同一の 固定 IP から通信を送ることができるようになります。

## VPC ネットワーク及び Cloud NAT の作成

VPC ネットワーク、ファイヤウォールの設定など、
ネットワークをスケールさせるために必要な設定をします。

```bash
$ souls gcloud compute setup_vpc_nat
```

このコマンドによって

- VPC ネットワークの作成
- Firewall TCP ルールの作成
- Firewall SSH ルールの作成
- ネットワークサブネット の作成
- VPC アクセスコネクター の作成
- Router の作成
- External IP の取得
- Cloud NAT の作成
- VPC IP アドレス範囲の作成
- VPC Peering Connector の作成
- Cloud SQL の Private IP の有効化
- GitHub Workflow の設定更新

を自動で行っています。

## デプロイ

デプロイをして、Cloud Run を更新します。

```bash
$ git add .
$ git commit -m "add cloud nat"
$ git push origin main
```
