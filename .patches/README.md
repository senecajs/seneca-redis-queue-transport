# Patches

Changes to `.github/workflows/` that could not be pushed from the session
that prepared this branch (pushing workflow files needs the GitHub
`workflow` scope). Apply them on top of this branch with:

```sh
git am .patches/*.patch
```

| Patch | What it does |
| ----- | ------------ |
| `0001-ci-build-redis.patch` | Adds `.github/workflows/build.yml`: Node 24.x and 22.x on `ubuntu-latest`, with a `redis:8.10` service container on host port 16383 (health check `redis-cli ping`), the same port and `SENECA_TEST_REDIS_HOST` / `SENECA_TEST_REDIS_PORT` values that `docker-compose.yml` and the tests use. |

Once applied, delete this folder.
