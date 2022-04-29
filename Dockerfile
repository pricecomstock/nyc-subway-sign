FROM node:17-alpine

# Create app directory
WORKDIR /app

# Copy current directory in
COPY package*.json ./

# install everything
ENV NODE_ENV production
RUN npm install

COPY . .

ENV PORT 80

RUN npm run build
RUN npm run build-prod-server

EXPOSE 80

CMD ["npm", "run", "prod-server"]

# production stage
# FROM nginx:1.13.12-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]