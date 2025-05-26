
#!/bin/bash

echo "🤖 Démarrage du serveur Rasa USTHB-Bot..."

# Variables d'environnement
export RASA_MODEL_DIR=${RASA_MODEL_DIR:-"./models"}
export RASA_PORT=${RASA_PORT:-5005}

# Créer les dossiers nécessaires
mkdir -p models
mkdir -p logs

# Vérifier si un modèle existe
if [ ! "$(ls -A models/)" ]; then
    echo "📚 Aucun modèle trouvé, entraînement initial..."
    cd Chatbot_USTHB_Github
    rasa train --domain domain.yml --data data --config config.yml --out ../models
    cd ..
fi

echo "🚀 Lancement du serveur Rasa sur le port $RASA_PORT"

# Démarrer Rasa
cd Chatbot_USTHB_Github
rasa run \
    --model ../models \
    --endpoints endpoints.yml \
    --port $RASA_PORT \
    --cors "*" \
    --enable-api \
    --log-file ../logs/rasa.log \
    --debug
