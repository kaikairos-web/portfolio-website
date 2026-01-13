AOS.init({duration:800, once:true});

// Typing effect for role text (simple)
const typingEl = document.getElementById('typing');
const roles = ['Aspiring Frontend Developer', 'UI/UX Enthusiast', 'Learning React & JavaScript'];
let rIndex = 0, cIndex = 0, forward = true;

function typeLoop(){
  const current = roles[rIndex];
  if(forward){
    cIndex++;
    typingEl.textContent = current.slice(0,cIndex);
    if(cIndex === current.length){ forward = false; setTimeout(typeLoop, 1200); return; }
  }else{
    cIndex--;
    typingEl.textContent = current.slice(0,cIndex);
    if(cIndex === 0){ forward = true; rIndex = (rIndex+1) % roles.length; }
  }
  setTimeout(typeLoop, forward ? 90 : 40);
}
if(typingEl) typeLoop();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Update active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

function onScroll(){
  const pos = window.scrollY + 100;
  sections.forEach((sec, idx)=>{
    if(pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight){
      navLinks.forEach(n => n.classList.remove('active'));
      navLinks[idx].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// Simple contact form validation
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let valid = true;
    [name,email,message].forEach(el => {
      if(!el.value.trim()){ el.classList.add('is-invalid'); valid = false; }
      else el.classList.remove('is-invalid');
    });
    // basic email check
    if(email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){
      email.classList.add('is-invalid'); valid = false;
    }
    if(!valid) return;
    // For frontend-only demo we show success and reset
    alert('Thanks! Your message has been received. (Demo)');
    contactForm.reset();
  });
}

// Close mobile navbar on link click
document.querySelectorAll('.navbar-collapse .nav-link').forEach(link =>{
  link.addEventListener('click', ()=>{
    const nav = document.querySelector('.navbar-collapse');
    if(nav.classList.contains('show')) new bootstrap.Collapse(nav).toggle();
  });
});

// --- Social links config ---

const SOCIAL_LINKS = {
  github: 'https://github.com/kaikairos-web',
  facebook: 'https://www.facebook.com/realdjun2',
  instagram: 'https://www.instagram.com/kairoseg2/'
};

// Apply social links to anchors with data-social attribute
document.querySelectorAll('[data-social]').forEach(a => {
  const key = a.dataset.social;
  if(SOCIAL_LINKS[key]){
    a.href = SOCIAL_LINKS[key];
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener noreferrer');
  }
});

// Animate elements when they enter viewport (subtle move+fade)
(function(){
  const els = document.querySelectorAll('.animate-on-enter');
  if(!els.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        // use data-delay (ms) if provided, otherwise compute index-based delay
        let delay = 0;
        const d = el.dataset.delay;
        if(d) delay = parseInt(d);
        else {
          // compute index among siblings for staggered effect
          const list = Array.from(document.querySelectorAll('.animate-on-enter'));
          delay = (list.indexOf(el) % 6) * 80; // 0..5 * 80ms
        }
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('in-view');
        obs.unobserve(el);
      }
    });
  }, {threshold:0.12});

  els.forEach(e => observer.observe(e));
})();

// Certificates modal (lightbox) - smooth open/close animation
(function(){
  const modal = document.getElementById('certModal');
  if(!modal) return;
  const inner = modal.querySelector('.cert-modal-inner');
  const img = modal.querySelector('.cert-modal-img');
  const caption = modal.querySelector('.cert-modal-caption');
  const closeBtn = modal.querySelector('.cert-modal-close');
  let lastFocused = null;

  function openModal(src, alt, title, opener){
    lastFocused = opener || document.activeElement;
    img.src = src;
    img.alt = alt || '';
    caption.textContent = title || '';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // set focus to close button for keyboard users
    closeBtn.focus();
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    setTimeout(()=>{ img.src = ''; caption.textContent = ''; if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus(); lastFocused = null; }, 300);
  }

  // Open when any view button clicked
  document.querySelectorAll('.view-cert').forEach(btn =>{
    btn.addEventListener('click', (e)=>{
      const src = btn.dataset.src;
      const parent = btn.closest('figure');
      const title = parent ? parent.querySelector('h5')?.textContent : '';
      openModal(src, title, title, btn);
    })
  });

  // Close on close button or click outside the image
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  // Handle ESC key to close and arrow navigation
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    if((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && modal.classList.contains('show')){
      const openSrc = img.src;
      const thumbs = Array.from(document.querySelectorAll('.cert-thumb')).map(i => i.dataset.full || i.src);
      let idx = thumbs.indexOf(openSrc);
      if(idx === -1) return;
      idx = e.key === 'ArrowRight' ? (idx + 1) % thumbs.length : (idx - 1 + thumbs.length) % thumbs.length;
      img.src = thumbs[idx];
      const newTitle = document.querySelectorAll('.cert-card h5')[idx]?.textContent || '';
      caption.textContent = newTitle;
    }
  });
})();