FROM node:23-alpine

WORKDIR /app

#COPY package*.json ./
#
#RUN npm install
#
#COPY prisma ./prisma
#
#RUN npx prisma generate
#
#COPY . .

EXPOSE 4000

CMD ["npm", "run", "start-dev"]
