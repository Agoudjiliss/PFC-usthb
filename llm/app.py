from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    # Simulation de l'extraction depuis le PDF:
    fake_intents = [
        {
            "intent": "hello",
            "examples": ["Hello", "Hi", "Good morning"],
            "responses": ["Hello! How can I help you?"]
        }
    ]
    return jsonify({"intents": fake_intents})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)