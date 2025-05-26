# Documentation des Endpoints API

Ce document décrit les endpoints API nécessaires pour le fonctionnement du dashboard administratif de la plateforme SaaS IA.

## 🔐 Authentification

Toutes les requêtes API doivent inclure un token JWT dans l'en-tête d'autorisation:

\`\`\`
Authorization: Bearer <token_jwt>
\`\`\`

## 📡 Endpoints API

### Gestion des Intents

#### 🔍 GET /api/intents

Récupère la liste de tous les intents.

**Paramètres de requête:**
- `category` (optionnel): Filtre par catégorie
- `search` (optionnel): Recherche textuelle
- `page` (optionnel): Numéro de page pour la pagination
- `limit` (optionnel): Nombre d'éléments par page

**Exemple de requête:**
\`\`\`
GET /api/intents?category=financement&search=startup&page=1&limit=10
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "intents": [
      {
        "id": "1",
        "name": "funding_options",
        "examples": [
          "Comment obtenir un financement pour ma startup ?",
          "Quelles sont les options de financement disponibles ?"
        ],
        "category": "Financement",
        "defaultResponse": "Voici les options de financement disponibles en Algérie...",
        "confidence": 87,
        "lastUpdated": "2024-05-01T14:30:00Z"
      },
      {
        "id": "2",
        "name": "startup_creation",
        "examples": [
          "Comment créer une startup en Algérie ?",
          "Quelles sont les étapes pour créer une entreprise ?"
        ],
        "category": "Création startup",
        "defaultResponse": "Pour créer une startup en Algérie, vous devez suivre ces étapes...",
        "confidence": 92,
        "lastUpdated": "2024-04-28T10:15:00Z"
      }
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
\`\`\`

#### ➕ POST /api/intents

Crée un nouvel intent.

**Corps de la requête:**
\`\`\`json
{
  "name": "investment_advice",
  "examples": [
    "Comment investir dans une startup algérienne ?",
    "Quelles sont les meilleures pratiques d'investissement ?"
  ],
  "category": "Financement",
  "defaultResponse": "Pour investir dans une startup algérienne, vous devriez considérer..."
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "investment_advice",
    "examples": [
      "Comment investir dans une startup algérienne ?",
      "Quelles sont les meilleures pratiques d'investissement ?"
    ],
    "category": "Financement",
    "defaultResponse": "Pour investir dans une startup algérienne, vous devriez considérer...",
    "confidence": 0,
    "lastUpdated": "2024-05-02T09:45:00Z"
  }
}
\`\`\`

#### 📝 PUT /api/intents/:id

Modifie un intent existant.

**Paramètres de chemin:**
- `id`: Identifiant de l'intent à modifier

**Corps de la requête:**
\`\`\`json
{
  "name": "funding_options",
  "examples": [
    "Comment obtenir un financement pour ma startup ?",
    "Quelles sont les options de financement disponibles ?",
    "Où trouver des investisseurs en Algérie ?"
  ],
  "category": "Financement",
  "defaultResponse": "Voici les options de financement actualisées disponibles en Algérie..."
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "funding_options",
    "examples": [
      "Comment obtenir un financement pour ma startup ?",
      "Quelles sont les options de financement disponibles ?",
      "Où trouver des investisseurs en Algérie ?"
    ],
    "category": "Financement",
    "defaultResponse": "Voici les options de financement actualisées disponibles en Algérie...",
    "confidence": 87,
    "lastUpdated": "2024-05-02T10:30:00Z"
  }
}
\`\`\`

#### ❌ DELETE /api/intents/:id

Supprime un intent.

**Paramètres de chemin:**
- `id`: Identifiant de l'intent à supprimer

**Exemple de requête:**
\`\`\`
DELETE /api/intents/3
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "message": "Intent supprimé avec succès"
}
\`\`\`

### Gestion des FAQs

#### 🔍 GET /api/faqs

Récupère la liste des questions fréquentes.

**Paramètres de requête:**
- `category` (optionnel): Filtre par catégorie
- `search` (optionnel): Recherche textuelle
- `page` (optionnel): Numéro de page pour la pagination
- `limit` (optionnel): Nombre d'éléments par page

**Exemple de requête:**
\`\`\`
GET /api/faqs?category=legal&page=1&limit=10
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "faqs": [
      {
        "id": "1",
        "question": "Comment obtenir un financement pour ma startup en Algérie ?",
        "frequency": 87,
        "intent": "funding_options",
        "category": "Financement",
        "lastAsked": "2024-05-01T14:30:00Z"
      },
      {
        "id": "2",
        "question": "Quelles sont les étapes pour créer une entreprise à Alger ?",
        "frequency": 76,
        "intent": "startup_creation",
        "category": "Création startup",
        "lastAsked": "2024-04-30T10:15:00Z"
      }
    ],
    "pagination": {
      "total": 18,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
\`\`\`

#### 📌 PATCH /api/faqs/:id

Associe une FAQ à un intent.

**Paramètres de chemin:**
- `id`: Identifiant de la FAQ à modifier

**Corps de la requête:**
\`\`\`json
{
  "intent": "legal_requirements"
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "3",
    "question": "Quels documents faut-il pour ouvrir une SARL ?",
    "frequency": 65,
    "intent": "legal_requirements",
    "category": "Légal",
    "lastAsked": "2024-04-29T08:45:00Z"
  }
}
\`\`\`

### Gestion du Chatbot

#### ⚙️ GET /api/bot/status

Récupère l'état actuel du chatbot.

**Exemple de requête:**
\`\`\`
GET /api/bot/status
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "active": true,
    "lastActivated": "2024-05-01T08:00:00Z",
    "analysisFrequency": "daily"
  }
}
\`\`\`

#### 🔁 PATCH /api/bot/status

Active ou désactive le chatbot.

**Corps de la requête:**
\`\`\`json
{
  "active": false
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "active": false,
    "lastDeactivated": "2024-05-02T15:30:00Z"
  }
}
\`\`\`

#### 📩 PATCH /api/bot/message

Modifie les messages du chatbot.

**Corps de la requête:**
\`\`\`json
{
  "welcomeMessage": "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
  "fallbackMessage": "Je n'ai pas bien compris votre demande. Pourriez-vous reformuler ?",
  "goodbyeMessage": "Merci de votre visite. À bientôt !",
  "timeoutMessage": "Êtes-vous toujours là ? Je suis disponible si vous avez d'autres questions."
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "welcomeMessage": "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
    "fallbackMessage": "Je n'ai pas bien compris votre demande. Pourriez-vous reformuler ?",
    "goodbyeMessage": "Merci de votre visite. À bientôt !",
    "timeoutMessage": "Êtes-vous toujours là ? Je suis disponible si vous avez d'autres questions.",
    "lastUpdated": "2024-05-02T15:45:00Z"
  }
}
\`\`\`

#### 🔄 PATCH /api/bot/config

Modifie la configuration du chatbot.

**Corps de la requête:**
\`\`\`json
{
  "analysisFrequency": "hourly",
  "confidenceThreshold": 70,
  "sessionTimeout": 30,
  "geoTargeting": true
}
\`\`\`

**Exemple de réponse:**
\`\`\`json
{
  "success": true,
  "data": {
    "analysisFrequency": "hourly",
    "confidenceThreshold": 70,
    "sessionTimeout": 30,
    "geoTargeting": true,
    "lastUpdated": "2024-05-02T16:00:00Z"
  }
}
\`\`\`

## 🚨 Gestion des erreurs

Toutes les réponses d'erreur suivent le format standard:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "L'intent demandé n'existe pas",
    "details": {
      "id": "123"
    }
  }
}
\`\`\`

### Codes d'état HTTP

- `200 OK`: Requête réussie
- `201 Created`: Ressource créée avec succès
- `400 Bad Request`: Erreur dans la requête (paramètres invalides)
- `401 Unauthorized`: Authentification requise
- `403 Forbidden`: Accès refusé
- `404 Not Found`: Ressource non trouvée
- `422 Unprocessable Entity`: Données valides mais traitement impossible
- `500 Internal Server Error`: Erreur serveur
