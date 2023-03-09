---
id: create-python-cloud-functions
title: Python ランタイム の Cloud Functions を作成する
description: ここでは Python ランタイム の Cloud Functions を作成する方法について説明します。
---

:::div{.info}
ここでは Python ランタイム の Cloud Functions を作成する方法について説明します。
:::

## SOULs Functions を作成する

`souls create functions` コマンドを使って `functions` を作成します。

```sh
$ souls create functions method1
✓ Created file ./apps/cf-python39-method1/main.py
✓ Created file ./apps/cf-python39-method1/requirements.txt
✓ Created file ./apps/cf-python39-method1/.env.yaml
```

## SOULs Nodejs Cloud Functions のディレクトリ構造

```
apps
├── cf-python39-method1
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.yaml
```

`main.py` にメイン関数を定義します。

```python:main.py
def cf_python39_method1(request):
  """Responds to any HTTP request.
  Args:
      request (flask.Request): HTTP request object.
  Returns:
      The response text or any set of values that can be turned into a
      Response object using
      `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
  """
  request_json = request.get_json()
  if request.args and 'message' in request.args:
      return request.args.get('message')
  elif request_json and 'message' in request_json:
      return request_json['message']
  else:
      return f'Hello World!'
```

## SOULs Python Cloud Functions をローカルで実行する

`functions-framework` をインストールします。

```sh
pip install functions-framework
```

```sh
functions_framework --target=cf-python39-method2
```

それでは下のリンクにアクセスして `GET` の Functions を呼び出してみます。

[http://localhost:8080/cf-python39-method2](http://localhost:8080/cf-python39-method2)

```
Hello World!
```

とレスポンスが返却されれば成功です。

## SOULs Nodejs Cloud Functions のデプロイ

SOULs functions コマンドを使ってデプロイします。

```sh
$ cd apps/cf-python39-method1
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
