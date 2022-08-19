# build stage
FROM node:18-alpine as build-stage
RUN apk add --no-cache python3 make g++
# RUN apk add --no-cache python3 py3-pip make g++
WORKDIR /app
COPY ./frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# production stage
FROM node:18-alpine 
WORKDIR /app
COPY --from=build-stage /app/frontend/dist /app/frontend/dist
COPY package.json /app
RUN npm install
COPY *.js /app
COPY index.html /app
COPY host.key /app
COPY host.key.pub /app
EXPOSE 80
CMD ["npm", "start"]