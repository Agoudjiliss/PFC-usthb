FROM rasa/rasa:3.6.2

# Définir les variables d'environnement
ENV PYTHONUNBUFFERED=1

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration Rasa
COPY config.yml .
COPY domain.yml .
COPY data/ data/
COPY credentials.yml .
COPY endpoints.yml .

# Exposer les ports
EXPOSE 5005

# Commande de démarrage
CMD ["run", "--enable-api", "--cors", "*"] 