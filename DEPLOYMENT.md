
# 🚀 USTHB-Bot Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USTHB-Bot Microservices                  │
└─────────────────────────────────────────────────────────────┘

📱 Frontend (Next.js)     🖥️  Backend (Spring Boot)     🤖 AI Services
   Port 3000         ←→     Port 8080            ←→    Rasa (5005)
                                                        LLM  (5001)
```

## Quick Start

### 1. Environment Setup
```bash
# Required environment variables
export JWT_SECRET="your-secret-key"
export DATABASE_URL="postgresql://localhost:5432/chatbot_db"
export RASA_URL="http://0.0.0.0:5005"
export LLM_URL="http://0.0.0.0:5001"
```

### 2. Single Command Deployment
```bash
# Start all services
npm run deploy:full

# Or individual services
npm run deploy:backend
npm run deploy:rasa
npm run deploy:llm
```

## Service Architecture

### 🖥️ Backend Service (Port 8080)
- **Technology**: Spring Boot 3.x + Java 17
- **Database**: PostgreSQL
- **Authentication**: JWT
- **API**: REST + WebClient for external services

### 🤖 Rasa Service (Port 5005)
- **Technology**: Rasa Open Source 3.6
- **Function**: NLU + Dialogue Management
- **Training**: Automatic on dataset updates

### 🧠 LLM Service (Port 5001)
- **Technology**: Python Flask
- **Function**: PDF processing + Dataset generation
- **Integration**: REST API with Spring Boot

## Clean Code Principles Applied

### 1. Separation of Concerns
- Each service has single responsibility
- Clear boundaries between layers
- Isolated configurations

### 2. Dependency Injection
- Spring Boot manages all dependencies
- WebClient beans for external services
- Configuration properties externalized

### 3. Error Handling
- Centralized exception handling
- Graceful degradation for external services
- Comprehensive logging

### 4. Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Health checks for all services

## Production Deployment

### Replit Deployment
1. Set environment variables in Secrets
2. Click "Deploy" button
3. Services auto-scale based on demand

### Health Monitoring
- `/api/health/status` - Backend health
- `http://0.0.0.0:5005/` - Rasa health
- `http://0.0.0.0:5001/health` - LLM health

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 5005, 5001, 8080 are available
2. **Database connection**: Check DATABASE_URL format
3. **Service timeouts**: Increase timeout values in application.yml

### Logs Location
- Backend: Console output + Spring Boot logs
- Rasa: `/logs/rasa.log`
- LLM: Console output

## Performance Optimization

### Backend
- Connection pooling enabled
- Lazy loading for JPA entities
- Caching for frequent queries

### Rasa
- Model warming on startup
- Efficient NLU pipeline
- Intent confidence thresholds

### LLM
- Async processing for large files
- Memory management for PDF parsing
- Request queuing for high load
