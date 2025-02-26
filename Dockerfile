# 1️⃣ Etapa de Build do Frontend
FROM node:20 AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos essenciais
COPY package.json package-lock.json ./
RUN npm install

# Copiar o código-fonte
COPY . .

# ✅ Garantir que a variável VITE_API_BASE_URL seja passada corretamente para o Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 🔹 Cria um .env para o Vite reconhecer
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env.production

# 🔹 Exibe o .env para depuração
RUN cat .env.production

# ✅ Executa o build do frontend com a variável corretamente aplicada
RUN npm run build

# 2️⃣ Configuração do Nginx
FROM nginx:stable-alpine

# Definir o diretório de trabalho para o Nginx
WORKDIR /usr/share/nginx/html

# Copiar os arquivos do frontend gerados na etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração do Nginx
COPY ./nginx/templates/nginx.conf.template /etc/nginx/templates/nginx.conf.template

# ✅ Substitui a variável de ambiente no Nginx (usando o template de configuração)
CMD ["/bin/sh", "-c", "envsubst '$NGINX_PORT $VITE_API_BASE_URL' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
