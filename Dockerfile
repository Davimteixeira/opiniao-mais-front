# 1. Build da aplicação React
FROM node:20 AS build
WORKDIR /app

# Copia os arquivos essenciais
COPY package.json package-lock.json ./
RUN npm install

# Copia o código-fonte
COPY . .

# Definir variáveis de ambiente no build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Garante que a pasta dist seja criada
RUN npm run build && ls -la /app/dist

# 2. Configuração do Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copia a configuração do Nginx
COPY .nginx/templates/nginx.conf.template /etc/nginx/templates/nginx.conf.template 

# Verifica se a dist existe antes de copiar
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["/bin/sh", "-c", "envsubst '$NGINX_PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
