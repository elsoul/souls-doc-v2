---
id: create-go-cloud-functions
title: Go ランタイム の Cloud Functions を作成する
description: ここでは Go ランタイム の Cloud Functions を作成する方法について説明します。
---

:::div{.info}
ここでは Go ランタイム の Cloud Functions を作成する方法について説明します。
:::

## SOULs Go ランタイム Cloud Functions を作成する

`souls create functions` コマンドを使って `functions` を作成します。

```sh
$ souls create functions method1
✓ Created file ./apps/cf-go116-method1/function.go
✓ Created file ./apps/cf-go116-method1/go.mod
✓ Created file ./apps/cf-go116-method1/.env.yaml
```

## SOULs Go ランタイム Cloud Functions のディレクトリ構造

```
apps
├── cf-go116-method1
│   ├── function.go
│   ├── mod.go
│   ├── .env.yaml
```

`function.go` にメイン関数を定義します。

```go:function.go
// Package p contains an HTTP Cloud Function.
package p

import (
  "encoding/json"
  "fmt"
  "html"
  "io"
  "log"
  "net/http"
)

// HelloWorld prints the JSON encoded "message" field in the body
// of the request or "Hello, World!" if there isn't one.
func cf_go116_method3(w http.ResponseWriter, r *http.Request) {
  var d struct {
    Message string `json:"message"`
  }

  if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
    switch err {
    case io.EOF:
      fmt.Fprint(w, "Hello World!")
      return
    default:
      log.Printf("json.NewDecoder: %v", err)
      http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
      return
    }
  }

  if d.Message == "" {
    fmt.Fprint(w, "Hello World!")
    return
  }
  fmt.Fprint(w, html.EscapeString(d.Message))
}
```

## SOULs Functions をローカルで実行する

`functions-framework` をインストールします。

```sh
$ go install github.com/GoogleCloudPlatform/functions-framework-go/funcframework
```

:::div{.warning}
注: まず、[Functions Framework for Go](https://github.com/GoogleCloudPlatform/functions-framework-go#quickstart-hello-world-on-your-local-machine) サイトの説明に沿って cmd/main.go ファイルを作成します。
:::

```sh
cd cmd
go build
./cmd
```

それでは下のリンクにアクセスして `GET` の Functions を呼び出してみます。

[http://localhost:8080/souls-functions-get](http://localhost:8080/souls-functions-get)

```
Hello World!
```

とレスポンスが返却されれば成功です。

## SOULs Go ランタイム Cloud Functions のデプロイ

SOULs functions コマンドを使ってデプロイします。

```sh
$ cd apps/cf-go116-method1
$ souls functions deploy
```

## SOULs Functions の URL を確認する

SOULs functions コマンドを使って確認します。

```sh
$ souls functions url
```

## すべての SOULs Functions の URL を確認する

SOULs functions コマンドを使って確認します。

```sh
$ souls functions all_url
```

## SOULs Functions を削除する

SOULs functions コマンドを使って削除します。

```sh
$ souls functions delete ${functions_name}
```
