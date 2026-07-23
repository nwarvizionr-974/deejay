/**
 * FICHIER PRINCIPAL À MODIFIER
 * Remplacez ici les coordonnées, tarifs, photos, vidéo, formules et matériels.
 */
window.SITE_DATA = {
  contact: {
    phone: "+262 692 74 12 42",
    email: "loic.animation.dj@gmail.com",
    whatsapp: "262692741242",
    googleReviewsUrl: "https://www.google.com/search?q=Loic+Animation+avis",
    // Facultatif : collez ici votre endpoint Formspree, ex. https://formspree.io/f/xxxxxxx
    formEndpoint: ""
  },

  eventTypes: [
    "Mariage",
    "Anniversaire",
    "Soirée privée",
    "Événement d'entreprise",
    "Association / collectivité",
    "Autre événement"
  ],

  packages: [
    {
      id: "essentiel",
      name: "Essentiel",
      tag: "Simple & efficace",
      price: 490,
      description: "Une solution complète pour une ambiance musicale de qualité.",
      features: ["Sonorisation jusqu'à 100 personnes", "Animation musicale", "Éclairage d'ambiance", "Installation et démontage"]
    },
    {
      id: "premium",
      name: "Premium",
      tag: "Le plus choisi",
      price: 790,
      featured: true,
      description: "Plus d'impact visuel, plus de confort et une animation renforcée.",
      features: ["Sonorisation jusqu'à 200 personnes", "Animation personnalisée", "Éclairage dynamique", "1 micro sans fil", "Rendez-vous de préparation"]
    },
    {
      id: "signature",
      name: "Signature",
      tag: "Expérience complète",
      price: 1190,
      description: "Une scénographie son et lumière pensée pour les événements majeurs.",
      features: ["Sonorisation grande capacité", "Show lumière complet", "2 micros sans fil", "Machine à effets", "Coordination des temps forts", "Accompagnement sur mesure"]
    }
  ],

  addons: [
    { id: "ceremony", name: "Sonorisation de cérémonie", price: 180 },
    { id: "wirelessMic", name: "Micro sans fil supplémentaire", price: 45 },
    { id: "uplights", name: "Éclairage décoratif de salle", price: 160 },
    { id: "fog", name: "Machine à fumée légère", price: 70 },
    { id: "spark", name: "Effet étincelles froides", price: 240 },
    { id: "late", name: "Heure supplémentaire", price: 90 }
  ],

  rentals: [
    { id: "speaker12", category: "Son", name: "Enceinte amplifiée 12 pouces", price: 55, unit: "/ jour", icon: "◉" },
    { id: "speaker15", category: "Son", name: "Enceinte amplifiée 15 pouces", price: 75, unit: "/ jour", icon: "◉" },
    { id: "subwoofer", category: "Son", name: "Caisson de basses", price: 90, unit: "/ jour", icon: "◌" },
    { id: "mixer", category: "Son", name: "Table de mixage", price: 45, unit: "/ jour", icon: "≋" },
    { id: "mic", category: "Micros", name: "Micro sans fil", price: 35, unit: "/ jour", icon: "♩" },
    { id: "lightbar", category: "Lumière", name: "Barre LED", price: 35, unit: "/ jour", icon: "✦" },
    { id: "movinghead", category: "Lumière", name: "Lyre motorisée", price: 65, unit: "/ jour", icon: "✧" },
    { id: "smoke", category: "Effets", name: "Machine à fumée", price: 45, unit: "/ jour", icon: "☁" }
  ],

  gallery: [
    { src: "assets/gallery/event-1.svg", alt: "Piste de danse éclairée", caption: "Mariages" },
    { src: "assets/gallery/event-2.svg", alt: "Scène avec éclairage violet", caption: "Soirées privées" },
    { src: "assets/gallery/event-3.svg", alt: "Installation son et lumière", caption: "Événements professionnels" },
    { src: "assets/gallery/event-4.svg", alt: "DJ et public en fête", caption: "Anniversaires" }
  ],

  youtubeVideoId: "pPcRPX8Z_Kc",

  reviews: [
    { name: "Client mariage", rating: 5, text: "Une animation fluide, une très bonne écoute et une piste de danse pleine jusqu'à la fin." },
    { name: "Entreprise locale", rating: 5, text: "Matériel propre, installation ponctuelle et sonorisation parfaitement adaptée à notre événement." },
    { name: "Soirée privée", rating: 5, text: "Très belle ambiance et excellente adaptation aux invités. Nous recommandons sans hésiter." }
  ],

  pricingRules: {
    guestThreshold: 120,
    extraPerGuest: 3,
    extraHourFrom: 6,
    extraHourPrice: 90
  }
};
