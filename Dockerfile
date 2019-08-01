FROM node:10
COPY ./ /app
WORKDIR /app
RUN npm install
RUN npx sequelize-cli db:migrate --env production
EXPOSE 3000
CMD [ "node", "./bin/www" ]
