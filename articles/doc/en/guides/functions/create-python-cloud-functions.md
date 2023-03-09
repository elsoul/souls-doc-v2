---
id: create-python-cloud-functions
title: Create Cloud Functions for Python runtime
description: This section describes how to create Cloud Functions for the Python runtime.
---

This section describes how to create Cloud Functions for the Python runtime.

## Create SOULs Functions

Create `functions` using the `souls create functions` command.

```sh
$ souls create functions method1
✓ Created file ./apps/cf_python39_method1/main.py
✓ Created file ./apps/cf_python39_method1/requirements.txt
✓ Created file ./apps/cf_python39_method1/.env.yaml
```

## Directory structure of SOULs Nodejs Cloud Functions

```
apps
├── cf_python39_method1
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.yaml
```

Define the main function in `main.py`

main.py

```python:main.py
def cf-python39-method2(request):
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

## Run SOULs Python Cloud Functions locally

Install `functions-framework` .

```sh
pip install functions-framework
```

```sh
functions_framework --target=cf-python39-method2
```

Now access the link below and try calling `GET` Functions.

[http://localhost:8080/cf-python39-method2](http://localhost:8080/cf-python39-method2)

```
Hello World!
```

If the response is returned, it is successful.

## Deploy SOULs Nodejs Cloud Functions

Deploy using the SOULs functions command.

```sh
$ cd apps/cf_python39_method1
$ souls functions deploy
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
