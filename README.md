# Sambukila 4.0 - Event Management & Marketplace App

Une application mobile complète de gestion d'événements, invitations digitales et marketplace de prestataires, construite avec React Native, Expo et Supabase.

## 🚀 Fonctionnalités

### Pour les Clients
- **Gestion d'événements** : Création, édition et gestion d'événements
- **Invitations digitales** : Invitations personnalisées avec QR codes uniques
- **Marketplace** : Découverte et réservation de prestataires vérifiés
- **Chat temps réel** : Communication directe avec les prestataires
- **Paiements sécurisés** : Intégration Stripe pour les paiements
- **Système d'avis** : Évaluation des prestataires après service

### Pour les Prestataires
- **Profil professionnel** : Showcase de services et portfolio
- **Gestion des réservations** : Acceptation/refus des demandes clients
- **Chat client** : Communication avec les clients potentiels
- **Validation admin** : Processus de vérification pour être visible

### Pour les Administrateurs
- **Validation des prestataires** : Approbation/refus avec commentaires
- **Vue d'ensemble** : Monitoring des activités de la plateforme

## 🛠 Stack Technique

- **Frontend** : React Native avec Expo (SDK 52)
- **Language** : TypeScript
- **UI/Styling** : NativeWind (Tailwind CSS pour React Native)
- **Navigation** : Expo Router
- **State Management** : Zustand + TanStack Query
- **Backend** : Supabase (Auth, Database, Realtime, Storage)
- **Paiements** : Stripe (mode test)
- **Icônes** : Lucide React Native

## 📦 Installation et Setup

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI
- Compte Supabase
- Compte Stripe (mode test)

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com)
2. Copiez `.env.example` vers `.env` et remplissez les variables :

```env
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_cle_publique_stripe_test
```

3. Exécutez les migrations SQL :
   - Allez dans l'onglet SQL de votre projet Supabase
   - Exécutez le contenu de `supabase/migrations/create_initial_schema.sql`
   - Puis exécutez `supabase/migrations/seed_initial_data.sql`

4. Configurez les buckets Storage :
   - Créez un bucket `public-media` (public)
   - Créez un bucket `invites` (public)

### 3. Configuration Stripe

1. Créez un compte Stripe et récupérez vos clés de test
2. Ajoutez la clé publique dans votre fichier `.env`

### 4. Démarrage de l'application

```bash
npm run dev
```

## 🗄 Structure de la Base de Données

### Tables Principales

- **profiles** : Profils utilisateurs avec rôles (customer, vendor, admin)
- **vendor_profiles** : Informations spécifiques aux prestataires
- **events** : Événements créés par les clients
- **event_guests** : Invités avec QR codes et statuts RSVP
- **bookings** : Réservations entre clients et prestataires
- **messages/threads** : Système de chat temps réel
- **reviews** : Avis clients sur les prestataires
- **payments** : Enregistrements des paiements

### Sécurité RLS (Row Level Security)

Toutes les tables sont protégées par des politiques RLS strictes :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les prestataires approuvés sont visibles aux clients
- Les admins ont accès complet pour la modération

## 🎨 Architecture des Composants

### Composants UI Réutilisables
- `Button` : Boutons avec variantes et états de chargement
- `Card` : Cartes avec ombres et variantes
- `Avatar` : Avatars avec fallback texte
- `RatingStars` : Affichage des notes avec étoiles
- `EmptyState` : États vides avec actions

### Hooks Personnalisés
- `useAuth` : Gestion de l'authentification et profil utilisateur
- `useFrameworkReady` : Initialisation du framework (obligatoire)

## 📱 Navigation

L'application utilise expo-router avec une navigation par onglets adaptée au rôle :

### Client
- Accueil (marketplace)
- Mes événements
- Réservations
- Messages
- Profil

### Prestataire
- Mon espace
- Réservations
- Messages
- Profil

### Admin
- Administration
- Profil

## 🧪 Données de Test

L'application inclut des données de démonstration :

**Comptes utilisateurs** :
- Admin : admin@sambukila.com
- Client : marie.dupont@email.com
- Prestataires : Various approved/pending vendors

**Données incluses** :
- Prestataires dans toutes les catégories
- Événement exemple avec invités
- Conversations de chat
- Avis et évaluations

## 🚀 Déploiement

### Développement
```bash
npm run dev
```

### Build Web
```bash
npm run build:web
```

### Publication Mobile
Suivez la [documentation Expo](https://docs.expo.dev/distribution/introduction/) pour publier sur les stores.

## 🔧 Configuration Avancée

### Notifications Push
Configurez Expo Push Notifications pour les alertes temps réel.

### Gestion des Images
Les images sont stockées dans Supabase Storage avec URLs sécurisées.

### Internationalisation
Structure prévue pour l'ajout de langues (fichiers JSON).

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Stripe Documentation](https://stripe.com/docs)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement

---

**Sambukila 4.0** - Organisez vos événements parfaits ! 🎉