const UPWORK_PROFILE_URL = 'https://www.upwork.com/freelancers/~01af5e7c9d8d7af590';
const CONTACT_FALLBACK = 'mailto:emmysam379@gmail.com';
const CONTACT_URL = UPWORK_PROFILE_URL.trim() || CONTACT_FALLBACK;

function hydrateContactLinks() {
  document.querySelectorAll('[data-contact-link]').forEach(link => {
    link.href = CONTACT_URL;
    if (UPWORK_PROFILE_URL.trim()) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

const themeToggle = document.getElementById('themeToggle');
const THEME_STORAGE_KEY = 'emmanuel-portfolio-theme';

function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  if (themeToggle) {
    const isLight = nextTheme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    const icon = themeToggle.querySelector('.theme-toggle-icon');
    const text = themeToggle.querySelector('.theme-toggle-text');
    if (icon) icon.textContent = isLight ? '☾' : '☀';
    if (text) text.textContent = isLight ? 'Dark' : 'Light';
  }
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(storedTheme || 'dark');
  themeToggle?.addEventListener('click', () => {
    const current = document.body.dataset.theme === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

const projects = [
  {
    id: 'yumquick',
    name: 'YumQuick',
    category: 'Food Delivery App',
    filter: 'food',
    image: 'assets/projects/yumquick.webp',
    summary: 'A warm food ordering experience that moves users from discovery to checkout with clarity and appetite appeal.',
    story: 'YumQuick presents food discovery, best sellers, cart actions, checkout, and order tracking as one warm mobile journey. The design uses tasty colors, bold food visuals, and readable screens that feel quick, friendly, and restaurant-ready.',
    tags: ['Food Delivery', 'Ordering Flow', '3D Mockups', 'Mobile UI']
  },
  {
    id: 'liny',
    name: 'Liny',
    category: 'Issue Tracking Platform',
    filter: 'productivity',
    image: 'assets/projects/liny.webp',
    summary: 'A dark premium mobile workflow app for tracking issues, drafts, inbox updates, and active work.',
    story: 'Liny is positioned as a focused mobile issue tracking workspace. The case study shows how developer teams can view active work, manage status updates, create drafts, and keep momentum without waiting to return to desktop.',
    tags: ['Productivity', 'SaaS', 'Dark Mode', 'Workflow UI']
  },
  {
    id: 'vitalora',
    name: 'Vitalora',
    category: 'Healthcare Booking App',
    filter: 'healthcare',
    image: 'assets/projects/vitalora.webp',
    summary: 'A polished healthcare booking journey for doctor discovery, scheduling, payment success, and follow-up.',
    story: 'Vitalora organizes doctor discovery, appointment scheduling, patient details, reminders, and secure communication into one calm healthcare product experience. The presentation shows a guided care journey from booking to follow-up.',
    tags: ['Healthcare', 'Appointment Booking', 'Patient Flow', 'HealthTech']
  },
  {
    id: 'homequ',
    name: 'HomeQu',
    category: 'Real Estate Discovery App',
    filter: 'real-estate',
    image: 'assets/projects/homequ.webp',
    summary: 'A clean real estate discovery and booking experience for finding, exploring, and visiting homes.',
    story: 'HomeQu helps users discover properties, inspect interior details, understand locations, communicate with agents, and move toward booking with confidence. The design is clean, green, trustworthy, and real estate-ready.',
    tags: ['Real Estate', 'Property Discovery', 'Booking Flow', 'Clean UI']
  },
  {
    id: 'zentrapay',
    name: 'Zentra Pay',
    category: 'Fintech Wallet App',
    filter: 'fintech',
    image: 'assets/projects/zentrapay.webp',
    summary: 'A premium dark fintech wallet experience for payments, cards, balances, and transaction clarity.',
    story: 'Zentra Pay brings wallet control, card visibility, transfer actions, payment clarity, and financial insights into one focused mobile experience built around calm trust and security.',
    tags: ['Fintech', 'Wallet App', 'Secure Payments', 'Finance UI']
  }
];

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

function renderProjects(filter = 'all') {
  const visibleProjects = filter === 'all' ? projects : projects.filter(project => project.filter === filter);
  grid.innerHTML = visibleProjects.map((project, index) => `
    <article class="project-card reveal tilt-card" data-id="${project.id}" style="transition-delay:${Math.min(index * 0.05, 0.28)}s">
      <div class="project-image">
        <img src="${project.image}" alt="${project.name} ${project.category} case study" loading="lazy" />
      </div>
      <div class="project-info">
        <div class="project-topline"><span>${project.category}</span><span>View case</span></div>
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        <div class="project-tags">${project.tags.slice(0, 3).map(tag => `<span>${tag}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');

  attachProjectEvents();
  attachTilt();
  requestAnimationFrame(() => observeReveals());
}

function attachProjectEvents() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.id));
  });
}

function openProject(id) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  modalImage.src = project.image;
  modalImage.alt = `${project.name} ${project.category} case study`;
  modalCategory.textContent = project.category;
  modalTitle.textContent = project.name;
  modalDescription.textContent = project.story;
  modalTags.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
  hydrateContactLinks();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(item => item.classList.remove('active'));
    chip.classList.add('active');
    renderProjects(chip.dataset.filter);
  });
});

let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

function attachTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
    card.addEventListener('mousemove', event => {
      if (window.matchMedia('(max-width: 680px)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -7;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

const glow = document.querySelector('.cursor-glow');
document.addEventListener('pointermove', event => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

window.addEventListener('scroll', () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll <= 0 ? 0 : (window.scrollY / maxScroll) * 100;
  if (progressBar) progressBar.style.width = `${percent}%`;
}, { passive: true });

let featuredIndex = 0;
setInterval(() => {
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
}, 3800);

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
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2100);
}

document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('mousemove', event => {
    if (window.matchMedia('(max-width: 680px)').matches) return;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });
  button.addEventListener('mouseleave', () => button.style.transform = '');
});

document.getElementById('year').textContent = new Date().getFullYear();
initTheme();
hydrateContactLinks();
renderProjects();
observeReveals();
attachTilt();
