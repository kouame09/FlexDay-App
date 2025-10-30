# TaskFlow

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

TaskFlow est une application de gestion de tâches moderne et intuitive, développée avec React, TypeScript et Tailwind CSS. Elle permet de créer, organiser et suivre vos tâches quotidiennes de manière efficace.

## ✨ Fonctionnalités

- 📝 Création et gestion de tâches avec titre, description, date et heure d'échéance
- 🏷️ Organisation par étiquettes (tags) personnalisables
- ✅ Sous-tâches pour décomposer les tâches complexes
- 🎨 Interface moderne avec thème clair/sombre
- 📱 Design responsive pour une utilisation sur tous les appareils
- 💾 Sauvegarde locale des tâches (localStorage)
- 🎉 Animations fluides avec Framer Motion
- 🔔 Notifications toast pour le feedback utilisateur

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque JavaScript pour les interfaces utilisateur
- **TypeScript** - JavaScript typé pour une meilleure expérience de développement
- **Tailwind CSS** - Framework CSS utilitaire pour un design personnalisable
- **Vite** - Outil de build ultra-rapide
- **Framer Motion** - Bibliothèque d'animations
- **React Hot Toast** - Notifications utilisateur élégantes
- **Lucide React** - Icônes modernes

## 📦 Installation

1. Clonez le dépôt :
   ```bash
   git clone [URL_DU_DEPOT]
   cd TaskFlow
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## 🔨 Construction pour la production

Pour créer une version de production optimisée :

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```

## 🧩 Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── AddTodo.tsx   # Formulaire d'ajout/édition de tâche
│   ├── ColorPicker.tsx # Sélecteur de couleurs pour les tags
│   ├── ThemeToggle.tsx # Bouton de basculement de thème
│   └── TodoItem.tsx  # Composant d'affichage d'une tâche
├── types/
│   └── Todo.ts      # Définitions de types TypeScript
├── App.tsx          # Composant principal
└── main.tsx         # Point d'entrée de l'application
```

## 📝 Types de données

### Tâche (Todo)
```typescript
interface Todo {
  id: string;              // Identifiant unique
  text: string;            // Titre de la tâche
  description?: string;     // Description détaillée
  dueDate?: string;        // Date d'échéance (format YYYY-MM-DD)
  dueTime?: string;        // Heure d'échéance (format HH:MM)
  completed: boolean;      // État d'achèvement
  createdAt: number;       // Horodatage de création
  tags: Tag[];             // Étiquettes associées
  subTasks: SubTask[];     // Sous-tâches
}
```

### Sous-tâche (SubTask)
```typescript
interface SubTask {
  id: string;      // Identifiant unique
  text: string;    // Description
  completed: boolean; // État d'achèvement
}
```

### Étiquette (Tag)
```typescript
interface Tag {
  id: string;      // Identifiant unique
  name: string;    // Nom de l'étiquette
  color: string;   // Couleur au format hexadécimal
}
```

## 🎨 Thèmes

L'application propose deux thèmes :
- ☀️ Clair (par défaut)
- 🌙 Sombre

Le thème est persistant entre les sessions via le `localStorage`.

## 📱 Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Mobile-friendly
- Mode hors ligne (sauvegarde locale des données)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [React Hot Toast](https://react-hot-toast.com/)

---

Développé avec ❤️ par [Votre Nom]
