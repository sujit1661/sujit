// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Close mobile navigation menu' : 'Open mobile navigation menu');
});

// ===== SCROLL REVEAL — staggered per section =====
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

// assign stagger index within each section
document.querySelectorAll('.section, #home').forEach(section => {
  section.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    el.dataset.stagger = i;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = (parseInt(entry.target.dataset.stagger) || 0) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== NAV ACTIVE HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ===== TYPED HERO TEXT =====
const phrases = ['AI Developer.', 'Full Stack Builder.', 'Problem Solver.', 'LLM Engineer.'];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');
function type() {
  if (!typedEl) return;
  const word = phrases[pi];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1800); return; }
  if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
  setTimeout(type, deleting ? 50 : 110);
}
type();

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); mobileMenu.classList.remove('open'); }
  });
});

// ===== CONTACT FORM (static — no backend) =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'var(--accent)';
    btn.style.color = 'var(--foreground)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });
}

// ===== LIGHTBOX for gallery, certifications & project thumbs =====
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-backdrop"></div>
  <div id="lightbox-content">
    <img id="lightbox-img" src="" alt="" />
    <button id="lightbox-close" aria-label="Close lightbox">✕</button>
  </div>`;
document.body.appendChild(lightbox);

const lbImg      = document.getElementById('lightbox-img');
const lbClose    = document.getElementById('lightbox-close');
const lbBackdrop = document.getElementById('lightbox-backdrop');

function openLightbox(src, alt) {
  const lbVid = document.getElementById('lightbox-vid');
  if (lbVid) { lbVid.pause(); lbVid.style.display = 'none'; }
  lbImg.src = src;
  lbImg.alt = alt || '';
  lbImg.style.display = 'block';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lbVid = document.getElementById('lightbox-vid');
  if (lbVid) { lbVid.pause(); lbVid.style.display = 'none'; }
  lbImg.style.display = 'block';
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Gallery images
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

// Cert images
document.querySelectorAll('.cert-img-wrap img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

// Project thumb images
document.querySelectorAll('.project-thumb').forEach(thumb => {
  const img = thumb.querySelector('img');
  if (!img) return;
  thumb.addEventListener('click', () => openLightbox(img.src, img.alt));
  thumb.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.src, img.alt); }
  });
});

// ===== SHOW ALL PROJECTS TOGGLE =====
const showAllBtn = document.getElementById('show-all-btn');
const allProjects = document.getElementById('all-projects');
if (showAllBtn && allProjects) {
  showAllBtn.addEventListener('click', () => {
    const isOpen = allProjects.style.display !== 'none';
    if (isOpen) {
      allProjects.style.display = 'none';
      showAllBtn.querySelector('span').textContent = 'View All GitHub Projects';
      showAllBtn.classList.remove('open');
    } else {
      allProjects.style.display = 'grid';
      showAllBtn.querySelector('span').textContent = 'Show Less';
      showAllBtn.classList.add('open');
      // smooth scroll to grid
      setTimeout(() => allProjects.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  });
}

// ===== VIDEO HOVER PLAY =====
document.querySelectorAll('.gallery-video').forEach(item => {
  const vid = item.querySelector('video');
  if (!vid) return;
  item.addEventListener('mouseenter', () => vid.play());
  item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  item.addEventListener('click', () => {
    const lbContent = document.getElementById('lightbox-content');
    lbImg.style.display = 'none';
    let lbVid = document.getElementById('lightbox-vid');
    if (!lbVid) {
      lbVid = document.createElement('video');
      lbVid.id = 'lightbox-vid';
      lbVid.controls = true;
      lbVid.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:1rem;display:block;box-shadow:0 32px 80px rgba(0,0,0,0.6)';
      lbContent.insertBefore(lbVid, document.getElementById('lightbox-close'));
    }
    lbVid.src = vid.src;
    lbVid.style.display = 'block';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbVid.play();
  });
});

// ===== CONTENT PROTECTION =====
// Disable right-click on media
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') e.preventDefault();
});
// Disable drag on images/videos
document.querySelectorAll('img, video').forEach(el => {
  el.addEventListener('dragstart', e => e.preventDefault());
});
// Apply no-select to gallery and cert sections
document.querySelectorAll('#gallery, #certifications').forEach(el => {
  el.classList.add('no-select');
});

// ===== IMAGE FADE-IN ON LOAD =====
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded')); // show even if broken
  }
});

// ===== TRUST METRICS COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const duration = 1800;
  const stepTime = 16;
  const steps = Math.ceil(duration / stepTime);
  let current = 0;
  const increment = target / steps;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, stepTime);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.trust-metric-num[data-target]');
      nums.forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const trustSection = document.querySelector('.trust-metrics-section');
if (trustSection) counterObserver.observe(trustSection);

// ===== FREELANCE SCROLL PANEL — drag + progress bar =====
(function () {
  const track = document.getElementById('fl-scroll-track');
  const progress = document.getElementById('fl-scroll-progress');
  if (!track) return;

  // update progress bar on scroll
  function updateProgress() {
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }
  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // drag to scroll
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
  });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX);
  });
})();

// ===== PAGE LOADER =====
(function () {
  const loader = document.getElementById('page-loader');
  const bar    = document.getElementById('loader-bar');
  if (!loader) return;

  let pct = 0;
  const interval = setInterval(() => {
    // fast at first, slow near the end until page ready
    pct += pct < 70 ? Math.random() * 12 : Math.random() * 3;
    if (pct > 95) pct = 95;
    bar.style.width = pct + '%';
  }, 80);

  function finish() {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 350);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
    // safety fallback — never hang longer than 3 s
    setTimeout(finish, 3000);
  }
})();

// ===== SCROLL PROGRESS BAR =====
(function () {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

// ===== NAV PILL ACTIVE INDICATOR =====
(function () {
  const pill     = document.getElementById('nav-pill');
  const navWrap  = document.querySelector('.nav-links');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  if (!pill || !navWrap || !links.length) return;

  function movePill(link) {
    if (!link) { pill.classList.remove('visible'); return; }
    const wrapRect = navWrap.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    pill.style.left  = (linkRect.left - wrapRect.left) + 'px';
    pill.style.width = linkRect.width + 'px';
    pill.classList.add('visible');
  }

  // update on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    const active = [...links].find(a => a.getAttribute('href') === '#' + current);
    movePill(active || null);
    // also update text colour (keep existing behaviour)
    links.forEach(a => {
      a.style.color = a === active ? 'var(--accent)' : '';
    });
  }, { passive: true });

  // move pill on hover too
  links.forEach(a => {
    a.addEventListener('mouseenter', () => movePill(a));
    a.addEventListener('mouseleave', () => {
      // return to active section link
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 130) current = s.id;
      });
      const active = [...links].find(l => l.getAttribute('href') === '#' + current);
      movePill(active || null);
    });
  });
})();

// ===== COPY EMAIL BUTTON =====
(function () {
  const btn = document.getElementById('copy-email-btn');
  if (!btn) return;
  const icon = document.getElementById('copy-icon');
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('sujitsadalage1661@gmail.com').then(() => {
      btn.classList.add('copied');
      if (icon) icon.setAttribute('icon', 'lucide:check');
      setTimeout(() => {
        btn.classList.remove('copied');
        if (icon) icon.setAttribute('icon', 'lucide:copy');
      }, 2000);
    }).catch(() => {
      // fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = 'sujitsadalage1661@gmail.com';
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      btn.classList.add('copied');
      if (icon) icon.setAttribute('icon', 'lucide:check');
      setTimeout(() => {
        btn.classList.remove('copied');
        if (icon) icon.setAttribute('icon', 'lucide:copy');
      }, 2000);
    });
  });
})();
