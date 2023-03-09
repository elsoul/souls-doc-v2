---
id: souls-cli-server
title: SOULs Server
description: SOULs Server command is an auxiliary tool for building API server
---

Launch the SOULs application with the `souls server`

## souls help server

```bash
$ souls help server
Usage:
  souls server

Options:
  [--all], [--no-all]  # Run All API & Workers

Run SOULs APP
```

## server

Launch the app using Foreman.

### souls s

```bash
$ souls s
```

or

```bash
$ souls server
```

```ruby
 system( "foreman start -f Procfile.dev" )
```

### souls server --all option

Start the API and all Workers.

```bash
$ souls s --all
```

or

```bash
$ souls server --all
```

```ruby
Dir.chdir(SOULs.get_mother_path.to_s) do
  system("foreman start -f Procfile.dev")
end
```
