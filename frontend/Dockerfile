# Dockerfile - frontend
FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"] 

# RUN npm run build

# FROM nginx
# # EXPOSE 3000
# COPY --from=build /app/dist /var/www/html/
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]