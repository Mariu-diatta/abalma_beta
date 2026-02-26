# Étape 1 : Build de l'application React
FROM node:20-alpine AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances (npm ci = build reproductible, plus rapide)
RUN npm ci --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Construire l'application React pour la production
RUN npm run build

# Étape 2 : Serveur NGINX pour servir l'application React
FROM nginx:alpine

# Supprimer le contenu par défaut de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copier le build React depuis l'étape builder
COPY --from=builder /app/build /usr/share/nginx/html

# Ajouter un fichier de config Nginx pour gérer React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajout d'un Healthcheck pour Render/Kubernetes
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget --spider -q http://localhost:80/ || exit 1

# Exposer le port 80
EXPOSE 80

# Lancer NGINX en mode non détaché
CMD ["nginx", "-g", "daemon off;"]
