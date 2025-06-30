# �tape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Cr�e le dossier de travail
WORKDIR /app

# Copie les fichiers n�cessaires
COPY package*.json ./
RUN npm install

# Copie le reste de l'application
COPY . .

# Build l'app React
RUN npm run build

# �tape 2 : Serveur NGINX pour servir l'app React
FROM nginx:alpine

# Supprime les fichiers de configuration par d�faut
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers build de React dans le r�pertoire nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copie un fichier de configuration personnalis� si n�cessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose le port 80
EXPOSE 80

# Lance nginx en mode non-d�tach�
CMD ["nginx", "-g", "daemon off;"]
