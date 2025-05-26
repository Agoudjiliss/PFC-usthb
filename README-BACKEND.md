
# USTHB-Bot Backend - Spring Boot

## Architecture

Service backend REST API gérant l'authentification, la communication avec Rasa et LLM, et la persistance des données.

## Déploiement sur Replit

### 1. Variables d'environnement

```bash
# Base de données
DATABASE_URL=jdbc:postgresql://localhost:5432/chatbot_db
DB_USERNAME=chatbot
DB_PASSWORD=secure_password

# Services externes
RASA_URL=https://your-rasa-service.railway.app
LLAMA_URL=https://your-llm-service.render.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# Configuration
PORT=8080
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=10MB
```

### 2. Compilation et démarrage

```bash
# Compilation
mvn clean compile

# Démarrage
mvn spring-boot:run
```

### 3. Endpoints principaux

- **Auth**: `/auth/login`, `/auth/register`
- **Chat**: `/api/chat/send`, `/api/chat/history`
- **Upload**: `/api/resources/upload`, `/api/resources/process/{id}`
- **Admin**: `/api/admin/stats/*`
- **Health**: `/api/health/status`

### 4. Test de connectivité

```bash
# Santé du système
curl http://localhost:8080/api/health/status

# Test chat
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Hello", "sessionId": "test123"}'
```

## Base de données

Le backend utilise PostgreSQL avec auto-création des tables via Hibernate DDL.

### Tables principales:
- `users` - Utilisateurs et authentification
- `chat_messages` - Historique des conversations
- `resources` - Fichiers uploadés
- `training_sessions` - Sessions d'entraînement Rasa
- `intents` - Intents et réponses
- `feedback` - Retours utilisateurs

## Sécurité

- JWT avec expiration configurable
- CORS activé pour le frontend
- Validation des inputs
- Hashage des mots de passe avec BCrypt
