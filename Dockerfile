# Etapa 1: Construcción de la app
FROM node:20.19.0 as builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto de archivos de la app
COPY . .

# Construye la app para producción
RUN npm run build

# Etapa 2: Servir la app usando 'serve'
FROM node:20.19.0-slim

# Instala el servidor estático 'serve'
RUN npm install -g serve

# Crea un directorio para la app
WORKDIR /app

# Copia la build desde la etapa anterior
COPY --from=builder /app/build ./build

# Expone el puerto 3000
EXPOSE 3001

# Comando por defecto
CMD ["serve", "-s", "build", "-l", "3000"]
