---
id: create-go-cloud-functions
title: Create Cloud Functions for Go runtime
description: This section describes how to create Cloud Functions for the Go runtime.
---

This section describes how to create Cloud Functions for the Go runtime.

## Create SOULs Go runtime Cloud Functions

Create `functions` using the `souls create functions` command.

```sh
$ souls create functions method1
✓ Created file ./apps/cf-go116-method1/function.go
✓ Created file ./apps/cf-go116-method1/go.mod
✓ Created file ./apps/cf-go116-method1/.env.yaml
```

## SOULs Go Runtime Cloud Functions directory structure

```
apps
├── cf-go116-method1
│   ├── function.go
│   ├── mod.go
│   ├── .env.yaml
```

Define the main `function.go` in function.go.

function.go

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

## Run SOULs Functions locally

Install `functions-framework` .

```sh
$ go install github.com/GoogleCloudPlatform/functions-framework-go/funcframework
```

Note: First, create the cmd / main.go file as described on the [Functions Framework for Go](https://github.com/GoogleCloudPlatform/functions-framework-go#quickstart-hello-world-on-your-local-machine) site.

```sh
cd cmd
go build
./cmd
```

Now access the link below and try calling `GET` Functions.

[http://localhost:8080/souls-functions-get](http://localhost:8080/souls-functions-get)

```
Hello World!
```

If the response is returned, it is successful.

## Deploy SOULs Go runtime Cloud Functions

Deploy using the SOULs functions command.

```sh
$ cd apps/cf-go116-method1 $ souls functions deploy
```

## Check the URL of SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions url
```

## Check the URLs of all SOULs Functions

Check using the SOULs functions command.

```sh
$ souls functions all_url
```
