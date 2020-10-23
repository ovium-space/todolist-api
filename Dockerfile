FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm install --save
CMD ["node", "api.js"]