# plone-first-timer-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that Auto-welcome bot for first-time contributors to Plone repos

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
# Run in dev mode 
npm run dev

## Docker

```sh
# 1. Build container
docker build -t plone-first-timer-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> plone-first-timer-bot
```
## Env secrets
All the secrets are mentioned in env.example file 

## Contributing

If you have suggestions for how plone-first-timer-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2026 hello-Rahul24
