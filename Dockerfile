# Étape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Définir le dossier de travail absolu
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json (si présent)
COPY package*.json .


RUN ls -l /app

# Nettoyer le cache npm et installer les dépendances
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copier tout le reste du code source
COPY . .

# Construire l'application React en mode production
RUN npm run build

# Étape 2 : Serveur NGINX pour servir l'application React
FROM nginx:alpine

# Supprimer le contenu par défaut de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copier le build React depuis l'étape builder vers le dossier NGINX
COPY --from=builder /app/build /usr/share/nginx/html

# Copier un fichier nginx.conf personnalisé si besoin (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Lancer NGINX au premier plan (non-détaché)
CMD ["nginx", "-g", "daemon off;"]
