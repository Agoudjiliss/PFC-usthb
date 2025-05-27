FROM python:3.9-slim

# Définir les variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du service LLM
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Créer le dossier uploads
RUN mkdir -p uploads/llm

# Exposer le port
EXPOSE 5001

# Commande de démarrage
CMD ["python", "llm_server.py"] 