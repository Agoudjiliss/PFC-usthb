# Serveur LLM — Extraction PDF → Intents (Simulé)

Microservice Python/Flask.
- Reçoit un fichier PDF sur `/process-pdf`
- Retourne du JSON compatible dataset d’entraînement Rasa

## Exemple (Flask)

```python
from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return {"error": "No file"}, 400
    # Ne fait qu’un mock ici :
    fake_intents = [
        {
            "intent": "salutation",
            "examples": ["Bonjour", "Salut", "Coucou"],
            "responses": ["Bonjour, comment puis-je vous aider ?"]
        }
    ]
    return jsonify({"intents": fake_intents})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

## Déploiement Render

- Service web, runtime Python, port 5001.
- Ajouter variable d’env : `PYTHON_VERSION=3.10`

## Test

```sh
curl -X POST http://localhost:5001/process-pdf -F "file=@test.pdf"
```

## Réponse attendue

```json
{
  "intents": [{
    "intent": "salutation",
    "examples": ["Bonjour", "Salut", "Coucou"],
    "responses": ["Bonjour, comment puis-je vous aider ?"]
  }]
}
```
---