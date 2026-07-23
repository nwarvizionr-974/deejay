const SITE_CONFIG = {
  brandName: "Pulse Event",
  contactEmail: "devis@votreentreprise.re",
  phoneDisplay: "+262 692 00 00 00",
  phoneLink: "+262692000000",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/"
};

const PRICING = {
  packages: {
    essentiel: { label: "Essentiel", price: 490, includedHours: 4, guestLimit: 80 },
    signature: { label: "Signature", price: 890, includedHours: 6, guestLimit: 180 },
    premium: { label: "Premium", price: 1490, includedHours: 8, guestLimit: 350 }
  },
  eventType: {
    anniversaire: { label: "Anniversaire / soirée privée", price: 0 },
    mariage: { label: "Mariage", price: 150 },
    entreprise: { label: "Événement d’entreprise", price: 120 },
    association: { label: "Événement associatif", price: 80 },
    exterieur: { label: "Événement extérieur", price: 180 }
  },
  addons: {
    "extra-speakers": { label: "Renfort son", price: 180 },
    "wireless-mic": { label: "Micro sans fil", price: 60 },
    "light-pack": { label: "Pack lumière +", price: 240 },
    "smoke-machine": { label: "Machine à fumée", price: 90 },
    "host": { label: "Animation micro", price: 220 },
    "setup-day-before": { label: "Installation anticipée", price: 150 }
  },
  extraHour: 80,
  guestOverflowStep: 50,
  guestOverflowPrice: 120
};

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initNavigation();
  initReveal();
  initEstimator();
  initSound();
  initVisualDetails();
});

function applyConfig() {
  document.querySelectorAll('[data-config="brandName"]').forEach(el => {
    el.textContent = SITE_CONFIG.brandName;
  });

  document.querySelectorAll('[data-config-href="phone"]').forEach(el => {
    el.textContent = SITE_CONFIG.phoneDisplay;
    el.href = `tel:${SITE_CONFIG.phoneLink}`;
  });

  const instagram = document.querySelector('[data-config-href="instagram"]');
  const facebook = document.querySelector('[data-config-href="facebook"]');
  if (instagram) instagram.href = SITE_CONFIG.instagram;
  if (facebook) facebook.href = SITE_CONFIG.facebook;

  document.title = `${SITE_CONFIG.brandName} — Son, lumière & animation`;
  document.getElementById("year").textContent = new Date().getFullYear();

  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().slice(0, 10);
  }
}

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) return closeMenu();

    document.body.classList.add("menu-open");
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
  });

  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    observer.observe(el);
  });
}

function initEstimator() {
  const form = document.getElementById("quoteForm");
  const amount = document.getElementById("estimateAmount");
  const breakdown = document.getElementById("estimateBreakdown");
  const packageButtons = document.querySelectorAll("[data-select-package]");

  function getEstimate() {
    const data = new FormData(form);
    const packageKey = data.get("package") || "signature";
    const packageInfo = PRICING.packages[packageKey];
    const eventKey = data.get("eventType");
    const eventInfo = PRICING.eventType[eventKey] || { label: "Type d’événement", price: 0 };
    const guests = Math.max(1, Number(data.get("guests")) || 1);
    const duration = Math.max(1, Number(data.get("duration")) || packageInfo.includedHours);
    const selectedAddons = data.getAll("addons");

    const lines = [
      { label: `Formule ${packageInfo.label}`, price: packageInfo.price }
    ];

    if (eventInfo.price > 0) {
      lines.push({ label: `Adaptation ${eventInfo.label.toLowerCase()}`, price: eventInfo.price });
    }

    const extraHours = Math.max(0, duration - packageInfo.includedHours);
    if (extraHours > 0) {
      lines.push({ label: `${extraHours} h supplémentaire${extraHours > 1 ? "s" : ""}`, price: extraHours * PRICING.extraHour });
    }

    const guestOverflow = Math.max(0, guests - packageInfo.guestLimit);
    if (guestOverflow > 0) {
      const steps = Math.ceil(guestOverflow / PRICING.guestOverflowStep);
      lines.push({ label: `Renfort capacité (${guests} invités)`, price: steps * PRICING.guestOverflowPrice });
    }

    selectedAddons.forEach(key => {
      const addon = PRICING.addons[key];
      if (addon) lines.push({ label: addon.label, price: addon.price });
    });

    const total = lines.reduce((sum, line) => sum + line.price, 0);
    return { total, lines, packageInfo, eventInfo, guests, duration, selectedAddons };
  }

  function renderEstimate() {
    const estimate = getEstimate();
    amount.textContent = euro.format(estimate.total);
    breakdown.innerHTML = estimate.lines
      .map(line => `<div><span>${escapeHtml(line.label)}</span><b>${euro.format(line.price)}</b></div>`)
      .join("");
  }

  form.addEventListener("input", renderEstimate);
  form.addEventListener("change", renderEstimate);

  packageButtons.forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.selectPackage;
      const radio = form.querySelector(`input[name="package"][value="${value}"]`);
      if (radio) {
        radio.checked = true;
        renderEstimate();
        document.getElementById("devis").scrollIntoView({ behavior: "smooth", block: "start" });
        showToast(`Formule ${PRICING.packages[value].label} sélectionnée`);
      }
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    clearErrors();

    if (!validateForm(form)) {
      showToast("Merci de vérifier les champs obligatoires.");
      return;
    }

    const estimate = getEstimate();
    const data = new FormData(form);
    const addonLabels = estimate.selectedAddons
      .map(key => PRICING.addons[key]?.label)
      .filter(Boolean);

    const subject = `Demande de devis — ${estimate.eventInfo.label || "Événement"} — ${data.get("date")}`;
    const body = [
      `Bonjour ${SITE_CONFIG.brandName},`,
      "",
      "Je souhaite recevoir un devis pour l’événement suivant :",
      "",
      `Nom : ${data.get("name")}`,
      `Téléphone : ${data.get("phone")}`,
      `E-mail : ${data.get("email")}`,
      `Date : ${formatDate(data.get("date"))}`,
      `Type : ${estimate.eventInfo.label || data.get("eventType")}`,
      `Lieu : ${data.get("location")}`,
      `Nombre d’invités : ${estimate.guests}`,
      `Durée : ${estimate.duration} heures`,
      `Formule : ${estimate.packageInfo.label}`,
      `Options : ${addonLabels.length ? addonLabels.join(", ") : "Aucune"}`,
      "",
      `Estimation indicative : ${euro.format(estimate.total)}`,
      "",
      "Précisions :",
      data.get("message") || "Aucune précision complémentaire.",
      "",
      "Merci de me recontacter pour confirmer les besoins et le tarif final."
    ].join("\n");

    const mailto = `mailto:${encodeURIComponent(SITE_CONFIG.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    showToast("Votre messagerie va s’ouvrir avec la demande préremplie.");
  });

  renderEstimate();
}

function validateForm(form) {
  let valid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach(field => {
    if (field.type === "radio") return;

    const valueMissing = field.type === "checkbox" ? !field.checked : !field.value.trim();
    const typeMismatch = field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    const datePast = field.type === "date" && field.value && new Date(`${field.value}T23:59:59`) < new Date();

    if (valueMissing || typeMismatch || datePast) {
      valid = false;
      field.classList.add("is-invalid");
      const error = field.parentElement.querySelector(".field-error");
      if (error) {
        error.textContent = typeMismatch
          ? "Adresse e-mail invalide."
          : datePast
          ? "Choisissez une date future."
          : "Ce champ est obligatoire.";
      }
    }
  });

  if (!form.querySelector('input[name="package"]:checked')) valid = false;
  return valid;
}

function clearErrors() {
  document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
  document.querySelectorAll(".field-error").forEach(el => (el.textContent = ""));
}

function formatDate(value) {
  if (!value) return "Non précisée";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initSound() {
  const button = document.getElementById("soundToggle");
  const label = button.querySelector(".sound-label");
  let context = null;
  let master = null;
  let sources = [];

  async function startAmbient() {
    context = context || new (window.AudioContext || window.webkitAudioContext)();
    await context.resume();

    master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.028, context.currentTime + 1.2);
    master.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;
    filter.connect(master);

    [55, 82.41, 110].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.34 : 0.12;

      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.value = 0.06 + index * 0.025;
      lfoGain.gain.value = 2.5 + index;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();
      lfo.start();
      sources.push(oscillator, lfo);
    });

    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Désactiver l'ambiance sonore");
    label.textContent = "Ambiance ON";
  }

  function stopAmbient() {
    if (master && context) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + .45);
    }

    setTimeout(() => {
      sources.forEach(source => {
        try { source.stop(); } catch (_) {}
      });
      sources = [];
      master = null;
    }, 500);

    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Activer l'ambiance sonore");
    label.textContent = "Ambiance OFF";
  }

  button.addEventListener("click", async () => {
    const isOn = button.getAttribute("aria-pressed") === "true";
    if (isOn) stopAmbient();
    else {
      try {
        await startAmbient();
        showToast("Ambiance sonore activée à faible volume.");
      } catch (error) {
        console.error(error);
        showToast("Le navigateur n’a pas autorisé le son.");
      }
    }
  });
}

function initVisualDetails() {
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.style.background = window.scrollY > 80
      ? "rgba(8,11,22,.90)"
      : "rgba(8,11,22,.72)";
  }, { passive: true });
}
