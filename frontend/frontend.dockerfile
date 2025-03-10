FROM node:23-alpine AS base

WORKDIR /app
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "run", "dev"]