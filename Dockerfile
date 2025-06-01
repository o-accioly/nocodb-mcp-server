# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copia arquivos do projeto
COPY . .

# Instala dependências e compila com TypeScript
RUN npm install
RUN npx tsc

# Etapa 2: Execução
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Expõe a porta do MCP Server
EXPOSE 3000

# Inicia o servidor MCP
CMD ["node", "dist/start.js"]
