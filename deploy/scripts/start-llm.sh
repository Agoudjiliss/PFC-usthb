
#!/bin/bash

echo "🧠 Starting USTHB-Bot LLM Service"

# Install dependencies if needed
pip install -q -r requirements.txt

echo "🔄 Starting LLM server..."
python llm_server.py
