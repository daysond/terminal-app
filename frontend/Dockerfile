# Dockerfile - frontend
FROM node:18.14.0
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "dev"] 

# RUN npm run build

# FROM nginx
# # EXPOSE 3000
# COPY --from=build /app/dist /var/www/html/
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]