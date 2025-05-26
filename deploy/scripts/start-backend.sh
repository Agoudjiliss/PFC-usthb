
#!/bin/bash

echo "🚀 Starting USTHB-Bot Backend Service"

# Check environment variables
if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  Warning: JWT_SECRET not set, using default"
    export JWT_SECRET="defaultSecretKey"
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set, using default"
    export DATABASE_URL="jdbc:postgresql://localhost:5432/chatbot_db"
fi

# Set production profile
export SPRING_PROFILES_ACTIVE=prod

# Create uploads directory
mkdir -p uploads/datasets

echo "📦 Building application..."
mvn clean package -DskipTests

echo "🔄 Starting Spring Boot application..."
java -jar target/chatbot-backend-1.0.0.jar
