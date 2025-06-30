# Étape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Crée le dossier de travail (utilise un chemin absolu)
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./

# Nettoie le cache npm et installe les dépendances
RUN npm cache clean --force
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

# Expose le port 80
EXPOSE 80

# Lance nginx en mode non-détaché
CMD ["nginx", "-g", "daemon off;"]
