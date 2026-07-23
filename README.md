# Pulse Event — Site vitrine one-page

Mini-site autonome pour une activité d’animation événementielle et de location de matériel son/lumière.

## Fonctionnalités

- Design premium, responsive et animé
- Présentation des services
- 3 formules tarifaires
- Options complémentaires
- Estimation automatique du budget
- Ajustement selon le type d’événement, la durée et le nombre d’invités
- Formulaire avec validation
- Génération d’un e-mail de demande de devis prérempli
- Ambiance sonore synthétique activable par le visiteur
- Aucun framework ni installation nécessaire

## Tester le site

Double-cliquez sur `index.html`.

Pour un test plus proche de la mise en ligne, lancez un petit serveur local :

```bash
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Personnaliser les informations

Ouvrez `script.js` et modifiez l’objet `SITE_CONFIG` :

```js
const SITE_CONFIG = {
  brandName: "Nom de l’entreprise",
  contactEmail: "contact@entreprise.re",
  phoneDisplay: "+262 692 00 00 00",
  phoneLink: "+262692000000",
  instagram: "https://instagram.com/votrecompte",
  facebook: "https://facebook.com/votrepage"
};
```

## Modifier les tarifs

Toujours dans `script.js`, adaptez l’objet `PRICING`.

Les prix visibles dans les cartes et dans le formulaire sont aussi écrits dans `index.html`. Pensez à les mettre à jour pour garder le même affichage partout.

## Fonctionnement du formulaire

Dans cette version de démonstration, le bouton final ouvre l’application de messagerie du visiteur avec toutes les informations préremplies.

Pour recevoir les demandes sans passer par le logiciel de messagerie, vous pouvez ensuite connecter :

- Formspree
- Netlify Forms
- EmailJS
- Un formulaire PHP
- Une API ou un CRM

## Mise en ligne sur GitHub Pages

1. Créez un nouveau dépôt GitHub.
2. Ajoutez tous les fichiers du dossier.
3. Ouvrez `Settings` > `Pages`.
4. Choisissez `Deploy from a branch`.
5. Sélectionnez la branche `main` et le dossier `/root`.
6. Enregistrez.

GitHub fournira une adresse publique de test.

## Arborescence

```text
sono-event-onepage/
├── index.html
├── styles.css
├── script.js
├── README.md
├── .gitignore
└── assets/
    └── favicon.svg
```

## Remarques

- L’ambiance sonore ne démarre jamais automatiquement : les navigateurs exigent une action volontaire du visiteur.
- Les montants sont indiqués comme estimations non contractuelles.
- Remplacez impérativement l’e-mail, le téléphone, les réseaux sociaux et les tarifs avant présentation finale.
