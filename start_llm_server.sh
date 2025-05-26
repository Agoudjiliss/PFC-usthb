
#!/bin/bash

echo "Installation des dépendances Python..."
pip install -r requirements.txt

echo "Démarrage du serveur LLM..."
python llm_server.py
