# Ironmon

Ironmon, a discord bot written with TypeScript.

## Development

### Local development

#### Setting up .env file

For the bot tos start up properly you need to have `.env` file. Look into `.env.example`. Copy it and rename it then to `.env`.

| Key         | Description                                            | Example value                                     |
| ----------- | ------------------------------------------------------ | ------------------------------------------------- |
| AUTH_TOKEN  | The secret bot authorization token issued by Discord\* | s6EefggqESBAF65fs2g1iaZlQyI6NQv7FgecxAcTUyVtYjTaD |
| OWNER_ID    | Your Discord user ID\*\*                               | 123456789012345678                                |
| GRAPHQL_URL | URL to your Postgraphile server                        | http://localhost:5000                             |

\* You can get the secret authorization by following this, [Create a Discord bot under 15 minutes](https://thomlom.dev/create-a-discord-bot-under-15-minutes/), guide from the "Get that token"-step.  
\*\* Find out how to get your Discord ID from the [official documentation](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

#### Database

This project uses [Postgraphile](https://www.graphile.org/postgraphile/) to run GraphQL server for basic database operations. PostgreSQL schema can be found in `database/db.sql`. Create new database and execute the `db.sql` on it.

To start the server locally run the server with

```bash
postgraphile -c postgres://<username>:<password>@localhost:5432/<database> -a -j
```

_Remember to point the `GRAPHQL_URL` in the `.env` file to localhost and correct database!_

#### Running the bot

Install dependencies

```bash
npm install
```

Start bot in dev mode

```bash
npm run dev
```

### Running in production

#### Locally

```bash
npm run prod
```

#### With PM2

TBA

## Creating new triggers

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
