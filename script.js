// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
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

// ===== LIGHTBOX for gallery & certifications =====
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-backdrop"></div>
  <div id="lightbox-content">
    <img id="lightbox-img" src="" alt="" />
    <button id="lightbox-close" aria-label="Close">✕</button>
  </div>`;
document.body.appendChild(lightbox);

const lbImg = document.getElementById('lightbox-img');
const lbClose = document.getElementById('lightbox-close');
const lbBackdrop = document.getElementById('lightbox-backdrop');

document.querySelectorAll('.gallery-item img, .cert-img-wrap img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

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
  // click opens lightbox with video
  item.addEventListener('click', () => {
    // create video lightbox
    const lb = document.getElementById('lightbox');
    const lbContent = document.getElementById('lightbox-content');
    // swap img for video temporarily
    const existingImg = document.getElementById('lightbox-img');
    existingImg.style.display = 'none';
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
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbVid.play();
  });
});

// patch close to also handle video
const origClose = window.closeLightbox;
window.closeLightbox = function() {
  const lbVid = document.getElementById('lightbox-vid');
  if (lbVid) { lbVid.pause(); lbVid.style.display = 'none'; }
  const lbImg = document.getElementById('lightbox-img');
  if (lbImg) lbImg.style.display = 'block';
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
};
document.getElementById('lightbox-close').addEventListener('click', window.closeLightbox);
document.getElementById('lightbox-backdrop').addEventListener('click', window.closeLightbox);

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
