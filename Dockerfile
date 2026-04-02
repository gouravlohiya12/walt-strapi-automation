FROM node:20-bookworm

RUN apt-get update && apt-get install -y libatomic1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY strapi/package.json ./

RUN npm install

COPY strapi/ ./

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
