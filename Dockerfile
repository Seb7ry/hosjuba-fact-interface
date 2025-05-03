# Etapa de build
FROM node:20.19.0 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa final: Servir la app
FROM node:20.19.0-slim

# Instalar 'serve' para servir el frontend
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/build ./build

# El puerto que expone tu frontend (Render espera 3000 por defecto)
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
