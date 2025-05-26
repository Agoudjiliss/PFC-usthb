# Documentation du Dashboard Admin - Plateforme SaaS IA

Cette documentation décrit l'architecture, les composants et l'utilisation du dashboard administratif pour la plateforme SaaS IA destinée aux utilisateurs algériens.

## 📁 Structure des dossiers

Le projet suit l'architecture Next.js App Router avec la structure suivante:

\`\`\`
/
├── app/                    # Routes de l'application
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Page d'accueil (Overview)
│   ├── resources/          # Gestion des ressources
│   │   └── page.tsx        # Page des ressources
│   ├── intents/            # Gestion des intents et FAQ
│   │   └── page.tsx        # Page des intents
│   ├── training/           # Statut d'entraînement
│   │   └── page.tsx        # Page de statut d'entraînement
│   └── settings/           # Paramètres du chatbot
│       └── page.tsx        # Page des paramètres
├── components/             # Composants réutilisables
│   ├── ui/                 # Composants UI de base (shadcn/ui)
│   ├── sidebar.tsx         # Barre latérale de navigation
│   ├── dashboard-header.tsx # En-tête du dashboard
│   ├── stats-card.tsx      # Cartes de statistiques
│   ├── intents-table.tsx   # Tableau des intents
│   ├── faq-table.tsx       # Tableau des FAQ
│   └── ...                 # Autres composants
└── lib/                    # Utilitaires et fonctions
    └── utils.ts            # Fonctions utilitaires
\`\`\`

## 🧩 Composants principaux

### Layout et Navigation

- **Sidebar**: Barre latérale de navigation avec sections Favoris et Navigation complète
- **DashboardHeader**: En-tête affichant le titre de la page et des actions contextuelles

### Composants de données

- **StatsCard**: Affiche une statistique avec titre, valeur et tendance
- **UsersChart**: Graphique linéaire pour visualiser les tendances d'utilisateurs
- **ContentEngagement**: Visualisation de l'engagement par contenu
- **TrafficByDevice**: Graphique à barres montrant le trafic par appareil
- **TrafficByLocation**: Graphique en anneau montrant le trafic par localisation

### Tableaux et listes

- **IntentsTable**: Tableau des intents avec actions (voir, éditer, supprimer)
- **FAQTable**: Tableau des questions fréquentes avec statistiques de fréquence
- **ResourcesTable**: Tableau des ressources avec filtres et actions
- **ResourcesGrid**: Vue en grille des ressources
- **TrainingResourcesTable**: Tableau des ressources d'entraînement
- **TrainingHistory**: Historique des entraînements du modèle

### Modals et dialogues

- **AddIntentDialog**: Modal pour ajouter un nouvel intent
- **EditIntentDialog**: Modal pour éditer un intent existant
- **AddResourceDialog**: Modal pour ajouter une nouvelle ressource

### Paramètres et configuration

- **SettingsPage**: Page de configuration du chatbot avec onglets pour différentes sections

## ⚙️ Hooks et Context

Le projet utilise plusieurs hooks personnalisés:

- **useIsMobile**: Détecte si l'appareil est mobile pour adapter l'interface
- **useToast**: Affiche des notifications toast à l'utilisateur

## 🧪 Lancement du projet en local

Pour lancer le projet en local:

\`\`\`bash
# Cloner le dépôt
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

Le projet sera accessible à l'adresse `http://localhost:3000`.

## 🧩 Librairies externes utilisées

- **Next.js**: Framework React pour le rendu côté serveur et le routage
- **React**: Bibliothèque UI pour construire l'interface
- **Tailwind CSS**: Framework CSS utilitaire pour le styling
- **shadcn/ui**: Composants UI réutilisables basés sur Radix UI
- **Lucide React**: Bibliothèque d'icônes
- **Chart.js/React-Chartjs-2**: Bibliothèque de visualisation de données pour les graphiques
- **React Hook Form**: Gestion des formulaires (utilisé dans les modals)

## 🔄 Flux de données

Le dashboard est conçu pour communiquer avec une API REST backend. Les principales interactions sont:

1. **Authentification**: Toutes les requêtes incluent un token JWT dans l'en-tête
2. **Chargement initial**: Récupération des données au chargement des pages
3. **Actions CRUD**: Création, lecture, mise à jour et suppression des ressources via API
4. **Temps réel**: Certaines données (comme le statut d'entraînement) peuvent être mises à jour en temps réel

## 🎨 Thème et personnalisation

Le thème utilise une palette de couleurs cohérente avec des variables CSS pour faciliter la personnalisation:

- Couleur principale: `#9f9ff8` (violet)
- Couleur d'accent: `#edeefc` (violet clair)
- Couleurs de graphiques: bleu, vert, violet, orange

Pour modifier le thème, ajustez les variables dans `globals.css`.
