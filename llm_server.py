from flask import Flask, request, jsonify
import json
import random
import PyPDF2
import io
from typing import List, Dict

app = Flask(__name__)

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier fourni'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Le fichier doit être un PDF'}), 400

        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file)

        # Generate Rasa NLU dataset from text
        dataset = generate_rasa_dataset(pdf_text)

        return jsonify({
            'status': 'success',
            'dataset': dataset,
            'extracted_text_length': len(pdf_text),
            'generated_examples': len(dataset)
        })

    except Exception as e:
        return jsonify({'error': f'Erreur lors du traitement: {str(e)}'}), 500

def extract_text_from_pdf(file):
    """Extract text content from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""

        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        return text.strip()
    except Exception as e:
        raise Exception(f"Erreur lors de l'extraction du PDF: {str(e)}")

def generate_rasa_dataset(text: str) -> List[Dict]:
    """Generate Rasa NLU training data from extracted text"""

    # Predefined intents for USTHB chatbot
    intents_mapping = {
        'startup': ['startup', 'entreprise', 'création', 'business', 'projet'],
        'legal_requirements': ['légal', 'juridique', 'sarl', 'réglementation', 'loi'],
        'pfe_help': ['pfe', 'projet de fin', 'mémoire', 'thèse', 'recherche'],
        'innovation': ['innovation', 'technologie', 'invention', 'créativité'],
        'funding': ['financement', 'investissement', 'capital', 'fonds', 'subvention'],
        'mentoring': ['mentorat', 'conseil', 'guidance', 'aide', 'accompagnement'],
        'networking': ['réseau', 'contact', 'partenaire', 'collaboration'],
        'market_research': ['marché', 'étude', 'concurrence', 'analyse', 'client'],
        'business_plan': ['business plan', 'plan d\'affaires', 'stratégie', 'planification'],
        'intellectual_property': ['propriété intellectuelle', 'brevet', 'marque', 'copyright']
    }

    dataset = []
    sentences = text.split('. ')

    for sentence in sentences[:50]:  # Limit to first 50 sentences
        sentence = sentence.strip()
        if len(sentence) < 10:  # Skip very short sentences
            continue

        # Determine intent based on keywords
        intent = classify_intent(sentence.lower(), intents_mapping)

        # Generate variations of the sentence
        variations = generate_sentence_variations(sentence)

        for variation in variations:
            dataset.append({
                'text': variation,
                'intent': intent
            })

    # Add some predefined examples for better training
    predefined_examples = get_predefined_examples()
    dataset.extend(predefined_examples)

    return dataset

def classify_intent(sentence: str, intents_mapping: Dict) -> str:
    """Classify sentence intent based on keywords"""
    for intent, keywords in intents_mapping.items():
        if any(keyword in sentence for keyword in keywords):
            return intent
    return 'general_info'

def generate_sentence_variations(sentence: str) -> List[str]:
    """Generate variations of a sentence for better training data"""
    variations = [sentence]

    # Convert to question format
    if not sentence.endswith('?'):
        variations.append(f"Comment {sentence.lower()}?")
        variations.append(f"Que savez-vous sur {sentence.lower()}?")
        variations.append(f"Pouvez-vous m'expliquer {sentence.lower()}?")

    return variations[:3]  # Limit variations

def get_predefined_examples() -> List[Dict]:
    """Get predefined training examples for USTHB chatbot"""
    return [
        {'text': 'Comment créer une startup?', 'intent': 'startup'},
        {'text': 'Quelles sont les étapes pour lancer une entreprise?', 'intent': 'startup'},
        {'text': 'J\'ai besoin d\'aide pour mon PFE', 'intent': 'pfe_help'},
        {'text': 'Comment trouver un financement?', 'intent': 'funding'},
        {'text': 'Où puis-je trouver un mentor?', 'intent': 'mentoring'},
        {'text': 'Comment protéger mon idée?', 'intent': 'intellectual_property'},
        {'text': 'Aide-moi à faire une étude de marché', 'intent': 'market_research'},
        {'text': 'Comment rédiger un business plan?', 'intent': 'business_plan'},
        {'text': 'Quelles sont les innovations récentes?', 'intent': 'innovation'},
        {'text': 'Comment créer un réseau professionnel?', 'intent': 'networking'}
    ]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'LLM PDF Processor'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)