# USTHB Chat - Assistant IA

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

> Assistant IA moderne pour l'entrepreneuriat et l'innovation, développé avec Next.js et Spring Boot.

## 🚀 Démarrage rapide

### Installation

\`\`\`bash
# Cloner le projet
git clone <your-repo-url>
cd usthb-chat

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer en développement
npm run dev
\`\`\`

### Configuration Vercel

1. **Variables d'environnement** :
   \`\`\`
   NEXT_PUBLIC_API_URL=https://your-spring-boot-api.herokuapp.com/api
   \`\`\`

2. **Déploiement** :
   \`\`\`bash
   # Via GitHub (recommandé)
   git push origin main
   
   # Ou via CLI
   npm i -g vercel
   vercel --prod
   \`\`\`

## ✨ Fonctionnalités

- ✅ **Authentification JWT** complète
- ✅ **Interface responsive** mobile/desktop
- ✅ **Gestion des conversations** avec historique
- ✅ **Intégration API Spring Boot** + fallback localStorage
- ✅ **Animations fluides** avec Framer Motion
- ✅ **Prêt pour la production**

## 🏗️ Architecture

\`\`\`
Frontend (Next.js) ↔ Backend (Spring Boot) ↔ Base de données
                   ↕
              LocalStorage (Fallback)
\`\`\`

## 📚 Documentation complète

Voir le [README complet](./DOCUMENTATION.md) pour :
- Guide d'installation détaillé
- Configuration backend Spring Boot
- API Reference
- Guide de déploiement
- Dépannage

## 🤝 Support

- 🐛 Issues : [GitHub Issues](https://github.com/your-username/usthb-chat/issues)
- 📧 Email : support@usthb-chat.com

---

**Fait avec ❤️ pour l'écosystème entrepreneurial algérien**
