# 1️⃣ Etapa de Build do Frontend
FROM node:20 AS build
WORKDIR /app

# Copia os arquivos essenciais
COPY package.json package-lock.json ./
RUN npm install

# Copia o código-fonte
COPY . .

# ✅ Garante que a variável seja passada corretamente para o Vite
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
WORKDIR /usr/share/nginx/html

# Copia a configuração do Nginx
COPY .nginx/templates/nginx.conf.template /etc/nginx/templates/nginx.conf.template 

# Copia os arquivos do frontend gerados na etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Substitui a variável de ambiente no Nginx
CMD ["/bin/sh", "-c", "envsubst '$NGINX_PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
