# Étape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
RUN npm install

# Copie le reste de l'application
COPY . .

# Build l'app React
RUN npm run build

# Étape 2 : Serveur NGINX pour servir l'app React
FROM nginx:alpine

# Supprime les fichiers de configuration par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers build de React dans le répertoire nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copie un fichier de configuration personnalisé si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose le port 80
EXPOSE 80

# Lance nginx en mode non-détaché
CMD ["nginx", "-g", "daemon off;"]
