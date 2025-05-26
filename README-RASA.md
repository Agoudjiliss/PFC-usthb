
# USTHB-Bot Rasa Service

## Architecture

Service NLU/NLG gérant la compréhension du langage naturel et la génération de réponses contextuelles.

## Déploiement sur Railway/Render

### 1. Prérequis

```bash
pip install rasa[full]==3.6.0
```

### 2. Structure du projet

```
Chatbot_USTHB_Github/
├── config.yml          # Configuration Rasa
├── domain.yml          # Domaine (intents, entities, responses)
├── endpoints.yml       # Configuration des endpoints
├── credentials.yml     # Identifiants (Telegram, Facebook, etc.)
└── data/
    ├── nlu.yml         # Données d'entraînement NLU
    ├── stories.yml     # Histoires de conversation
    └── rules.yml       # Règles de conversation
```

### 3. Variables d'environnement

```bash
RASA_PORT=5005
RASA_MODEL_DIR=./models
RASA_LOG_LEVEL=INFO
```

### 4. Démarrage

```bash
# Rendre le script exécutable
chmod +x start_rasa.sh

# Démarrer Rasa
./start_rasa.sh
```

### 5. Endpoints exposés

- `GET /` - Statut du serveur
- `POST /webhooks/rest/webhook` - Traitement des messages
- `POST /model/train` - Entraînement du modèle
- `GET /model` - Information sur le modèle actuel
- `PUT /model` - Charger un nouveau modèle

### 6. Test des webhooks

```bash
# Test conversation
curl -X POST http://0.0.0.0:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "test_user",
    "message": "Hello"
  }'

# Réponse attendue
[
  {
    "recipient_id": "test_user",
    "text": "Bonjour ! Comment puis-je vous aider ?"
  }
]
```

### 7. Entraînement

```bash
# Entraînement manuel
cd Chatbot_USTHB_Github
rasa train

# Entraînement via API
curl -X POST http://0.0.0.0:5005/model/train \
  -H "Content-Type: application/json"
```

## Configuration domain.yml

Le domaine définit l'univers conversationnel du bot:

- **Intents**: startup_creation, funding_advice, business_plan, etc.
- **Entities**: project_type, funding_amount, business_sector
- **Responses**: Templates de réponses
- **Actions**: Actions personnalisées
