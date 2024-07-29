# Online Chess Game API

## Introduction

The Online Chess Game API allows players to join chess games, make moves, invite other players to join games, and manage their ongoing matches. The API supports real-time interactions through WebSockets for instant game updates and HTTP endpoints for managing game states. Players can authenticate, manage their profiles, and track their game progress through this API.

## Table of Contents

- [Data Models](#data-models)
- [Documentation](#documentation)
- [Usage](#usage)
- [Contributing](#contributing)

## Data Models

![Data Models](assets/prisma-erd.svg)

## Documentation

For a detailed API documentation for all API endpoints, please refer to this [postman collection](https://documenter.getpostman.com/view/35575927/2sA3kaDKpx). Swagger API documentation is also available at `http://localhost:3000/api-docs` when you run the server correctly. You can also find documentation for all websocket events [here](docs/Documentation%20for%20Socket.IO%20Events.md) the server emits and listens to.

## Usage

If you want to run the server locally and just use it for testing purposes or for building a client, you can follow these steps:

First of all, you need to have docker installed on your machine. You can download it from [here](https://www.docker.com/products/docker-desktop). You can check if docker is installed by running the following command:

```bash
docker -v
```

unless you prefer not to use docker, you can follow the steps in the [Contributing](#contributing) section.

After you have docker installed, you can go on with these steps:

1. Clone the repository

```bash
git clone https://github.com/Mohab96/online-chess-game.git
```

2. Change directory to the project directory

```bash
cd online-chess-game
```

3. Copy the `.env.example` file to `.env`

```bash
cpy .env.example .env
```

4. Start filling the environment variables in the `.env` file, you can go with the default values for testing purposes except for `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD` which you need to fill with your email and password to be able to send emails.

```
POSTGRES_USER=postgres # name of the postgres user
POSTGRES_PASSWORD=551258 # password for the postgres user
POSTGRES_DB=chess # name of the database
JWT_SECRET=secret # secret token used in validating JWTs
NODEMAILER_EMAIL=email used by nodemailer
NODEMAILER_PASSWORD=password used by nodemailer
```

5. Run the following command to start the express server, PostgreSQL database, Prisma client, and the Redis server

If it is the fisrt time, you need to run the container with the `--build` flag to build the image first.

```bash
docker-compose up --build
```

If you have already built the image, you can run the container without the `--build` flag.

```bash
docker-compose up
```

You can check whether the image is built or not by running the following command:

```bash
docker images
```

You should see `mohabyaser/online_chess_game_api` in the list of images.

6. After the server is up and running, you can access the API at `http://localhost:3000`.

You can try these endpoints to check if the server is running correctly:

1. `http://localhost:3000/api/health` to check the health of the server
2. `http://localhost:3000/api-docs` to access the Swagger documentation

3. To stop the server, you can run the following command:

```bash
docker-compose down
```

## Contributing

If you are interested in contributing to this project, you can follow along with these steps:

Requirements:

- Node.js
- npm
- PostgreSQL
- Redis

1. Fork the repository

2. Clone the repository

```bash
git clone https://github.com/<your-github-username>/online-chess-game.git
```

3. Change directory to the project directory

```bash
cd online-chess-game
```

4. Install the dependencies

```bash
npm install
```

5. Copy the `.env.example` file to `.env`

```bash
cpy .env.example .env
```

6. Start filling the environment variables in the `.env` file, you can go with the default values for testing purposes except for `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD` which you need to fill with your email and password to be able to send emails.

```
POSTGRES_USER=postgres # name of the postgres user
POSTGRES_PASSWORD=551258 # password for the postgres user
POSTGRES_DB=chess # name of the database
JWT_SECRET=secret # secret token used in validating JWTs
NODEMAILER_EMAIL=email used by nodemailer
NODEMAILER_PASSWORD=password used by nodemailer
```

7. Start the PostgreSQL database and Redis server
8. Run the following command to start the express server

```bash
npm start
```

9. After the server is up and running, you can access the API at `http://localhost:3000`.
