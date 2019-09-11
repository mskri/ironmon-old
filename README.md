# Ironmon

Ironmon, a discord bot written with TypeScript.

## Development

### Setting up .env file

For the bot to work you need to setup `.env` file. File called `.env.example` contains example of the `.env` file you need to have. Copy it and rename it then to `.env`. Then change the values to your own ones.

| Key                   | Description                                            | Example value                                     |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| BOT_AUTH_TOKEN        | The secret bot authorization token issued by Discord\* | s6EefggqESBAF65fs2g1iaZlQyI6NQv7FgecxAcTUyVtYjTaD |
| OWNER_DISCORD_ID      | Your Discord user ID\*\*                               | 123456789012345678                                |
| GRAPHQL_ENDPOINT_HOST | URL to your postgraphile server                        | localhost                                         |
| DB_USER               | Database username                                      | username                                          |
| DB_PASSWORD           | Database password                                      | password                                          |
| DB_DATABASE           | Database name                                          | dbname                                            |
| DB_HOST               | Database host                                          | localhost                                         |
| DB_PORT               | Database port                                          | 5432                                              |

\* You can get the secret authorization by following this guide [Create a Discord bot under 15 minutes](https://thomlom.dev/create-a-discord-bot-under-15-minutes/). Getting the token start at "Get that token"-step.  
\*\* Find out how to get your Discord ID from the [official documentation](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

### Database

This project uses [postgraphile](https://www.graphile.org/postgraphile/) to run GraphQL server for basic database operations. PostgreSQL schema can be found in `database/db.sql`. Create new database and execute the `db.sql` on it.

To start the server locally use following command:

```bash
postgraphile -c postgres://<username>:<password>@<host>:<port>/<database> -a -j
```

### Develop locally

Install dependencies

```bash
npm install
```

Start bot in dev mode _(autorestarts on file changes)_

```bash
npm run dev
```

### Develop in docker

Start services in development mode, e.g. recompiles when code changes.

```bash
docker-compose -f docker-compose.development.yml up
```

Stop services

```bash
docker-compose -f docker-compose.development.yml stop
```

## Production

### Run production in docker

Start services in production mode

```bash
docker-compose -f -d docker-compose.production.yml up
```

Stop production services

```bash
docker-compose -f -d docker-compose.production.yml stop
```

## TODO backlog

Not in any particular order.

-   Move triggers/commands configurations to database
-   Separate triggers/commands from the bot's logic and produce simple "bot creation API". Benefit for this is for others wanting to create own bots with their commands. My own changes to commands specific for my needs should not affect others disruptively.
-   Improved logging for errors etc.
-   More robust CRUD API with GraphQL.

## Creating new commands

### Actions triggered by certain word(s) appearing on a message

TBA

### Actions triggered by adding or removing reactions

TBA

## Why TypeScript?

I wanted to try out TypeScript as I was hearing good things about it. Figured this would be a good project to try it out.

## Why GraphQL?

Same thing as with TypeScript. Have heard good things about it and wanted to give a first try using it.

## License

[MIT](https://github.com/mskri/ironmon/blob/master/LICENSE.md)
