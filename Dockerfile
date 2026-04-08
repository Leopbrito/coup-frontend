# Estágio 1: Build da aplicação (Node)
FROM node:20-alpine as build-stage

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências da aplicação
RUN npm ci

# Copia o restante do código da aplicação
COPY . .

# Faz o build da aplicação para produção
RUN npm run build

# Estágio 2: Servidor Web (Nginx) para servir os arquivos estáticos
FROM nginx:alpine as production-stage

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no estágio de build para o diretório padrão do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o servidor do Nginx
CMD ["nginx", "-g", "daemon off;"]
