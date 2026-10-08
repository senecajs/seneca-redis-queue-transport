# Run the tests locally

Goal: run `npm test` against a real Redis server.

1. Start Redis with Docker Compose. This starts the container
   `seneca-redis-queue-transport-redis` (image `redis:8.10`) on host port
   16383 and waits until `redis-cli ping` succeeds:

```sh
npm run services:up
```

2. Install and test (Node 24 or 22):

```sh
npm install
npm test
```

3. To use another Redis server, set the environment variables the tests
   read:

| Variable | Default | Meaning |
| -------- | ------- | ------- |
| `SENECA_TEST_REDIS_HOST` | `127.0.0.1` | Redis host. |
| `SENECA_TEST_REDIS_PORT` | `16383` | Redis port. |

```sh
SENECA_TEST_REDIS_PORT=6379 npm test
```

4. To test against another Seneca build, install it without saving, test,
   then restore the devDependency:

```sh
npm install --no-save /path/to/seneca-4.0.0.tgz
npm test
npm install
```

5. Stop and remove the container:

```sh
npm run services:down
```

`npm test` never starts Docker itself. In GitHub Actions the same Redis
image runs as a service container on the same port (see
[.patches](../../.patches/README.md)).
