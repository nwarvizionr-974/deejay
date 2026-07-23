(() => {
  "use strict";

  const data = window.SITE_DATA;
  const state = {
    selectedPackage: data.packages[1]?.id || data.packages[0]?.id,
    selectedRentals: new Set(),
    rentalFilter: "Tous",
    slideIndex: 0,
    audio: null
  };

  const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function renderPackages() {
    const grid = $("#packageGrid");
    const select = $("#packageSelect");

    grid.innerHTML = data.packages.map(pkg => `
      <article class="package-card reveal ${pkg.featured ? "featured" : ""}">
        <span class="package-tag">${pkg.tag}</span>
        <h3>${pkg.name}</h3>
        <div class="package-price"><strong>${euro.format(pkg.price)}</strong><span>à partir de</span></div>
        <p>${pkg.description}</p>
        <ul>${pkg.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
        <button type="button" class="button package-cta" data-package="${pkg.id}">Choisir cette formule</button>
      </article>
    `).join("");

    select.innerHTML = data.packages.map(pkg => `
      <label class="package-choice">
        <input type="radio" name="package" value="${pkg.id}" ${pkg.id === state.selectedPackage ? "checked" : ""}>
        <span><strong>${pkg.name}</strong><small>Dès ${euro.format(pkg.price)}</small></span>
      </label>
    `).join("");

    $$(".package-cta").forEach(btn => btn.addEventListener("click", () => {
      state.selectedPackage = btn.dataset.package;
      const radio = $(`input[name="package"][value="${state.selectedPackage}"]`);
      if (radio) radio.checked = true;
      updateEstimate();
      $("#devis").scrollIntoView({ behavior: "smooth" });
    }));

    $$("input[name='package']").forEach(input => input.addEventListener("change", e => {
      state.selectedPackage = e.target.value;
      updateEstimate();
    }));
  }

  function renderEventTypes() {
    $("#eventType").innerHTML = data.eventTypes.map(type => `<option>${type}</option>`).join("");
  }

  function renderAddons() {
    $("#addonList").innerHTML = data.addons.map(addon => `
      <label class="option-row">
        <input type="checkbox" name="addons" value="${addon.id}">
        <span>${addon.name}</span>
        <strong>+ ${euro.format(addon.price)}</strong>
      </label>
    `).join("");
    $$("input[name='addons']").forEach(input => input.addEventListener("change", updateEstimate));
  }

  function renderRentalFilters() {
    const categories = ["Tous", ...new Set(data.rentals.map(item => item.category))];
    $("#rentalFilters").innerHTML = categories.map(category => `
      <button type="button" class="filter-button ${category === state.rentalFilter ? "active" : ""}" data-filter="${category}">${category}</button>
    `).join("");

    $$(".filter-button").forEach(button => button.addEventListener("click", () => {
      state.rentalFilter = button.dataset.filter;
      renderRentalFilters();
      renderRentals();
    }));
  }

  function renderRentals() {
    const list = state.rentalFilter === "Tous" ? data.rentals : data.rentals.filter(item => item.category === state.rentalFilter);
    $("#rentalGrid").innerHTML = list.map(item => `
      <article class="rental-card reveal ${state.selectedRentals.has(item.id) ? "selected" : ""}">
        <div class="rental-icon">${item.icon}</div>
        <span class="rental-category">${item.category}</span>
        <h3>${item.name}</h3>
        <div class="rental-bottom">
          <div class="rental-price"><strong>${euro.format(item.price)}</strong> <small>${item.unit}</small></div>
          <button class="rental-toggle" type="button" data-rental="${item.id}" aria-label="Ajouter ${item.name}">${state.selectedRentals.has(item.id) ? "✓" : "+"}</button>
        </div>
      </article>
    `).join("");

    $$(".rental-toggle").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.rental;
      state.selectedRentals.has(id) ? state.selectedRentals.delete(id) : state.selectedRentals.add(id);
      renderRentals();
      updateEstimate();
    }));
    observeReveals();
  }

  function renderGallery() {
    $("#carouselTrack").innerHTML = data.gallery.map(item => `
      <figure class="carousel-slide">
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <span>${item.caption}</span>
      </figure>
    `).join("");
  }

  function renderReviews() {
    $("#reviewsGrid").innerHTML = data.reviews.map(review => `
      <article class="review-card reveal">
        <div class="stars">${"★".repeat(review.rating)}</div>
        <p>“${review.text}”</p>
        <strong>${review.name}</strong>
      </article>
    `).join("");
  }

  function renderVideoAndContact() {
    $("#videoFrame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(data.youtubeVideoId)}" title="Vidéo Loïc Animation" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    $("#googleReviewsLink").href = data.contact.googleReviewsUrl;
    $("#phoneText").textContent = data.contact.phone;
    $("#phoneLink").href = `tel:${data.contact.phone.replace(/\s/g, "")}`;
    $("#emailText").textContent = data.contact.email;
    $("#emailLink").href = `mailto:${data.contact.email}`;
  }

  function selectedAddons() {
    return $$("input[name='addons']:checked").map(input => data.addons.find(addon => addon.id === input.value)).filter(Boolean);
  }

  function computeEstimate() {
    const pkg = data.packages.find(item => item.id === state.selectedPackage);
    if (!pkg) return { total: 0, lines: [] };

    const guests = Math.max(0, Number($("#guestCount")?.value || 0));
    const duration = Number($("#duration")?.value || 4);
    const addons = selectedAddons();
    const rentals = [...state.selectedRentals].map(id => data.rentals.find(item => item.id === id)).filter(Boolean);

    const guestExtra = guests > data.pricingRules.guestThreshold
      ? (guests - data.pricingRules.guestThreshold) * data.pricingRules.extraPerGuest
      : 0;
    const hourExtra = duration > data.pricingRules.extraHourFrom
      ? (duration - data.pricingRules.extraHourFrom) * data.pricingRules.extraHourPrice
      : 0;
    const addonsTotal = addons.reduce((sum, item) => sum + item.price, 0);
    const rentalsTotal = rentals.reduce((sum, item) => sum + item.price, 0);

    return {
      total: pkg.price + guestExtra + hourExtra + addonsTotal + rentalsTotal,
      lines: [
        `Formule ${pkg.name}`,
        guestExtra ? `capacité : +${euro.format(guestExtra)}` : null,
        hourExtra ? `durée : +${euro.format(hourExtra)}` : null,
        addons.length ? `${addons.length} option(s)` : null,
        rentals.length ? `${rentals.length} matériel(s)` : null
      ].filter(Boolean)
    };
  }

  function updateEstimate() {
    const estimate = computeEstimate();
    $("#estimateTotal").textContent = euro.format(estimate.total);
    $("#estimateDetails").textContent = `${estimate.lines.join(" • ")}. Estimation non contractuelle, hors déplacement et contraintes particulières.`;
  }

  function buildRequestText() {
    const estimate = computeEstimate();
    const pkg = data.packages.find(item => item.id === state.selectedPackage);
    const addons = selectedAddons().map(item => item.name).join(", ") || "Aucune";
    const rentals = [...state.selectedRentals].map(id => data.rentals.find(item => item.id === id)?.name).filter(Boolean).join(", ") || "Aucun";

    return [
      "Bonjour Loïc Animation,",
      "",
      "Je souhaite recevoir un devis pour l'événement suivant :",
      `• Nom : ${$("#fullName").value}`,
      `• Téléphone : ${$("#customerPhone").value}`,
      `• Email : ${$("#customerEmail").value}`,
      `• Contact préféré : ${$("#contactMode").value}`,
      `• Événement : ${$("#eventType").value}`,
      `• Date : ${$("#eventDate").value}`,
      `• Lieu : ${$("#location").value}`,
      `• Invités : ${$("#guestCount").value}`,
      `• Durée : ${$("#duration").value} h`,
      `• Formule : ${pkg?.name || "Non sélectionnée"}`,
      `• Options : ${addons}`,
      `• Location : ${rentals}`,
      `• Estimation indicative : ${euro.format(estimate.total)}`,
      `• Précisions : ${$("#message").value || "Aucune"}`,
      "",
      "Merci de me recontacter pour confirmer la disponibilité et le tarif final."
    ].join("\n");
  }

  async function submitQuote(event) {
    event.preventDefault();
    const status = $("#formStatus");
    if (!event.currentTarget.reportValidity()) return;

    const payload = {
      name: $("#fullName").value,
      email: $("#customerEmail").value,
      phone: $("#customerPhone").value,
      request: buildRequestText(),
      estimate: computeEstimate().total
    };

    try {
      if (data.contact.formEndpoint) {
        status.textContent = "Envoi en cours…";
        const response = await fetch(data.contact.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Échec de l'envoi");
        status.textContent = "Votre demande a bien été envoyée. Merci !";
        event.currentTarget.reset();
        state.selectedRentals.clear();
        renderRentals();
        updateEstimate();
        return;
      }

      const text = buildRequestText();
      await navigator.clipboard?.writeText(text).catch(() => {});
      const subject = encodeURIComponent(`Demande de devis — ${$("#eventType").value}`);
      const body = encodeURIComponent(text);
      window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${body}`;
      status.textContent = "Votre demande a été préparée dans votre messagerie et copiée dans le presse-papiers.";
    } catch (error) {
      status.textContent = "Impossible d'envoyer automatiquement. Contactez directement le prestataire par téléphone ou email.";
      console.error(error);
    }
  }

  function setupCarousel() {
    const track = $("#carouselTrack");
    const update = () => {
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const percentage = mobile ? 88 : 50;
      track.style.transform = `translateX(-${state.slideIndex * percentage}%)`;
    };
    $("#nextSlide").addEventListener("click", () => {
      state.slideIndex = Math.min(state.slideIndex + 1, data.gallery.length - 1);
      update();
    });
    $("#prevSlide").addEventListener("click", () => {
      state.slideIndex = Math.max(state.slideIndex - 1, 0);
      update();
    });
    window.addEventListener("resize", update);
  }

  function setupAmbientSound() {
    const button = $("#soundToggle");
    button.addEventListener("click", async () => {
      if (!state.audio) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const context = new AudioContext();
        const master = context.createGain();
        master.gain.value = 0.035;
        master.connect(context.destination);

        const notes = [110, 164.81, 220];
        const oscillators = notes.map((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = index === 0 ? "sine" : "triangle";
          oscillator.frequency.value = frequency;
          gain.gain.value = index === 0 ? .5 : .18;
          oscillator.connect(gain).connect(master);
          oscillator.start();
          return oscillator;
        });
        state.audio = { context, master, oscillators, enabled: true };
      } else if (state.audio.enabled) {
        state.audio.master.gain.setTargetAtTime(0, state.audio.context.currentTime, .08);
        state.audio.enabled = false;
      } else {
        await state.audio.context.resume();
        state.audio.master.gain.setTargetAtTime(.035, state.audio.context.currentTime, .08);
        state.audio.enabled = true;
      }
      button.classList.toggle("active", state.audio.enabled);
      button.setAttribute("aria-pressed", String(state.audio.enabled));
      button.title = state.audio.enabled ? "Couper l'ambiance sonore" : "Activer l'ambiance sonore";
    });
  }

  function observeReveals() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty("--delay", `${entry.target.dataset.delay || 0}ms`);
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    $$(".reveal:not(.visible)").forEach(item => observer.observe(item));
  }

  function setupPageEffects() {
    window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 30));
    window.addEventListener("pointermove", event => {
      const glow = $(".cursor-glow");
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
    $("#year").textContent = new Date().getFullYear();
  }

  function setMinimumDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $("#eventDate").min = today.toISOString().split("T")[0];
  }

  function init() {
    renderPackages();
    renderEventTypes();
    renderAddons();
    renderRentalFilters();
    renderRentals();
    renderGallery();
    renderReviews();
    renderVideoAndContact();
    setupCarousel();
    setupAmbientSound();
    setupPageEffects();
    setMinimumDate();
    observeReveals();

    ["guestCount", "duration"].forEach(id => $("#" + id).addEventListener("input", updateEstimate));
    $("#quoteForm").addEventListener("submit", submitQuote);
    updateEstimate();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
