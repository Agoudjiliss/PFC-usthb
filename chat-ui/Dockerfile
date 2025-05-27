FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installer les dépendances
RUN npm install -g pnpm
RUN pnpm install

# Copier le code source
COPY . .

# Construire l'application
RUN pnpm build

# Image de production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de build
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"] 