FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm config set strict-ssl false
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]