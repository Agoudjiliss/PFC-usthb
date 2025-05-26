
# USTHB-Bot - Documentation Technique

## Vue d'ensemble du projet

USTHB-Bot est un chatbot intelligent développé pour l'Université des Sciences et de la Technologie Houari Boumediene (USTHB). Le système combine plusieurs technologies pour offrir une expérience conversationnelle avancée avec traitement de documents.

### Architecture générale

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Services      │
│   Next.js       │◄──►│   Spring Boot    │◄──►│   Rasa (5005)   │
│   (Port 3000)   │    │   (Port 8080)    │    │   LLM (5001)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  PostgreSQL  │
                       │  Database    │
                       └──────────────┘
```

### Technologies utilisées

- **Backend** : Java 17, Spring Boot 3.x, Spring Security, JWT
- **IA Conversationnelle** : Rasa Open Source
- **LLM** : LLaMA 3.0 (serveur local Flask)
- **Base de données** : PostgreSQL
- **Frontend** : Next.js, React, TypeScript
- **Authentification** : JWT avec rôles (USER/ADMIN)

---

## Partie 1 : Documentation Backend Spring Boot

### 1.1 Architecture modulaire

Le backend suit une architecture en couches avec séparation des responsabilités :

#### Structure des packages
```
com.chatbot/
├── config/           # Configuration Spring (Security, CORS)
├── controller/       # Contrôleurs REST
├── dto/             # Objets de transfert de données
├── model/           # Entités JPA
├── repository/      # Repositories Spring Data
├── service/         # Logique métier
└── security/        # Sécurité et JWT
```

#### Modules principaux

1. **Authentification & Sécurité**
   - Gestion JWT avec refresh tokens
   - Rôles : USER, ADMIN
   - Protection des endpoints sensibles

2. **Chat & Communication**
   - Interface avec Rasa pour NLU
   - Historique des conversations
   - Analyse des intents et confidence

3. **Gestion des ressources**
   - Upload de fichiers PDF
   - Traitement via LLaMA
   - Génération de datasets d'entraînement

4. **Training & Modèles**
   - Entraînement automatique Rasa
   - Versioning des modèles
   - Suivi des performances

### 1.2 Configuration

#### application.yml
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/chatbot_db
    username: ${DB_USERNAME:chatbot}
    password: ${DB_PASSWORD:password}
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

# Services externes
rasa:
  url: http://0.0.0.0:5005

llm:
  url: http://0.0.0.0:5001

# JWT Configuration
app:
  jwtSecret: mySecretKey
  jwtExpirationMs: 86400000
```

### 1.3 Endpoints REST

#### Authentification (`/auth`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/auth/login` | Public | Connexion utilisateur |
| POST | `/auth/register` | Public | Inscription |
| POST | `/auth/refresh` | USER | Refresh token |

**Exemple Login :**
```json
// Requête
{
  "username": "user@usthb.dz",
  "password": "password123"
}

// Réponse
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "username": "user@usthb.dz",
  "email": "user@usthb.dz",
  "roles": ["ROLE_USER"]
}
```

#### Chat (`/api/chat`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/chat/send` | USER | Envoyer un message |
| GET | `/api/chat/history` | USER | Historique des conversations |
| GET | `/api/chat/suggestions` | USER | Suggestions d'intents |

**Exemple Chat :**
```json
// Requête
{
  "message": "Comment créer une startup?",
  "sessionId": "user_123"
}

// Réponse
{
  "response": "Pour créer une startup, vous devez...",
  "intent": "startup_creation",
  "confidence": 0.95,
  "suggestions": ["business_plan", "funding", "legal_requirements"]
}
```

#### Upload & LLM (`/api/resources`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/resources/upload` | ADMIN | Upload fichier PDF |
| GET | `/api/resources` | ADMIN | Liste des ressources |
| POST | `/api/resources/process/{id}` | ADMIN | Traiter avec LLM |
| DELETE | `/api/resources/{id}` | ADMIN | Supprimer ressource |

**Exemple Upload :**
```json
// Réponse
{
  "id": 1,
  "filename": "guide_startup.pdf",
  "status": "UPLOADED",
  "createdAt": "2024-01-15T10:30:00",
  "processedAt": null
}
```

#### Training (`/api/training`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/training/start` | ADMIN | Démarrer entraînement |
| GET | `/api/training/status` | ADMIN | Statut entraînement |
| GET | `/api/training/history` | ADMIN | Historique des sessions |

#### Intents (`/api/intents`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/api/intents` | ADMIN | Liste des intents |
| POST | `/api/intents` | ADMIN | Créer intent |
| PUT | `/api/intents/{id}` | ADMIN | Modifier intent |
| DELETE | `/api/intents/{id}` | ADMIN | Supprimer intent |

#### Administration (`/api/admin`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/api/admin/stats/overview` | ADMIN | Statistiques générales |
| GET | `/api/admin/stats/conversations` | ADMIN | Stats conversations |
| GET | `/api/admin/stats/intents` | ADMIN | Stats intents |
| GET | `/api/admin/users` | ADMIN | Gestion utilisateurs |

#### Feedback (`/api/feedback`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| POST | `/api/feedback` | USER | Soumettre feedback |
| GET | `/api/feedback` | ADMIN | Liste des feedbacks |

#### Settings (`/api/settings`)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| GET | `/api/settings/chat` | ADMIN | Paramètres chat |
| PUT | `/api/settings/chat` | ADMIN | Modifier paramètres |
| GET | `/api/settings/general` | ADMIN | Paramètres généraux |

---

## Partie 2 : Documentation Frontend

### 2.1 Interface Utilisateur

#### Pages principales

1. **Authentification** (`/auth`)
   - `/auth/login` - Connexion
   - `/auth/register` - Inscription
   - Gestion des tokens JWT en localStorage

2. **Chat** (`/chat`)
   - Interface de conversation principale
   - Affichage des suggestions d'intents
   - Historique en temps réel

3. **Profil** (`/profile`)
   - Informations utilisateur
   - Historique des conversations
   - Paramètres personnels

#### Appels API côté utilisateur

```typescript
// Service d'authentification
class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => res.json());
  }
}

// Service de chat
class ChatService {
  async sendMessage(message: string): Promise<ChatResponse> {
    return await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ message })
    }).then(res => res.json());
  }
}
```

### 2.2 Interface Administrateur

#### Pages principales

1. **Dashboard** (`/admin`)
   - Statistiques en temps réel
   - Graphiques de performance
   - Métriques des conversations

2. **Gestion des ressources** (`/admin/resources`)
   - Upload de fichiers PDF
   - Traitement par LLM
   - Gestion des datasets

3. **Training** (`/admin/training`)
   - Démarrage d'entraînement
   - Suivi du statut
   - Historique des modèles

4. **Intents** (`/admin/intents`)
   - CRUD complet des intents
   - Édition en ligne
   - Aperçu des exemples

5. **Feedback** (`/admin/feedback`)
   - Liste des retours utilisateurs
   - Analyse des problèmes
   - Actions de suivi

6. **Paramètres** (`/admin/settings`)
   - Configuration du chatbot
   - Paramètres Rasa
   - Réglages généraux

#### Composants réutilisables

```typescript
// Composant d'upload
interface UploadComponentProps {
  onUploadSuccess: (file: UploadedFile) => void;
  acceptedTypes: string[];
}

// Composant de statistiques
interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  icon?: React.ComponentType;
}

// Composant de training
interface TrainingStatusProps {
  session: TrainingSession;
  onRefresh: () => void;
}
```

---

## Partie 3 : Services externes

### 3.1 Serveur Rasa (Port 5005)

#### Configuration endpoints.yml
```yaml
action_endpoint:
  url: "http://0.0.0.0:5055/webhook"

models:
  url: "http://0.0.0.0:5005/model"
  wait_time_between_pulls: 10

tracker_store:
  type: InMemoryTrackerStore

event_broker:
  type: pika
  url: amqp://localhost
```

#### Endpoints utilisés
- `POST /webhooks/rest/webhook` - Chat principal
- `POST /model/parse` - Analyse NLU
- `GET /status` - Santé du service
- `POST /model/train` - Entraînement

### 3.2 Serveur LLM (Port 5001)

#### Service Flask pour traitement PDF
```python
# Endpoints LLM
@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    # Traitement PDF → Dataset Rasa
    pass

@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'healthy'}
```

---

## Partie 4 : Déploiement sur Replit

### 4.1 Configuration .replit

Le fichier `.replit` est configuré pour démarrer tous les services :

```toml
[workflows]
runButton = "Start Full System"

[[workflows.workflow]]
name = "Start Full System"
mode = "parallel"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "python llm_server.py"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "mvn clean compile spring-boot:run"
```

### 4.2 Scripts de démarrage

#### start_rasa.sh
```bash
#!/bin/bash
cd Chatbot_USTHB_Github
rasa run --enable-api --cors "*" --port 5005 --host 0.0.0.0 &
```

#### start_llm_server.sh
```bash
#!/bin/bash
pip install -r requirements.txt
python llm_server.py
```

### 4.3 Ports utilisés

- **Spring Boot** : 8080 (backend principal)
- **Rasa** : 5005 (service NLU)
- **LLM Server** : 5001 (traitement PDF)
- **Frontend** : 3000 (interface utilisateur)
- **PostgreSQL** : 5432 (base de données)

### 4.4 Variables d'environnement

```bash
# Base de données
DB_USERNAME=chatbot
DB_PASSWORD=secure_password
DB_URL=jdbc:postgresql://localhost:5432/chatbot_db

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000

# Services
RASA_URL=http://0.0.0.0:5005
LLM_URL=http://0.0.0.0:5001
```

---

## Partie 5 : Guide de développement

### 5.1 Ajout d'un nouvel endpoint

1. Créer le DTO dans le package approprié
2. Ajouter la méthode dans le controller
3. Implémenter la logique dans le service
4. Ajouter les tests unitaires

### 5.2 Intégration d'un nouveau service

1. Ajouter la configuration dans `application.yml`
2. Créer un service Spring avec `@Service`
3. Utiliser `WebClient` pour les appels HTTP
4. Gérer les erreurs et timeouts

### 5.3 Bonnes pratiques

- Utiliser les DTOs pour les transferts de données
- Valider les entrées avec `@Valid`
- Gérer les exceptions avec `@ControllerAdvice`
- Logger les opérations importantes
- Documenter avec Swagger/OpenAPI

---

## Conclusion

Cette documentation couvre l'ensemble de l'architecture USTHB-Bot. Le système est conçu pour être évolutif et maintenable, avec une séparation claire des responsabilités entre les différents services.

Pour toute question ou contribution, référez-vous aux sections spécifiques de cette documentation.
