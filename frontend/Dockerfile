FROM node:18-alpine as builder

WORKDIR /app

COPY ./.eslintignore ./.prettierrc.json ./

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]