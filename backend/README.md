# Backend Spring Boot — Chatbot API

API Java Spring Boot pour orchestrer la communication entre le frontend, Rasa (NLP), et un serveur LLM.

## Fonctionnalités

- Authentification JWT (`/auth`)
- Dialogue chatbot (`/chat`)
- Import/Ecriture/intents, entraînement Rasa
- Import PDF via LLM (`/training`)

## Déploiement sur Heroku

### Prérequis

- Java 17 (compatible Heroku)
- PostgreSQL (Heroku Postgres Add-On recommandé)
- Variables d'environnement requises :

| Variable        | Usage                                               | Exemple                             |
|-----------------|-----------------------------------------------------|-------------------------------------|
| `PORT`          | Port d'écoute Heroku (set automatiquement)          | 443                                 |
| `DATABASE_URL`  | JDBC PostgreSQL Heroku                              | jdbc:postgresql://xxx/heroku_db     |
| `JWT_SECRET`    | Secret JWT                                          | un_secret_robuste                   |
| `RASA_URL`      | URL public du service Rasa (API REST)               | https://rasa-prod.up/render.com     |
| `LLAMA_URL`     | URL du service LLM                                  | https://llm-prod.up/render.com      |
| `UPLOAD_DIR`    | Dossier d’upload temporaire                         | uploads/                            |
| `MAX_FILE_SIZE` | Limite d’upload fichier                             | 10MB                                |

### Build & Déploiement

```sh
git clone <repository>
cd backend
heroku create chatbot-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=un_secret_robuste
heroku config:set RASA_URL=https://rasaURL
heroku config:set LLAMA_URL=https://llmURL
git push heroku main
```

### Lancer en local

```sh
export DATABASE_URL=jdbc:postgresql://localhost:5432/chatbot_db
export JWT_SECRET=dev_secret
export RASA_URL=http://localhost:5005
export LLAMA_URL=http://localhost:5001
./mvnw spring-boot:run
```

### Tests de santé

- `/actuator/health`
- `/chat` (voir README LLM)

---