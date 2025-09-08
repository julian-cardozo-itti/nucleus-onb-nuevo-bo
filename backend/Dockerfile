# Usar una imagen base de Node.js ligera
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package.json ./
COPY package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Crear el directorio para los datos si no existe
RUN mkdir -p /app/data

# Exponer el puerto en el que se ejecutará el servidor
EXPOSE 3001

# Comando para iniciar el servidor
CMD [ "node", "server.js" ]
