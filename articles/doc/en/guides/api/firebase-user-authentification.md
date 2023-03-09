---
id: firebase-user-authentification
title: Firebase user registration / authentication
description: This section describes the user registration / login authentication method using the Google Cloud Firebase ID token.
---

This section describes the user registration / login authentication method using the Google Cloud Firebase ID token.

## Add Manager

In the SOULs API, basic CRUD files are

`app/graphql/mutations/base`

Files that are defined in the directory, but that operate on objects other than CRUD

`app/graphql/mutations/managers`

Define it in the directory.

Let's create `$MANAGER_NAME_manager` directory using the `souls g manager`

```bash
$ souls g manager $MANAGER_NAME --mutation=MUTATION_NAME
```

`souls g manager` , `--mutation` option to define the Mutation filename.

Now let's create a manager that logs in to the `User`

```bash
$ souls g manager user --mutation=sign_in_user
Created file! : ./app/graphql/mutations/managers/user_manager/sign_in_user.rb
🎉  Done!
```

## Firebase ID Token Authentification

The SOULs framework uses Firebase ID token authentication for login authentication.

Please refer to the link below for Firebase ID tokens.

[Validate your Firebase ID token](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

RubyGem [firebase-id-token](https://github.com/fschuindt/firebase_id_token)

## Configuration

In the API `config` directory,

`firebase-id-token.rb` .

`your-firebase-project-id`

Enter your Firebase ID in.

```ruby:apps/api/config/firebase_id_token.rb
FirebaseIdToken.configure do |config|
  config.project_ids = ['your-firebase-project-id']
end
```

## User login Mutation

With Firebase Authentification,

Register if the user does not exist, log in if the user exists,

Define the process.

```ruby:app/graphql/mutations/managers/user_manager/sign_in_user.rb
module Mutations
  module Managers::UserManager
    class SignInUser < BaseMutation
      field :status, String, null: false
      field :token, String, null: true
      field :user_role, String, null: true
      field :username, String, null: true
      argument :token, String, required: false

      def resolve(token:)
        fb_auth(token: token)
        begin
          user = ::User.find_by_uid(@payload["sub"])
          user.update(icon_url: @payload["picture"], username: @payload["name"])
          token_base = JsonWebToken.encode(user_id: user.id)
          {
            status: "ログイン成功!",
            username: user.username,
            token: token_base
          }
        rescue StandardError
          user =
            ::User.new(
              uid: @payload["sub"],
              email: @payload["email"],
              icon_url: @payload["picture"],
              username: @payload["name"],
              user_role: 4
            )
          if user.save
            token = JsonWebToken.encode(user_id: user.id)
            {
              status: "ユーザー新規登録完了!",
              username: user.username,
              token: token,
              user_role: user.user_role
            }
          else
            { status: user.errors.full_messages }
          end
        end
      end
    end
  end
end
```

The SOULs API uses the `fb_auth` method for user login authentication.

When the request is sent and goes inside `resolve` `fb_auth` method is executed first.

If login and user registration are successful

Return the `token`

We `token` to authenticate the user.

```ruby:apps/api/app/graphql/mutations/base_mutation.rb
module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

    def fb_auth(token:)
      FirebaseIdToken::Certificates.request!
      sleep(3) if ENV["RACK_ENV"] == "development"
      @payload = FirebaseIdToken::Signature.verify(token)
      raise(ArgumentError, "Invalid or Missing Token") if @payload.blank?

      @payload
    end
,
,
```

## Use GraphQL Context

The SOULs API stores user information in GraphQL context after login.

GraphQL endpoints are defined in the `app.rb`

`token` obtained earlier in the header `HTTP_AUTHORIZATION` and send the request.

```ruby:apps/api/app.rb
class SOULsApi < Sinatra::Base
  ## 中略
  post endpoint do
    token = request.env["HTTP_AUTHORIZATION"].split("Bearer ")[1] if request.env["HTTP_AUTHORIZATION"]

    user = token ? login_auth(token: token) : nil
    context = { user: user }
    result = SOULsApiSchema.execute(params[:query], variables: params[:variables], context: context)
    json(result)
  rescue StandardError => e
    message = { error: e }
    json(message)
  end

  def login_auth(token:)
    decoded_token = JsonWebToken.decode(token)
    user_id = decoded_token[:user_id]
    user = User.find(user_id)
    raise(StandardError, "Invalid or Missing Token") if user.blank?

    user
  rescue StandardError => e
    message = { error: e }
    json(message)
  end
```

If the login is successful, the user information will be stored in the `context`
