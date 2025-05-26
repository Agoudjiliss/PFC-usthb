
# Architecture USTHB-Bot - Services Séparés

## Diagramme général

```
┌─────────────────────────────────────────────────────────────────┐
│                        USTHB-Bot Architecture                    │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │   Frontend      │
    │   Next.js       │◄─────────────┐
    │   (User/Admin)  │              │
    └─────────────────┘              │
            │                        │
            │ HTTPS/JWT              │
            ▼                        │
    ┌─────────────────┐              │
    │   Backend       │              │
    │   Spring Boot   │              │
    │   (Replit)      │              │
    │   Port 8080     │              │
    └─────────────────┘              │
            │                        │
            │ REST API               │
    ┌───────┴────────┐              │
    │                │              │
    ▼                ▼              │
┌─────────┐    ┌─────────────┐     │
│  Rasa   │    │ LLM Service │     │
│ Service │    │   (Flask)   │     │
│(Railway)│    │  (Render)   │     │
│Port 5005│    │  Port 5001  │     │
└─────────┘    └─────────────┘     │
                                   │
    ┌─────────────────────────────────┘
    │
    ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
│   (Replit)      │
└─────────────────┘
```

## Flux de données

### 1. Conversation utilisateur
```
User → Frontend → Backend → Rasa → Backend → Frontend → User
```

### 2. Upload et traitement PDF
```
Admin → Frontend → Backend → LLM Service → Backend → Rasa Training
```

### 3. Entraînement automatique
```
PDF Upload → LLM Processing → Dataset Generation → Rasa Training → Model Update
```

## Services et responsabilités

### 🖥️ Backend Spring Boot (Replit)
- **Responsabilités**:
  - Authentification JWT
  - API REST unifiée
  - Orchestration des services
  - Persistance des données
  - Gestion des fichiers

- **Ports**: 8080
- **Base de données**: PostgreSQL intégrée
- **Variables d'environnement**:
  ```
  RASA_URL=https://your-rasa.railway.app
  LLAMA_URL=https://your-llm.render.com
  JWT_SECRET=secret
  DATABASE_URL=postgresql://...
  ```

### 🤖 Service Rasa (Railway/Render)
- **Responsabilités**:
  - Compréhension du langage (NLU)
  - Gestion du dialogue (Core)
  - Génération de réponses
  - Entraînement des modèles

- **Ports**: 5005
- **Endpoints**:
  - `/webhooks/rest/webhook` - Chat
  - `/model/train` - Entraînement
  - `/model` - Gestion des modèles

### 🧠 Service LLM (Render/Replit)
- **Responsabilités**:
  - Extraction de texte PDF
  - Génération de datasets Rasa
  - Traitement du langage naturel
  - Analyse sémantique

- **Ports**: 5001
- **Endpoints**:
  - `/process-pdf` - Traitement PDF
  - `/generate-rasa-dataset` - Génération dataset
  - `/health` - Santé du service

## Déploiement

### 1. Backend (Replit)
```bash
# Variables d'environnement dans Secrets
RASA_URL=https://usthb-rasa.railway.app
LLAMA_URL=https://usthb-llm.render.com
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://localhost:5432/chatbot

# Démarrage
mvn spring-boot:run
```

### 2. Rasa (Railway)
```bash
# Déploiement Railway
railway login
railway init
railway add postgresql
railway deploy

# Configuration
PORT=5005
RASA_MODEL_DIR=/app/models
```

### 3. LLM (Render)
```bash
# Déploiement Render
git push origin main

# Configuration
PORT=5001
PYTHON_VERSION=3.11
BUILD_COMMAND=pip install -r requirements.txt
START_COMMAND=python llm_server.py
```

## Avantages de cette architecture

### ✅ Séparation des responsabilités
- Chaque service a un rôle spécifique
- Maintenance et débogage simplifiés
- Scalabilité indépendante

### ✅ Déploiement flexible
- Services déployables séparément
- Choix de la plateforme par service
- Tolérance aux pannes

### ✅ Développement parallèle
- Équipes peuvent travailler indépendamment
- Tests unitaires par service
- Intégration continue facilitée

### ✅ Performance
- Load balancing possible
- Cache par service
- Optimisation ciblée

## Monitoring et logs

### Backend Spring Boot
- Logs: `application.log`
- Métriques: Actuator endpoints
- Santé: `/api/health/status`

### Service Rasa
- Logs: `rasa.log`
- Métriques: Rasa metrics
- Santé: `GET /`

### Service LLM
- Logs: Console Flask
- Métriques: Custom endpoints
- Santé: `/health`

## Sécurité

### 🔐 Authentification
- JWT tokens avec expiration
- Refresh tokens
- Rôles USER/ADMIN

### 🌐 CORS
- Configuration par environnement
- Origins autorisées
- Headers sécurisés

### 🔒 Communication
- HTTPS obligatoire en production
- Validation des inputs
- Rate limiting

## Tests d'intégration

Utiliser le script `test-integration.sh` pour valider:
1. Connectivité des services
2. Authentification
3. Flux de conversation
4. Upload et traitement
5. Statistiques admin

```bash
chmod +x test-integration.sh
./test-integration.sh
```
