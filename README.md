# Dinivas

[![Build Status](https://travis-ci.org/dinivas/dinivas.svg?branch=master)](https://travis-ci.org/dinivas/dinivas)


AWS, GCP alternative on premise. Dinivas manage your private Cloud (OpenStack) infrastructure by providing many features base on popular Open Source projects [https://dinivas.github.io/dinivas](https://dinivas.github.io/dinivas)

## Why Dinivas?

Many company moved or have planned to move in the public Cloud, Major cloud provier (AWS, GCP, Azure) provide many robust services and could be a very good choice. Nevertheless the downside with major public cloud provider is your are lock in their own solution (RDS, Cloud PubSub...)

Dinivas firts interest is to give the choice to company that wants to keep their stack independent of the public cloud custom solutions. We are talking here about **Cloud native** vs **Cloud Agnostic**.

Some companies also can't just go to public Cloud due to data governance and many other reasons. They usually have their own private Cloud (Openstack). **Dinivas** could provide them the *AWS like* solution on premise (Self service, managed database, managed mesaging solutions...).

**Dinivas** is the on premise solution to get quickly a full managed services (PAAS) based on most popular Opensouce solution, Therefore you will not be *locked* to the Cloud provider.

## Status

    Dinivas is still under developement and therefore not ready at all for use. You may watch the repo to keep touched about the evolution.

## Quick Start & Documentation

Technical documentation can be found [here](https://dinivas.github.io/dinivas)

## Quick start (Docker compose)

### Start Api server and console using Docker-compose

```
docker-compose up -d
```

### Keycloak admin

- Connect to Keycloak Admin console [http://localhost:8085](http://localhost:8085)
- Got to `Clients` > `dinivas-api` > `Credentials` and ensure the Secret is well generated and equals to the secret in the configuration


## Quick start without Docker

### Start Keycloak & Databases

    docker-compose -p dinivas up -d

### Start Server API

    ng serve api

### Start Ansible Galaxy Server

From project Ansible-Galaxy, use Vscode debug launcher

### Start Dinivas console

    ng serve

### 

## Contributing

See the [contribution guide](./CONTRIBUTING.md).
