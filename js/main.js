
AOS.init({duration:800, once:true});

// Typing effect for role text (simple)
const typingEl = document.getElementById('typing');
const roles = ['Frontend Developer', 'UI/UX Enthusiast', 'React & JS Lover'];
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