# Imagem base com Node e npm
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos do projeto
COPY . .

# Instala dependências e TypeScript
RUN npm install && npm install -g typescript

# Compila o código TypeScript para JavaScript
RUN tsc

# Expõe a porta padrão do MCP
EXPOSE 3000

# Roda o código compilado
CMD ["node", "dist/index.js"]
