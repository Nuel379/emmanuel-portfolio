const UPWORK_PROFILE_URL = 'https://www.upwork.com/freelancers/~01af5e7c9d8d7af590';
const CONTACT_FALLBACK = 'mailto:emmysam379@gmail.com';
const CONTACT_URL = UPWORK_PROFILE_URL.trim() || CONTACT_FALLBACK;

function hydrateContactLinks() {
  document.querySelectorAll('[data-contact-link]').forEach((link) => {
    link.href = CONTACT_URL;

    if (UPWORK_PROFILE_URL.trim()) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

/* =========================
   THEME TOGGLE
========================= */

const themeToggles = document.querySelectorAll('[data-theme-toggle]');
const THEME_STORAGE_KEY = 'emmanuel-portfolio-theme';

function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  const isLight = nextTheme === 'light';

  document.body.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

  themeToggles.forEach(toggle => {
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );

    const icon = toggle.querySelector('.theme-toggle-icon');
    const text = toggle.querySelector(
      '.theme-toggle-text, .mobile-theme-text'
    );

    if (icon) {
      icon.textContent = isLight ? '☾' : '☀';
    }

    if (text) {
      text.textContent = isLight ? 'Dark' : 'Light';
    }
  });
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(storedTheme || 'dark');

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme =
        document.body.dataset.theme === 'light' ? 'light' : 'dark';

      applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  });
}

/* =====================================================
   MOBILE HEADER MENU
===================================================== */

const siteHeader = document.querySelector('.site-header');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuSheet = document.getElementById('mobileMenuSheet');

function setMobileMenu(open) {
  if (!siteHeader || !mobileMenuToggle || !mobileMenuSheet) return;

  siteHeader.classList.toggle('menu-open', open);
  mobileMenuToggle.setAttribute('aria-expanded', String(open));
  mobileMenuToggle.setAttribute(
    'aria-label',
    open ? 'Close navigation menu' : 'Open navigation menu'
  );

  mobileMenuSheet.setAttribute('aria-hidden', String(!open));
}

mobileMenuToggle?.addEventListener('click', event => {
  event.stopPropagation();

  const shouldOpen = !siteHeader?.classList.contains('menu-open');
  setMobileMenu(shouldOpen);
});

/* Close when a navigation item or theme control is tapped */
mobileMenuSheet?.addEventListener('click', event => {
  const clickedControl = event.target.closest('a, button');

  if (clickedControl) {
    setMobileMenu(false);
  }
});

/* Close when the visitor taps outside the header */
document.addEventListener('pointerdown', event => {
  if (!siteHeader?.classList.contains('menu-open')) return;
  if (siteHeader.contains(event.target)) return;

  setMobileMenu(false);
});

/* Close immediately when page scrolling begins */
window.addEventListener(
  'scroll',
  () => {
    if (siteHeader?.classList.contains('menu-open')) {
      setMobileMenu(false);
    }
  },
  { passive: true }
);

/* Reset menu when moving back to desktop */
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    setMobileMenu(false);
  }
});

/* Escape key support */
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMobileMenu(false);
  }
});

/* =========================
   PORTFOLIO DATA
   IMPORTANT:
   Images are in root folder on GitHub,
   so paths must be ./image-name.webp
========================= */

const projects = [
  {
    id: 'yumquick',
    name: 'YumQuick',
    category: 'Food Delivery App',
    filter: 'food',
    image: './yumquick.webp',
    summary:
      'A warm food ordering experience that moves users from discovery to checkout with clarity and appetite appeal.',
    story:
      'YumQuick presents food discovery, best sellers, cart actions, checkout, and order tracking as one warm mobile journey. The design uses tasty colors, bold food visuals, and readable screens that feel quick, friendly, and restaurant-ready.',
    tags: ['Food Delivery', 'Ordering Flow', '3D Mockups', 'Mobile UI'],
  },
  {
    id: 'liny',
    name: 'Liny',
    category: 'Issue Tracking Platform',
    filter: 'productivity',
    image: './liny.webp',
    summary:
      'A dark premium mobile workflow app for tracking issues, drafts, inbox updates, and active work.',
    story:
      'Liny is positioned as a focused mobile issue tracking workspace. The case study shows how developer teams can view active work, manage status updates, create drafts, and keep momentum without waiting to return to desktop.',
    tags: ['Productivity', 'SaaS', 'Dark Mode', 'Workflow UI'],
  },
  {
    id: 'vitalora',
    name: 'Vitalora',
    category: 'Healthcare Booking App',
    filter: 'healthcare',
    image: './vitalora.webp',
    summary:
      'A polished healthcare booking journey for doctor discovery, scheduling, payment success, and follow-up.',
    story:
      'Vitalora organizes doctor discovery, appointment scheduling, patient details, reminders, and secure communication into one calm healthcare product experience. The presentation shows a guided care journey from booking to follow-up.',
    tags: ['Healthcare', 'Appointment Booking', 'Patient Flow', 'HealthTech'],
  },
  {
    id: 'homequ',
    name: 'HomeQu',
    category: 'Real Estate Discovery App',
    filter: 'real-estate',
    image: './homequ.webp',
    summary:
      'A clean real estate discovery and booking experience for finding, exploring, and visiting homes.',
    story:
      'HomeQu helps users discover properties, inspect interior details, understand locations, communicate with agents, and move toward booking with confidence. The design is clean, green, trustworthy, and real estate-ready.',
    tags: ['Real Estate', 'Property Discovery', 'Booking Flow', 'Clean UI'],
  },
  {
    id: 'zentrapay',
    name: 'Zentra Pay',
    category: 'Fintech Wallet App',
    filter: 'fintech',
    image: './zentrapay.webp',
    summary:
      'A premium dark fintech wallet experience for payments, cards, balances, and transaction clarity.',
    story:
      'Zentra Pay brings wallet control, card visibility, transfer actions, payment clarity, and financial insights into one focused mobile experience built around calm trust and security.',
    tags: ['Fintech', 'Wallet App', 'Secure Payments', 'Finance UI'],
  },
];

/* =========================
   ELEMENTS
========================= */

const grid = document.getElementById('portfolioGrid');
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTags = document.getElementById('modalTags');
const featuredImage = document.getElementById('featuredImage');
const featuredName = document.getElementById('featuredName');
const featuredType = document.getElementById('featuredType');
const toast = document.getElementById('toast');
const progressBar = document.querySelector('.scroll-progress');
const mobileProjectCount =
  document.getElementById('mobileProjectCount');

const mobileProjectProgressBar =
  document.getElementById('mobileProjectProgressBar');

let mobileRailFrame = null;

function updateMobileProjectRail() {
  if (!grid || !mobileProjectCount || !mobileProjectProgressBar) return;

  const cards = [...grid.querySelectorAll('.project-card')];

  if (!cards.length) {
    mobileProjectCount.textContent = '00 / 00';
    mobileProjectProgressBar.style.width = '0%';
    return;
  }

  const railCenter = grid.scrollLeft + grid.clientWidth / 2;

  let activeIndex = 0;
  let smallestDistance = Infinity;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - railCenter);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      activeIndex = index;
    }
  });

  const current = String(activeIndex + 1).padStart(2, '0');
  const total = String(cards.length).padStart(2, '0');
  const percentage = ((activeIndex + 1) / cards.length) * 100;

  mobileProjectCount.textContent = `${current} / ${total}`;
  mobileProjectProgressBar.style.width = `${percentage}%`;
}

function requestMobileRailUpdate() {
  if (mobileRailFrame) return;

  mobileRailFrame = requestAnimationFrame(() => {
    updateMobileProjectRail();
    mobileRailFrame = null;
  });
}

function initMobileProjectRail() {
  if (!grid) return;

  if (!grid.dataset.mobileRailReady) {
    grid.dataset.mobileRailReady = 'true';

    grid.addEventListener(
      'scroll',
      requestMobileRailUpdate,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      requestMobileRailUpdate,
      { passive: true }
    );
  }

  requestAnimationFrame(updateMobileProjectRail);
}

/* =========================
   RENDER PROJECTS
========================= */

function renderProjects(filter = 'all') {
  if (!grid) return;

  const visibleProjects =
    filter === 'all'
      ? projects
      : projects.filter((project) => project.filter === filter);

  grid.innerHTML = visibleProjects
    .map(
      (project, index) => `
        <article 
          class="project-card reveal tilt-card" 
          data-id="${project.id}" 
          style="transition-delay:${Math.min(index * 0.05, 0.28)}s"
        >
          <div class="project-image">
            <img 
              src="${project.image}" 
              alt="${project.name} ${project.category} case study" 
              loading="lazy" 
            />
          </div>

          <div class="project-info">
            <div class="project-topline">
              <span>${project.category}</span>
              <span>View case</span>
            </div>

            <h3>${project.name}</h3>
            <p>${project.summary}</p>

            <div class="project-tags">
              ${project.tags
                .slice(0, 3)
                .map((tag) => `<span>${tag}</span>`)
                .join('')}
            </div>
          </div>
        </article>
      `
    )
    .join('');

  attachProjectEvents();
  attachTilt();

  requestAnimationFrame(() => {
    observeReveals();
  });
}

function attachProjectEvents() {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openProject(card.dataset.id));
  });
}

/* =========================
   MODAL
========================= */

function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project || !modal) return;

  if (modalImage) {
    modalImage.src = project.image;
    modalImage.alt = `${project.name} ${project.category} case study`;
  }

  if (modalCategory) modalCategory.textContent = project.category;
  if (modalTitle) modalTitle.textContent = project.name;
  if (modalDescription) modalDescription.textContent = project.story;

  if (modalTags) {
    modalTags.innerHTML = project.tags
      .map((tag) => `<span>${tag}</span>`)
      .join('');
  }

  hydrateContactLinks();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

/* =========================
   FILTERS
========================= */

document.querySelectorAll('.filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document
      .querySelectorAll('.filter-chip')
      .forEach((item) => item.classList.remove('active'));

    chip.classList.add('active');
    renderProjects(chip.dataset.filter);
  });
});

/* =========================
   REVEAL ANIMATIONS
========================= */

let revealObserver;

function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    revealObserver.observe(el);
  });
}

/* =========================
   TILT EFFECT
========================= */

function attachTilt() {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    if (card.dataset.tiltReady) return;

    card.dataset.tiltReady = 'true';

    card.addEventListener('mousemove', (event) => {
      if (window.matchMedia('(max-width: 680px)').matches) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -7;
      const rotateY = (x / rect.width - 0.5) * 7;

      card.style.transform = `
        perspective(1100px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateY(-2px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =========================
   CURSOR GLOW
========================= */

const glow = document.querySelector('.cursor-glow');

document.addEventListener('pointermove', (event) => {
  if (!glow) return;

  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

/* =========================
   SCROLL PROGRESS
========================= */

window.addEventListener(
  'scroll',
  () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll <= 0 ? 0 : (window.scrollY / maxScroll) * 100;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  },
  { passive: true }
);

/* =========================
   HERO FEATURED IMAGE ROTATION
========================= */

let featuredIndex = 0;

function rotateFeaturedProject() {
  if (!featuredImage || !featuredName || !featuredType) return;

  featuredIndex = (featuredIndex + 1) % projects.length;
  const project = projects[featuredIndex];

  featuredImage.style.opacity = 0;

  setTimeout(() => {
    featuredImage.src = project.image;
    featuredImage.alt = `${project.name} ${project.category} case study presentation`;

    featuredName.textContent = project.name;
    featuredType.textContent = project.category;

    featuredImage.style.opacity = 1;
  }, 280);
}

setInterval(rotateFeaturedProject, 3800);

/* =========================
   COPY EMAIL
========================= */

const copyButton = document.getElementById('copyEmail');

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('emmysam379@gmail.com');
    showToast('Email copied');
  } catch (error) {
    showToast('Email: emmysam379@gmail.com');
  }
});

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2100);
}

/* =========================
   MAGNETIC BUTTONS
========================= */

document.querySelectorAll('.magnetic').forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(max-width: 680px)').matches) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

/* =========================
   INIT
========================= */

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

initTheme();
hydrateContactLinks();
attachProjectEvents();
renderProjects();
requestAnimationFrame(() => observeReveals());
initMobileProjectRail();
