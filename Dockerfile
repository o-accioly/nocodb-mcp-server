# Usa imagem oficial Node.js
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências
RUN npm install

# Expõe a porta padrão do MCP
EXPOSE 3000

# Comando para iniciar o MCP Server
CMD ["node", "server.js"]
