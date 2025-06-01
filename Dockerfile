# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

# Copia arquivos do projeto
COPY . .

# Instala dependências e o TypeScript local (sem precisar do global)
RUN npm install

# Compila o código (usa o tsc local da node_modules)
RUN npx tsc

# Etapa 2: execução
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos compilados e dependências de produção
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
