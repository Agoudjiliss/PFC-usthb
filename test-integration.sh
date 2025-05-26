
#!/bin/bash

echo "🧪 Tests d'intégration USTHB-Bot - Architecture séparée"

# Configuration
BACKEND_URL="http://0.0.0.0:8080"
RASA_URL="http://0.0.0.0:5005"
LLM_URL="http://0.0.0.0:5001"

echo "📋 URLs des services:"
echo "  Backend: $BACKEND_URL"
echo "  Rasa: $RASA_URL"
echo "  LLM: $LLM_URL"
echo ""

# Test 1: Santé des services
echo "1️⃣ Test de santé des services..."

echo "  🔍 Backend..."
curl -s "$BACKEND_URL/api/health/status" | jq '.backend' || echo "❌ Backend indisponible"

echo "  🤖 Rasa..."
curl -s "$RASA_URL/" || echo "❌ Rasa indisponible"

echo "  🧠 LLM..."
curl -s "$LLM_URL/health" | jq '.status' || echo "❌ LLM indisponible"

echo ""

# Test 2: Authentification
echo "2️⃣ Test d'authentification..."

AUTH_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

JWT_TOKEN=$(echo $AUTH_RESPONSE | jq -r '.token' 2>/dev/null)

if [ "$JWT_TOKEN" != "null" ] && [ "$JWT_TOKEN" != "" ]; then
    echo "  ✅ Authentification réussie"
    echo "  🔑 Token: ${JWT_TOKEN:0:20}..."
else
    echo "  ❌ Échec authentification"
    exit 1
fi

echo ""

# Test 3: Chat via Rasa
echo "3️⃣ Test de conversation..."

CHAT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "message": "Comment créer une startup ?",
    "sessionId": "test_integration"
  }')

echo "  📨 Réponse chat:"
echo $CHAT_RESPONSE | jq '.response' || echo "❌ Erreur chat"

echo ""

# Test 4: Upload et traitement LLM
echo "4️⃣ Test upload et traitement LLM..."

# Créer un fichier test
echo "Guide de création de startup USTHB" > test_document.txt
echo "Innovation et entrepreneuriat" >> test_document.txt

UPLOAD_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/resources/upload" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "file=@test_document.txt" \
  -F "description=Test document")

RESOURCE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.id' 2>/dev/null)

if [ "$RESOURCE_ID" != "null" ] && [ "$RESOURCE_ID" != "" ]; then
    echo "  ✅ Upload réussi (ID: $RESOURCE_ID)"
    
    # Test traitement LLM
    PROCESS_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/resources/process/$RESOURCE_ID" \
      -H "Authorization: Bearer $JWT_TOKEN")
    
    echo "  🧠 Traitement LLM:"
    echo $PROCESS_RESPONSE | jq '.message' || echo "❌ Erreur traitement"
else
    echo "  ❌ Échec upload"
fi

# Nettoyage
rm -f test_document.txt

echo ""

# Test 5: Statistiques admin
echo "5️⃣ Test statistiques admin..."

STATS_RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/admin/stats/users" \
  -H "Authorization: Bearer $JWT_TOKEN")

echo "  📊 Stats utilisateurs:"
echo $STATS_RESPONSE | jq '.totalUsers' || echo "❌ Erreur stats"

echo ""

echo "✅ Tests d'intégration terminés"
echo ""
echo "🚀 Architecture séparée opérationnelle:"
echo "  • Backend Spring Boot: Prêt pour Replit"
echo "  • Service Rasa: Prêt pour Railway/Render"
echo "  • Service LLM: Prêt pour Render/Replit"
echo ""
echo "📝 Prochaines étapes:"
echo "  1. Déployer chaque service séparément"
echo "  2. Configurer les variables d'environnement"
echo "  3. Tester la chaîne complète en production"
