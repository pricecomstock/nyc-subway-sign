FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy current directory in
COPY package*.json ./

# install everything
RUN npm install

COPY . .

ENV PORT 80
ENV NODE_ENV production

RUN npm run build
RUN npm run build-prod-server
RUN npm run prod-server

EXPOSE 80

CMD ["node", "./server/server.js"]

# production stage
# FROM nginx:1.13.12-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]