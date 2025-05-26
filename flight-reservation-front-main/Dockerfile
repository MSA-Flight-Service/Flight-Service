# ./front/Dockerfile

# 1단계: build (Vite + Node)
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: serve (nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
