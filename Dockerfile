# �tape 1 : Build de l'application React
FROM node:20-alpine AS builder

# D�finir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers n�cessaires pour installer les d�pendances
COPY package*.json ./

# Installer les d�pendances (npm ci = build reproductible, plus rapide)
RUN npm ci --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Construire l'application React pour la production
RUN npm run build

# �tape 2 : Serveur NGINX pour servir l'application React
FROM nginx:alpine

# Supprimer le contenu par d�faut de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copier le build React depuis l'�tape builder
COPY --from=builder /app/build /usr/share/nginx/html

# Ajouter un fichier de config Nginx pour g�rer React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajout d'un Healthcheck pour Render/Kubernetes
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget --spider -q http://localhost:80/ || exit 1

# Exposer le port 80
EXPOSE 80

# Lancer NGINX en mode non d�tach�
CMD ["nginx", "-g", "daemon off;"]
