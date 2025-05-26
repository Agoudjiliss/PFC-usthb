
#!/bin/bash

echo "🤖 Starting USTHB-Bot Rasa Service"

cd Chatbot_USTHB_Github

# Check if model exists, if not train one
if [ ! -d "models" ] || [ -z "$(ls -A models)" ]; then
    echo "📚 Training initial model..."
    rasa train
fi

echo "🔄 Starting Rasa server..."
rasa run --enable-api --cors "*" --port 5005 --host 0.0.0.0
