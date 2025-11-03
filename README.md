## Local Development

Bring up mysql:

```bash
docker compose up
```

Run the development server:

```bash
npm run dev
```

## Deployment

1. Build a static version of the website: `npm run build`
2. Bring the live site into maintenance mode and deploy the code `bin/deploy.sh` site is automatically brought back online