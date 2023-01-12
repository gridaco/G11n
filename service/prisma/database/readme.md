# local mongodb dev container

## `start:db`

```bash
# on project root, run
yarn start:db
```

Note: this will start a docker container. If you want to stop it, run

```bash
docker stop g11n-services-mongo
docker stop g11n-services-mongo-express
```

## Usage

**Admin**

- http://localhost:8081/

**Connection string (Mongodb compass & for Prisma)**

```
mongodb://root:password@localhost:27017/main?authSource=admin
```

## References

- https://hub.docker.com/_/mongo
