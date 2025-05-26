
#!/usr/bin/env python3
"""
Serveur LLM simulé pour traitement de PDF et génération de datasets Rasa
Compatible avec l'architecture séparée USTHB-Bot
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import time
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads/llm'
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Créer le dossier d'upload
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_rasa_dataset(extracted_text, context="USTHB Bot"):
    """Génère un dataset Rasa simulé basé sur le texte extrait"""
    
    # Exemples de données simulées basées sur l'innovation et l'entrepreneuriat
    base_intents = [
        {
            "intent": "startup_creation",
            "examples": [
                "Comment créer une startup ?",
                "Les étapes pour lancer une entreprise",
                "Créer sa propre entreprise",
                "Démarrer une startup innovante"
            ]
        },
        {
            "intent": "funding_advice", 
            "examples": [
                "Comment financer mon projet ?",
                "Où trouver des investisseurs ?",
                "Sources de financement startup",
                "Obtenir des fonds pour entreprendre"
            ]
        },
        {
            "intent": "business_plan",
            "examples": [
                "Comment rédiger un business plan ?",
                "Modèle de plan d'affaires",
                "Structure d'un business plan",
                "Créer un plan de développement"
            ]
        },
        {
            "intent": "innovation_process",
            "examples": [
                "Processus d'innovation",
                "Comment innover ?",
                "Développer une idée innovante",
                "Méthodologie d'innovation"
            ]
        },
        {
            "intent": "legal_requirements",
            "examples": [
                "Démarches légales pour créer une entreprise",
                "Statut juridique startup",
                "Réglementation entrepreneuriat",
                "Formalités administratives"
            ]
        }
    ]
    
    # Enrichir avec du contenu basé sur le texte (simulation)
    enhanced_dataset = []
    for intent_data in base_intents:
        enhanced_intent = {
            "intent": intent_data["intent"],
            "examples": intent_data["examples"]
        }
        
        # Ajouter des exemples générés (simulation basée sur le texte)
        if "startup" in extracted_text.lower() or "entreprise" in extracted_text.lower():
            enhanced_intent["examples"].extend([
                f"Qu'est-ce que dit le document sur {intent_data['intent'].replace('_', ' ')} ?",
                f"Information sur {intent_data['intent'].replace('_', ' ')} dans le PDF"
            ])
        
        enhanced_dataset.append(enhanced_intent)
    
    return enhanced_dataset

@app.route('/health', methods=['GET'])
def health_check():
    """Point de santé du service LLM"""
    return jsonify({
        "status": "UP",
        "service": "LLM Server",
        "version": "1.0.0",
        "timestamp": time.time()
    })

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Traite un fichier PDF et génère un dataset Rasa"""
    
    try:
        # Vérifier la présence du fichier
        if 'file' not in request.files:
            return jsonify({"error": "Aucun fichier fourni"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Nom de fichier vide"}), 400
        
        if file and allowed_file(file.filename):
            # Sauvegarder le fichier
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Simuler l'extraction de texte (en réalité, utiliserait PyPDF2, pdfplumber, etc.)
            extracted_text = f"""
            Document traité: {filename}
            
            Contenu simulé sur l'innovation et l'entrepreneuriat:
            
            L'innovation est un processus créatif qui transforme les idées en solutions concrètes.
            Pour créer une startup, il faut identifier un problème, développer une solution,
            valider le marché et construire un business model viable.
            
            Les étapes clés incluent:
            1. Validation de l'idée
            2. Étude de marché
            3. Développement du produit minimum viable (MVP)
            4. Recherche de financement
            5. Lancement et croissance
            
            Les sources de financement incluent les fonds propres, les business angels,
            les incubateurs, et les organismes publics de soutien à l'innovation.
            """
            
            # Générer le dataset Rasa
            dataset = generate_rasa_dataset(extracted_text, "USTHB Innovation Hub")
            
            # Simuler un délai de traitement
            time.sleep(2)
            
            response = {
                "success": True,
                "extracted_text": extracted_text,
                "extracted_text_length": len(extracted_text),
                "dataset": dataset,
                "generated_examples": sum(len(intent["examples"]) for intent in dataset),
                "processing_time": 2.0,
                "file_info": {
                    "filename": filename,
                    "size": os.path.getsize(filepath)
                }
            }
            
            return jsonify(response)
        
        else:
            return jsonify({"error": "Type de fichier non autorisé"}), 400
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/generate-rasa-dataset', methods=['POST'])
def generate_dataset():
    """Génère un dataset Rasa à partir de texte brut"""
    
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({"error": "Texte requis"}), 400
        
        text = data['text']
        context = data.get('context', 'General')
        
        # Générer le dataset
        dataset = generate_rasa_dataset(text, context)
        
        response = {
            "success": True,
            "dataset": dataset,
            "context": context,
            "generated_intents": len(dataset),
            "total_examples": sum(len(intent["examples"]) for intent in dataset)
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/status', methods=['GET'])
def status():
    """Statut détaillé du service"""
    return jsonify({
        "service": "USTHB-Bot LLM Service",
        "status": "operational",
        "capabilities": [
            "PDF text extraction",
            "Rasa dataset generation",
            "Natural language processing"
        ],
        "supported_formats": list(ALLOWED_EXTENSIONS),
        "max_file_size": "16MB",
        "uptime": time.time()
    })

if __name__ == '__main__':
    print("🚀 Démarrage du serveur LLM USTHB-Bot...")
    print(f"📁 Dossier uploads: {UPLOAD_FOLDER}")
    print(f"📋 Extensions autorisées: {ALLOWED_EXTENSIONS}")
    
    # Démarrer le serveur
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5001)),
        debug=True
    )
