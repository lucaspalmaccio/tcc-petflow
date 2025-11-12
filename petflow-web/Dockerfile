# Etapa 1: Build da aplicação Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: Servir via Nginx
FROM nginx:alpine

# 1. Copia o CONTEÚDO da pasta de build
COPY --from=build /app/dist/petflow-web/ /usr/share/nginx/html

# 2. Copia configuração do Nginx (CORRIGIDO: conf.d com ponto)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# O Nginx escuta na porta 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]