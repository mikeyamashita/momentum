FROM node:alpine
WORKDIR /app/
COPY package.json /app
RUN npm install -g ionic
RUN npm install
COPY ./ /app/

CMD ["npm", "run", "external"]