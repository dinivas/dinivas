# Dinivas

[![pipeline status](https://gitlab.com/kreezus/dinivas/dinivas/badges/master/pipeline.svg)](https://gitlab.com/kreezus/dinivas/dinivas/-/commits/master)


AWS, GCP alternative on premise. Dinivas manage your private Cloud (OpenStack) infrastructure by providing many features base on popular Open Source projects [https://dinivas.github.io/dinivas](https://dinivas.github.io/dinivas)

## Why Dinivas?

Many company moved or have planned to move in the public Cloud, Major cloud provier (AWS, GCP, Azure) provide many robust services and could be a very good choice. Nevertheless the downside with major public cloud provider is your are lock in their own solution (RDS, Cloud PubSub...)

Dinivas firts interest is to give the choice to company that wants to keep their stack independent of the public cloud custom solutions. We are talking here about **Cloud native** vs **Cloud Agnostic**.

Some companies also can't just go to public Cloud due to data governance and many other reasons. They usually have their own private Cloud (Openstack). **Dinivas** could provide them the *AWS like* solution on premise (Self service, managed database, managed mesaging solutions...).

**Dinivas** is the on premise solution to get quickly a full managed services (PAAS) based on most popular Opensouce solution, Therefore you will not be *locked* to the Cloud provider.

## Status

    Dinivas is still under developement and therefore not ready at all for use in production. You may watch the repo to keep touched about the evolution.

## Quick Start & Documentation

Technical documentation can be found [here](https://dinivas.github.io/dinivas)

## Quick start using Docker compose

### All in one

With this single command you will be able to start all components and test `AWESOME` Dinivas

```
  # WARNING: Keycloak should be accessible with the same URL (inside and outside os the container).
  # You should execute the following to do so:

  #/bin/sh
  sudo echo "127.0.0.1       keycloak" >> /etc/hosts
```

- Start all components

```sh
docker-compose -p dinivas up -d
```
- Access to Dinivas console: [http://localhost:8085](http://localhost:8085)
- You should be redirect to Keycloak Login page. Use `devops/password` to log in.

### Keycloak admin

You can connect to Keycloak Admin console here: [http://localhost:8080](http://localhost:8080)



## For developpement purpose

### Start all required components using docker-compose

This command will start:
- __Keycloak__ and his PosgrSQL database
- __Redis__ used with __Bull Queue__ for asynchrone Jobs
- __Guacd__ used for remote SSH acces to bastion host deployed by __Dinivas__

```sh
docker-compose -p dinivas-dev -f docker-compose.dev.yml up -d
```

### Install NPM packages

```sh
npm install
```

### Start API Server

```sh
ng serve api
```

### Start Dinivas console

```sh
ng serve
```

###

### Start Ansible Galaxy Server

From project Ansible-Galaxy, use Vscode debug launcher

## Contributing

See the [contribution guide](./CONTRIBUTING.md).
