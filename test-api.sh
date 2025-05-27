#!/bin/bash

echo "🔍 Testing Backend API..."
echo "Testing health endpoint..."
curl -s http://localhost:8080/api/health

echo -e "\n\n🔍 Testing Rasa API..."
echo "Testing webhook..."
curl -s -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"test_user","message":"Bonjour"}'

echo -e "\n\n🔍 Testing LLM API..."
echo "Testing process endpoint..."
curl -s -X POST http://localhost:5001/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Bonjour, comment ça va ?"}'

echo -e "\n\n✅ Tests completed!" 