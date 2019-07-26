FROM node:10
COPY ./ /app
RUN mkdir /certs
COPY ./certs /certs
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD [ "node", "./bin/www" ]
