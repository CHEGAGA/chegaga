document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initHeroSlider();
  initStatsCounters();
  initActivitiesModals();
  initGalleryLightbox();
  initBlogSection();
  initTestimonialsSlider();
  initFaqAccordion();
  initBookingForm();
  initWhatsAppWidget();
  initBackToTop();
});

/* ==========================================
   1. NAVBAR SCROLL EFFECT
   ========================================== */
function initNavbar() {
  const header = document.getElementById("main-header");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const logoText = document.getElementById("nav-logo-text");

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.remove("nav-transparent", "text-white");
      header.classList.add("nav-glass", "text-desert-stone");

      navLinks.forEach(link => {
        link.classList.remove("text-white", "hover:text-desert-gold");
        link.classList.add("text-desert-stone", "hover:text-desert-terracotta");
      });
      if (logoText) {
        logoText.classList.remove("text-white");
        logoText.classList.add("text-desert-stone");
      }
    } else {
      header.classList.remove("nav-glass", "text-desert-stone");
      header.classList.add("nav-transparent", "text-white");

      navLinks.forEach(link => {
        link.classList.remove("text-desert-stone", "hover:text-desert-terracotta");
        link.classList.add("text-white", "hover:text-desert-gold");
      });
      if (logoText) {
        logoText.classList.remove("text-desert-stone");
        logoText.classList.add("text-white");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================
   2. MOBILE NAV DRAWER
   ========================================== */
function initMobileMenu() {
  const openBtn = document.getElementById("mobile-menu-open-btn");
  const closeBtn = document.getElementById("mobile-menu-close-btn");
  const drawer = document.getElementById("mobile-menu-drawer");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.remove("translate-x-full", "pointer-events-none");
    drawer.classList.add("pointer-events-auto");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.add("translate-x-full", "pointer-events-none");
    drawer.classList.remove("pointer-events-auto");
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

/* ==========================================
   3. HERO SLIDER (SWIPER)
   ========================================== */
function initHeroSlider() {
  if (typeof Swiper !== "undefined" && document.querySelector(".swiper-hero")) {
    new Swiper(".swiper-hero", {
      loop: true,
      effect: "fade",
      speed: 1200,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".hero-swiper-pagination",
        clickable: true,
      },
    });
  }
}

/* ==========================================
   4. STATS COUNTER ANIMATION
   ========================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll(".counter-number");
  if (!counters.length) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const duration = 1800;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.floor(progress * target);
      element.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================
   5. ACTIVITIES QUICK VIEW MODALS & DATA
   ========================================== */
const activitiesData = {
  camel: {
    title: "Balade à dos de dromadaire (Coucher & Lever de soleil)",
    image: "images/trek-caravan-dunes.jpg",
    badge: "Le Plus Authentique",
    duration: "1h30 - 2 Heures",
    price: "25 € / 270 MAD",
    highlights: ["Chèche nomade traditionnel offert", "Ascension de la grande crête pour le coucher du soleil", "Cérémonie du thé au sommet des dunes", "Guide chamelier saharien professionnel"],
    desc: "Embarquez pour un voyage saharien emblématique au rythme apaisant des dromadaires à travers les vagues dorées d'Erg Chegaga. Ressentez ce que vivaient les caravanes nomades depuis des millénaires lorsque le soleil couchant transforme le sable doré en un océan pourpre flamboyant."
  },
  safari4x4: {
    title: "Safari 4x4 Hors-Piste & Dunes Géantes",
    image: "images/tour-lake-iriqui.jpg",
    badge: "Adrénaline & Grands Espaces",
    duration: "Demi-journée ou Journée complète",
    price: "85 € / 900 MAD",
    highlights: ["Traversée des mythiques pistes du Paris-Dakar", "Traversée sauvage de l'ancien lac asséché d'Iriki", "Visite des gisements de fossiles millénaires", "Chauffeurs-guides experts du désert"],
    desc: "Domptez l'immensité sauvage entre M'hamid, le lac Iriki et les dunes d'Erg Chegaga à bord de nos véhicules 4x4 tout-terrain. Traversez les plateaux d'acacias, les fonds marins préhistoriques fossilisés et des crêtes de dunes spectaculaires à couper le souffle."
  },
  quad: {
    title: "Expédition Quad & Buggy dans les Dunes",
    image: "images/activity-quad-rider.jpg",
    badge: "Aventure & Sensations",
    duration: "1 à 3 Heures",
    price: "50 € / 550 MAD",
    highlights: ["Quads Yamaha & Polaris haut de gamme", "Équipement de sécurité complet fourni", "Parcours guidé à travers les crêtes sablonneuses", "Arrêts photos & vidéos panoramiques"],
    desc: "Faites monter l'adrénaline aux commandes de votre quad à travers les étendues infinies du Sahara. Des pistes rapides aux grandes pentes de sable fin, cette aventure dynamique est adaptée aussi bien aux débutants qu'aux pilotes chevronnés."
  },
  sandboarding: {
    title: "Sandboarding sur Dunes Géantes (300m)",
    image: "images/sandboarding-dunes.jpg",
    badge: "Plaisir & Glisse Pure",
    duration: "Illimité durant le séjour",
    price: "Inclus avec le Bivouac / 10 €",
    highlights: ["Planches spécialement fartées pour le sable", "Adapté à tous les âges et niveaux", "Panoramas exceptionnels au sommet", "Photos et vidéos d'action mémorables"],
    desc: "Prenez votre planche de sandboard et glissez sur les plus hautes dunes naturelles du Maroc. Debout comme sur un snowboard ou assis, Erg Chegaga offre des descentes jusqu'à 300 mètres de hauteur pour des sensations inoubliables."
  },
  stargazing: {
    title: "Astronomie & Voie Lactée sous les Étoiles",
    image: "images/stargazing-night.jpg",
    badge: "Nuit Magique",
    duration: "Toutes les nuits claires",
    price: "Inclus avec le Bivouac",
    highlights: ["Zéro pollution lumineuse (Ciel Bortle 1)", "Voie Lactée visible à l'œil nu", "Guidage et lecture des constellations au laser", "Contes au coin du feu sous les étoiles"],
    desc: "Erg Chegaga est l'un des rares sanctuaires au monde sans aucune pollution lumineuse (Bortle 1). Allongé sur des tapis berbères, admirez des millions d'étoiles scintillantes, des pluies d'étoiles filantes et le spectacle grandiose de la Voie Lactée."
  },
  nomadmusic: {
    title: "Soirée Feu de Camp & Musique Nomade Live",
    image: "images/trek-campfire-night.jpg",
    badge: "Âme Culturelle Saharienne",
    duration: "Chaque Soirée",
    price: "Inclus avec le Bivouac",
    highlights: ["Rythmes traditionnels Gnawa et sahariens", "Cercle de percussions berbères interactif", "Contes et poésies orales nomades", "Thé à la menthe frais et fruits secs"],
    desc: "Rassemblez-vous autour des braises du feu de camp après un dîner sous les tentes caïdales. Les musiciens nomades partagent leurs mélodies ancestrales et vous invitent à danser, jouer des tambours et célébrer la vie sous le dôme étoilé du désert."
  }
};

function initActivitiesModals() {
  const quickViewBtns = document.querySelectorAll(".activity-quick-view-btn");
  const modal = document.getElementById("activity-details-modal");
  const closeBtn = document.getElementById("close-activity-modal-btn");
  const closeCrossBtn = document.getElementById("close-activity-modal-cross");

  if (!modal) return;

  const modalImg = document.getElementById("modal-act-image");
  const modalTitle = document.getElementById("modal-act-title");
  const modalBadge = document.getElementById("modal-act-badge");
  const modalDuration = document.getElementById("modal-act-duration");
  const modalPrice = document.getElementById("modal-act-price");
  const modalDesc = document.getElementById("modal-act-desc");
  const modalHighlights = document.getElementById("modal-act-highlights");
  const modalWaBtn = document.getElementById("modal-act-whatsapp-btn");

  quickViewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const actId = btn.getAttribute("data-act-id");
      const data = activitiesData[actId];

      if (data) {
        if (modalImg) modalImg.src = data.image;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalBadge) modalBadge.textContent = data.badge;
        if (modalDuration) modalDuration.textContent = data.duration;
        if (modalPrice) modalPrice.textContent = data.price;
        if (modalDesc) modalDesc.textContent = data.desc;

        if (modalHighlights) {
          modalHighlights.innerHTML = data.highlights
            .map(h => `<li class="flex items-center gap-2"><i class="fas fa-check-circle text-desert-terracotta text-sm"></i> <span>${h}</span></li>`)
            .join("");
        }

        if (modalWaBtn) {
          const waMsg = encodeURIComponent(`Bonjour ! Je souhaite réserver ou obtenir des informations sur l'activité : ${data.title} (${data.price}) à Erg Chegaga.`);
          modalWaBtn.href = `https://wa.me/212615396800?text=${waMsg}`;
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeCrossBtn) closeCrossBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================
   6. GALLERY CATEGORY FILTER & LIGHTBOX
   ========================================== */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("gallery-lightbox");

  if (!lightbox) return;

  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxIndex = document.getElementById("lightbox-index");
  const closeBtn = document.getElementById("close-lightbox-btn");
  const prevBtn = document.getElementById("prev-lightbox-btn");
  const nextBtn = document.getElementById("next-lightbox-btn");

  let visibleList = Array.from(galleryItems);
  let currentIndex = 0;

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-desert-terracotta", "text-white");
        b.classList.add("bg-white", "text-desert-stone", "hover:bg-desert-sand/50");
      });
      btn.classList.add("bg-desert-terracotta", "text-white");
      btn.classList.remove("bg-white", "text-desert-stone", "hover:bg-desert-sand/50");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach(item => {
        const cat = item.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      visibleList = Array.from(galleryItems).filter(item => item.style.display !== "none");
    });
  });

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      visibleList = Array.from(galleryItems).filter(i => i.style.display !== "none");
      currentIndex = visibleList.indexOf(item);
      updateLightbox();
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
  });

  function updateLightbox() {
    if (currentIndex < 0 || currentIndex >= visibleList.length) return;
    const item = visibleList[currentIndex];
    const img = item.querySelector("img");
    const caption = item.getAttribute("data-caption") || img.getAttribute("alt") || "Erg Chegaga Sahara";

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightboxIndex.textContent = `${currentIndex + 1} / ${visibleList.length}`;
  }

  function nextImage() {
    if (visibleList.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleList.length;
    updateLightbox();
  }

  function prevImage() {
    if (visibleList.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleList.length) % visibleList.length;
    updateLightbox();
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
  });
}

/* ==========================================
   7. BLOG ARTICLES & SEARCH
   ========================================== */
const blogArticles = [
  {
    id: "chegaga-vs-chebbi",
    title: "Erg Chegaga vs Erg Chebbi : Pourquoi Chegaga est le Véritable Désert Marocain",
    tag: "Guide du Désert",
    date: "Sep 2026",
    image: "images/hero-dunes.jpg",
    snippet: "Découvrez pourquoi les voyageurs en quête d'authenticité évitent Merzouga pour s'aventurer 60 km au cœur des immenses dunes sauvages d'Erg Chegaga.",
    content: `
      <p class="mb-4">Lors de la planification d'un voyage dans le Sahara marocain, deux destinations majeures s'offrent aux voyageurs : <strong>l'Erg Chebbi</strong> (près de Merzouga) et <strong>l'Erg Chegaga</strong> (au-delà de M'hamid El Ghizlane).</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">1. Authenticité et Immensité Sauvage</h4>
      <p class="mb-4">L'Erg Chebbi est aujourd'hui accessible par route goudronnée jusqu'au pied des dunes, avec des hôtels et complexes touristiques alignés en lisière. L'Erg Chegaga, en revanche, nécessite une véritable expédition 4x4 hors-piste de 2 à 3 heures à travers le désert de pierres (reg) et les lits de rivières asséchées avant d'atteindre l'océan de sable. C'est un désert resté totalement pur, silencieux et préservé du tourisme de masse.</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">2. Hauteur des Dunes et Échelle Majestueuse</h4>
      <p class="mb-4">Erg Chegaga est le plus vaste erg du Maroc, s'étendant sur plus de 40 kilomètres avec des crêtes s'élevant jusqu'à 300 mètres de hauteur. L'immensité y est totale : vous pouvez vous tenir sur une crête et contempler un horizon à 360 degrés sans le moindre bâtiment, poteau électrique ou bruit artificiel.</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">3. Le Verdict</h4>
      <p>Si vous recherchez un accès facile par la route, Merzouga est commode. Mais si vous rêvez d'un silence nomade absolu, d'horizons infinis et d'une aventure inoubliable, Erg Chegaga est sans commune mesure.</p>
    `
  },
  {
    id: "packing-guide",
    title: "La Valise Idéale pour Erg Chegaga : Que Faut-il Emporter ?",
    tag: "Conseils Voyage",
    date: "Août 2026",
    image: "images/slider-milkyway-night.jpg",
    snippet: "Du chèche traditionnel aux vêtements chauds pour les fraîches nuits sahariennes, voici la liste complète pour votre séjour dans le désert.",
    content: `
      <p class="mb-4">Le Sahara connaît d'importantes amplitudes thermiques. Les journées sont chaudes et ensoleillées, tandis que les températures chutent rapidement dès le coucher du soleil sur les dunes.</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">Vêtements Indispensables</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Chèche nomade traditionnel :</strong> Indispensable pour protéger le visage et les cheveux du vent de sable et du soleil. Nos chameliers vous apprendront à le nouer comme un vrai nomade !</li>
        <li><strong>Tenues légères et superposables :</strong> Coton ou lin respirant pour la journée, plus une polaire chaude ou une veste coupe-vent pour la nuit.</li>
        <li><strong>Chaussures fermées & sandales :</strong> Baskets confortables pour les trajets en 4x4 et balades ; sandales faciles à retirer pour marcher pieds nus sur le sable doux.</li>
        <li><strong>Lunettes de soleil & crème solaire :</strong> La réverbération du sable est forte, un indice de protection élevé est primordial.</li>
      </ul>
      <h4 class="text-xl font-bold text-desert-stone mb-2">Matériel & Électronique</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Batterie externe (Powerbank) :</strong> Bien que nos tentes disposent d'énergie solaire, une batterie portable vous assure de ne jamais manquer de batterie lors de vos randonnées dans les dunes.</li>
        <li><strong>Protection hermétique pour appareil photo :</strong> Gardez vos téléphones et objectifs à l'abri des grains fins de sable.</li>
      </ul>
    `
  },
  {
    id: "lake-iriki-story",
    title: "Le Lac Iriki : Le Mystérieux Lac Salé Asséché du Sahara",
    tag: "Histoire & Nature",
    date: "Juil 2026",
    image: "images/tour-lake-iriqui.jpg",
    snippet: "Autrefois peuplé de gazelles et d'oiseaux migrateurs, découvrez ce joyau géologique et piste mythique du Paris-Dakar.",
    content: `
      <p class="mb-4">Entre la vallée du Draa et les contreforts de l'Anti-Atlas s'étend le <strong>Lac Iriki</strong>, désormais cœur du Parc National d'Iriqui. Couvrant plus de 120 000 hectares, cette vaste cuvette était autrefois un lac permanent alimenté par les crues de l'Oued Draa.</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">Des Pistes du Paris-Dakar aux Mirages</h4>
      <p class="mb-4">Aujourd'hui asséché, le lac Iriki est une immense étendue d'argile craquelée et de sel créant de fascinants mirages thermiques où l'horizon scintille comme une mer d'eau bleue. C'était l'un des passages les plus mythiques du Rallye Paris-Dakar où les bolides fonçaient à pleine vitesse.</p>
      <h4 class="text-xl font-bold text-desert-stone mb-2">Champs de Fossiles Marins</h4>
      <p>Aux abords nord du lac asséché, on trouve d'innombrables fossiles marins vieux de plusieurs centaines de millions d'années incrustés dans la roche — preuve que le désert du Sahara était jadis un vaste océan préhistorique !</p>
    `
  }
];

function initBlogSection() {
  const searchInput = document.getElementById("blog-search");
  const blogGrid = document.getElementById("blog-posts-grid");
  const modal = document.getElementById("blog-article-modal");
  const closeBtn = document.getElementById("close-blog-modal-btn");
  const modalTitle = document.getElementById("blog-modal-title");
  const modalTag = document.getElementById("blog-modal-tag");
  const modalDate = document.getElementById("blog-modal-date");
  const modalImg = document.getElementById("blog-modal-img");
  const modalBody = document.getElementById("blog-modal-body");

  // Render blog cards
  function renderBlog(items) {
    if (!blogGrid) return;
    blogGrid.innerHTML = items.map(art => `
      <article class="bg-white rounded-2xl overflow-hidden shadow-md hover-card flex flex-col border border-desert-sand/40">
        <div class="relative h-56 overflow-hidden">
          <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
          <span class="absolute top-4 left-4 bg-desert-stone/80 backdrop-blur-md text-desert-gold text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">${art.tag}</span>
        </div>
        <div class="p-6 flex flex-col flex-1 justify-between">
          <div>
            <span class="text-xs text-desert-stone/50 font-medium mb-2 block"><i class="far fa-calendar-alt mr-1"></i> ${art.date}</span>
            <h3 class="text-xl font-bold text-desert-stone mb-3 leading-snug hover:text-desert-terracotta transition-colors cursor-pointer read-article-btn" data-art-id="${art.id}">${art.title}</h3>
            <p class="text-sm text-desert-stone/75 leading-relaxed mb-6">${art.snippet}</p>
          </div>
          <div>
            <button class="read-article-btn text-desert-terracotta hover:text-desert-ochre font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors" data-art-id="${art.id}">
              Lire l'Article Complet <i class="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </article>
    `).join("");

    attachReadEvents();
  }

  function attachReadEvents() {
    document.querySelectorAll(".read-article-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-art-id");
        const art = blogArticles.find(a => a.id === id);
        if (art && modal) {
          modalTitle.textContent = art.title;
          modalTag.textContent = art.tag;
          modalDate.textContent = art.date;
          modalImg.src = art.image;
          modalBody.innerHTML = art.content;

          modal.classList.remove("hidden");
          modal.classList.add("flex");
          document.body.style.overflow = "hidden";
        }
      });
    });
  }

  renderBlog(blogArticles);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = blogArticles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q)
      );
      renderBlog(filtered);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
      }
    });
  }
}

/* ==========================================
   8. TESTIMONIALS SLIDER
   ========================================== */
function initTestimonialsSlider() {
  if (typeof Swiper !== "undefined" && document.querySelector(".swiper-testimonials")) {
    new Swiper(".swiper-testimonials", {
      loop: true,
      spaceBetween: 30,
      slidesPerView: 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".testimonials-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }
}

/* ==========================================
   9. FAQ ACCORDION
   ========================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");
    const icon = item.querySelector(".faq-icon");

    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = !content.classList.contains("hidden");

      // Close all
      document.querySelectorAll(".faq-content").forEach(c => c.classList.add("hidden"));
      document.querySelectorAll(".faq-icon").forEach(i => i.classList.remove("rotate-180"));

      if (!isOpen) {
        content.classList.remove("hidden");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });
}

/* ==========================================
   10. BOOKING / CONTACT FORM (WHATSAPP TRIGGER)
   ========================================== */
function initBookingForm() {
  const form = document.getElementById("desert-booking-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("booking-name")?.value.trim() || "";
    const email = document.getElementById("booking-email")?.value.trim() || "";
    const phone = document.getElementById("booking-phone")?.value.trim() || "";
    const tour = document.getElementById("booking-tour")?.value || "Circuit Sur Mesure";
    const date = document.getElementById("booking-date")?.value || "Flexible";
    const guests = document.getElementById("booking-guests")?.value || "2";
    const notes = document.getElementById("booking-notes")?.value.trim() || "";

    const msg = `*Nouvelle Demande de Réservation - Erg Chegaga Desert Tours*\n\n` +
      `👤 *Nom complet :* ${name}\n` +
      `📧 *E-mail :* ${email}\n` +
      `📱 *Téléphone / WhatsApp :* ${phone}\n` +
      `🏜️ *Circuit choisi :* ${tour}\n` +
      `📅 *Date souhaitée :* ${date}\n` +
      `👥 *Nombre de personnes :* ${guests}\n` +
      (notes ? `📝 *Demandes particulières :* ${notes}\n\n` : `\n`) +
      `Merci de m'indiquer les disponibilités et le tarif. À bientôt !`;

    const waUrl = `https://wa.me/212615396800?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    const feedback = document.getElementById("booking-feedback");
    if (feedback) {
      feedback.classList.remove("hidden");
      setTimeout(() => {
        feedback.classList.add("hidden");
        form.reset();
      }, 6000);
    }
  });
}

/* ==========================================
   11. WHATSAPP FLOATING WIDGET
   ========================================== */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById("wa-widget-toggle");
  const box = document.getElementById("wa-widget-box");
  const closeBtn = document.getElementById("wa-widget-close");

  if (!toggleBtn || !box) return;

  toggleBtn.addEventListener("click", () => {
    box.classList.toggle("hidden");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      box.classList.add("hidden");
    });
  }
}

/* ==========================================
   12. BACK TO TOP BUTTON
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("opacity-0", "pointer-events-none");
      btn.classList.add("opacity-100", "pointer-events-auto");
    } else {
      btn.classList.add("opacity-0", "pointer-events-none");
      btn.classList.remove("opacity-100", "pointer-events-auto");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
