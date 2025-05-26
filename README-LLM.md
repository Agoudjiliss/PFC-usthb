
# USTHB-Bot LLM Service

## Architecture

Service de traitement de documents PDF et génération de datasets d'entraînement pour Rasa.

## Déploiement sur Render/Replit

### 1. Prérequis

```bash
pip install flask flask-cors werkzeug
```

### 2. Variables d'environnement

```bash
PORT=5001
UPLOAD_FOLDER=uploads/llm
MAX_CONTENT_LENGTH=16777216  # 16MB
```

### 3. Démarrage

```bash
# Démarrage direct
python llm_server.py

# Ou avec script
chmod +x start_llm_server.sh
./start_llm_server.sh
```

### 4. Endpoints

#### Santé du service
```bash
GET /health
```

#### Traitement PDF
```bash
POST /process-pdf
Content-Type: multipart/form-data

# Paramètres:
# - file: Fichier PDF à traiter
```

#### Génération dataset
```bash
POST /generate-rasa-dataset
Content-Type: application/json

{
  "text": "Texte à analyser...",
  "context": "USTHB Innovation Hub"
}
```

### 5. Test complet

```bash
# 1. Upload d'un PDF
curl -X POST http://0.0.0.0:5001/process-pdf \
  -F "file=@example.pdf"

# Réponse:
{
  "success": true,
  "extracted_text": "Contenu extrait...",
  "dataset": [
    {
      "intent": "startup_creation",
      "examples": ["Comment créer une startup ?", ...]
    }
  ],
  "generated_examples": 25
}
```

### 6. Intégration avec le backend

Le service LLM est appelé automatiquement par le backend Spring Boot lors de:

1. Upload d'un fichier PDF (`/api/resources/upload`)
2. Traitement via LLM (`/api/resources/process/{id}`)
3. Génération automatique de dataset Rasa
4. Déclenchement d'entraînement Rasa

### 7. Extensions possibles

- Intégration avec de vrais modèles LLM (OpenAI, Hugging Face)
- Support d'autres formats (Word, PowerPoint)
- OCR pour images et documents scannés
- Analyse sémantique avancée
