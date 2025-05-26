
# 📁 USTHB-Bot Project Structure

```
usthb-bot/
├── 🖥️ Backend (Spring Boot)
│   ├── src/main/java/com/chatbot/
│   │   ├── 🔧 config/           # Configuration classes
│   │   ├── 🎮 controller/       # REST endpoints
│   │   ├── 📦 dto/              # Data transfer objects
│   │   ├── 🗃️ model/            # JPA entities
│   │   ├── 📚 repository/       # Data access layer
│   │   ├── 🔒 security/         # Authentication & authorization
│   │   └── ⚙️ service/          # Business logic
│   └── src/main/resources/
│       ├── application.yml      # Development config
│       └── application-prod.yml # Production config
│
├── 🤖 AI Services
│   ├── Chatbot_USTHB_Github/    # Rasa configuration
│   │   ├── data/                # Training data
│   │   ├── actions/             # Custom actions
│   │   ├── config.yml           # Rasa pipeline
│   │   └── domain.yml           # Bot domain
│   └── llm_server.py            # LLM service
│
├── 🚀 Deployment
│   ├── scripts/                 # Startup scripts
│   │   ├── start-backend.sh
│   │   ├── start-rasa.sh
│   │   └── start-llm.sh
│   └── docker/                  # Container configs
│       ├── backend/
│       ├── rasa/
│       └── llm/
│
├── 📄 Documentation
│   ├── README.md                # Main documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── ARCHITECTURE.md          # System architecture
│   └── API.md                   # API documentation
│
└── 🔧 Configuration
    ├── .replit                  # Replit configuration
    ├── pom.xml                  # Maven dependencies
    └── requirements.txt         # Python dependencies
```

## Clean Code Benefits

### ✅ Maintainability
- Clear separation of concerns
- Consistent naming conventions
- Self-documenting code structure

### ✅ Scalability
- Microservices architecture
- Independent deployment
- Load balancing ready

### ✅ Testability
- Isolated components
- Dependency injection
- Mock-friendly design

### ✅ Readability
- Logical folder organization
- Meaningful file names
- Clear documentation
