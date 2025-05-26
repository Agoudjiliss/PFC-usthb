# Serveur Rasa — NLP Engine

Service NLP Dockerisé compatible API REST, à héberger sur Railway, Render, ou VPS.

## Fonctionnalités

- Dialogue utilisateur
- Entraînement modèle (`/model/train`)
- Webhook REST (`/webhooks/rest/webhook`)

## Déploiement (Docker)

```sh
git clone <repository>
cd rasa
# Modifier domaine, data/intents, etc.
docker run -v $(pwd):/app/project rasa/rasa:3.5 train
docker run -v $(pwd):/app/project -p 5005:5005 rasa/rasa:3.5 run --enable-api --cors "*"
```

## Déploiement Railway/Render

- Railway : créer service Docker, lier repo, exposer le port 5005.
- Render : “Web Service”, image Docker officielle, port 5005.

## Tester le REST API

```sh
curl -X POST https://monrasa.up.railway.app/webhooks/rest/webhook -H "Content-Type: application/json" -d '{"sender": "test", "message": "Bonjour"}'
```

## Variables d'environnement côté backend

- `RASA_URL=https://votreservicerasa.production.up.railway.app`
---