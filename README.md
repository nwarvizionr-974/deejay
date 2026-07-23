# Loïc Animation — site vitrine one-page

Site statique responsive, sans framework, prêt à être publié sur GitHub Pages.

## Contenu

- Présentation des services
- Trois formules événementielles
- Calculateur de devis indicatif
- Ajout d'options et de matériel à louer
- Catalogue filtrable
- Carrousel photo
- Vidéo YouTube
- Avis Google (lien + cartes manuelles)
- Ambiance sonore générée dans le navigateur
- Formulaire de demande de devis

## Personnalisation rapide

La majorité du contenu est centralisée dans `data.js` :

- coordonnées
- formules et tarifs
- options
- produits de location
- galerie
- vidéo YouTube
- avis
- règles de calcul

### Remplacer le logo

Remplacez `assets/logo.svg` par le logo du prestataire en conservant le même nom, ou modifiez les chemins dans `index.html`.

### Ajouter des photos

1. Déposez les images dans `assets/gallery/`.
2. Ajoutez une entrée dans le tableau `gallery` de `data.js`.

Exemple :

```js
{ src: "assets/gallery/mariage.jpg", alt: "Mariage à Saint-Denis", caption: "Mariages" }
```

### Ajouter une vidéo YouTube

Dans `data.js`, remplacez :

```js
youtubeVideoId: "ysz5S6PUM-U"
```

par l'identifiant de la vidéo YouTube.

### Avis Google

- Remplacez `googleReviewsUrl` par le lien réel de la fiche Google Business.
- Remplacez les exemples dans le tableau `reviews` par des avis réels et autorisés.
- La synchronisation automatique d'avis Google nécessite un service tiers ou l'API Google Places, non incluse dans cette version statique.

## Formulaire de contact

Par défaut, le formulaire prépare un email dans la messagerie du visiteur et copie le texte de la demande dans le presse-papiers.

Pour un envoi direct sans serveur :

1. Créez un formulaire sur Formspree.
2. Copiez l'URL de l'endpoint.
3. Collez-la dans `data.js` :

```js
formEndpoint: "https://formspree.io/f/xxxxxxx"
```

## Tester localement

Double-cliquez sur `index.html`, ou lancez un petit serveur local :

```bash
python -m http.server 8000
```

Puis ouvrez `http://localhost:8000`.

## Déployer sur GitHub Pages

1. Créez un dépôt GitHub.
2. Ajoutez tous les fichiers à la racine du dépôt.
3. Dans **Settings > Pages**, choisissez la branche `main` et le dossier `/root`.
4. Enregistrez : le site sera publié avec une URL GitHub Pages.

## À remplacer avant livraison au client

- Logo officiel
- Téléphone et email
- Lien WhatsApp
- Lien de la fiche Google
- Photos et vidéo
- Avis réels
- Tarifs définitifs
- Mentions légales et politique de confidentialité
