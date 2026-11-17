# Empty `GIT_SSL_CAINFO` breaks Git TLS

When Git reports `Problem with the SSL CA cert (path? access rights?)` and verbose output says `error reading ca cert file` with an empty filename, check whether `GIT_SSL_CAINFO` is set to an empty string. An empty environment variable can override a valid `http.sslCAInfo` repository setting.

Retry the Git operation with the variable removed for that process:

```sh
env -u GIT_SSL_CAINFO git ls-remote origin HEAD
env -u GIT_SSL_CAINFO git push origin <branch>
```

Keep TLS certificate verification enabled. Do not work around this by setting `http.sslVerify=false`.
