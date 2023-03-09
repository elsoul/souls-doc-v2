---
id: firebase-user-authentification
title: Firebase ユーザー登録・認証
description: ここでは Google Cloud Firebase ID トークンによるユーザー登録・ログイン認証方法について説明します。
---

:::div{.info}
ここでは Google Cloud Firebase ID トークンによるユーザー登録・ログイン認証方法について説明します。
:::

## Manager の追加

SOULs API では基本的な CRUD に関するファイルは

`app/graphql/mutations/base`

ディレクトリ内で定義されますが、CRUD 以外で、オブジェクトを操作するファイルを

`app/graphql/mutations/managers`

ディレクトリ内に定義します。

`souls g manager` コマンドを使って `$MANAGER_NAME_manager` ディレクトリを作成してみましょう。

```bash
$ souls g manager $MANAGER_NAME --mutation=MUTATION_NAME
```

`souls g manager` のあとに、`--mutation` オプションを指定して、Mutation ファイル名を定義します。

それでは `User` オブジェクトのログイン操作をする manager を作成してみます。

```bash
$ souls g manager user --mutation=sign_in_user
Created file! : ./app/graphql/mutations/managers/user_manager/sign_in_user.rb
🎉  Done!
```

## Firebase ID Token Authentification

SOULs フレームワークではログイン認証に Firebase ID トークン認証を使用しています。

Firebase ID トークンについては以下のリンクを参考にしてください。

[Firebase ID トークンを検証する](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

RubyGem [firebase-id-token](https://github.com/fschuindt/firebase_id_token)

## ユーザーログイン Mutation

Firebase Authentification を使って、

ユーザーが存在しなければ登録、ユーザーが存在すればログイン、

という処理を定義します。

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
        payload = souls_fb_auth(token: token)
        begin
          user = ::User.find_by_uid(payload["sub"])
          user.update(icon_url: payload["picture"], username: payload["name"])
          token_base = JsonWebToken.encode(user_id: user.id)
          {
            status: "ログイン成功!",
            username: user.username,
            token: token_base
          }
        rescue StandardError
          user =
            ::User.new(
              uid: payload["sub"],
              email: payload["email"],
              icon_url: payload["picture"],
              username: payload["name"],
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

SOULs API ではユーザーログイン認証に `souls_fb_auth` メソッドを使用しています。

`souls_fb_auth` メソッドは `Firebase` の ユーザー情報を含んだ `payload` を返却します。

ログイン、ユーザー登録が成功すると

`token` を返却します。

この `token` を以降使用して、ユーザー認証を行います。

ログインが成功すると、GraphQL の `context` にユーザー情報が格納されます。
