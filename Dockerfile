# 1️⃣ Etapa de Build do Frontend
FROM node:20 AS build
WORKDIR /app

# Copia os arquivos essenciais para garantir que as dependências sejam instaladas
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps # Usando a flag para evitar erros de peer dependencies, se necessário

# Copia o código-fonte
COPY . .

# Garante que a variável seja passada corretamente para o Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Cria o arquivo .env para o Vite reconhecer e evita problemas no ambiente de build
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env.production

# Executa o build do frontend com a variável corretamente aplicada
RUN npm run build

# 2️⃣ Configuração do Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do frontend gerados na etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Substitui a variável de ambiente no Nginx (usando o template de configuração, se necessário)
CMD ["/bin/sh", "-c", "envsubst '$NGINX_PORT $VITE_API_BASE_URL' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

# Expõe a porta 80 para acesso HTTP
EXPOSE 80
