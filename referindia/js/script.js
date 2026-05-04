// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loadingScreen');
    const progress = document.querySelector('.loading-progress');
    if (progress) progress.style.width = '100%';
    setTimeout(() => {
        if (loader) loader.style.opacity = '0';
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 600);
    }, 1400);
});

// Custom Cursor
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
document.addEventListener('mousemove', (e) => {
    if (dot) dot.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
    if (ring) ring.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
});
document.querySelectorAll('a, button, .feature-card-3d, .service-tilt, .portfolio-card').forEach(el => {
    el.addEventListener('mouseenter', () => { if (ring) ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', () => { if (ring) ring.style.width = '36px'; ring.style.height = '36px'; });
});

// Mobile Menu
const toggle = document.getElementById('mobileToggle');
const menu = document.getElementById('navMenu');
if (toggle) toggle.addEventListener('click', () => menu.classList.toggle('active'));

// Smooth Scroll (native with Lenis-style feel)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// Parallax Scroll Layers (data-speed)
window.addEventListener('scroll', () => {
    document.querySelectorAll('[data-speed]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        const yOffset = window.scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
    });
});

// 3D Tilt Effect on Hover (mousemove)
const tiltElements = document.querySelectorAll('[data-tilt]');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// Scroll Reveal (fade-in, scale)
const revealItems = document.querySelectorAll('.feature-card-3d, .service-tilt, .timeline-card, .team-member, .portfolio-card, .service-card-3d');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealItems.forEach(el => { el.classList.add('fade-in-scroll'); observer.observe(el); });

// Animated Counters (about page)
const counters = document.querySelectorAll('.stat-number');
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let curr = 0;
                const interval = setInterval(() => {
                    if (curr < target) { curr += Math.ceil(target / 45); el.innerText = curr; }
                    else { el.innerText = target; clearInterval(interval); }
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
}

// Back to Top
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => { if (backBtn) backBtn.style.display = window.scrollY > 500 ? 'flex' : 'none'; });
if (backBtn) backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== PORTFOLIO MODAL SYSTEM (Event Delegation) =====
const projects = {
  1: {
    title: "ePrescribe – AI-powered clinic & hospital management software",
    description: "An advanced AI-driven healthcare platform designed to streamline clinic and hospital operations. ePrescribe helps doctors and medical staff manage patient records, digital prescriptions, appointments, and treatment history in one secure system. It reduces manual paperwork, improves accuracy in prescriptions, and enhances overall patient care efficiency through smart automation and AI assistance."
  },
  2: {
    title: "Smart AI parking solution for societies & corporates",
    description: "SafePark is an intelligent parking management system powered by AI that simplifies vehicle entry, exit, and space allocation. It is ideal for residential societies, corporate offices, malls, and gated communities. The system provides real-time parking availability, automated gate control, visitor tracking, and enhanced security through number plate recognition and smart monitoring."
  },
  3: {
    title: "Alumni management for corporates & universities",
    description:"AlumniSoft is a dedicated platform that helps institutions maintain strong connections with their alumni network. It enables universities and organizations to manage alumni profiles, track achievements, organize events, and promote networking opportunities. The system strengthens engagement through communication tools, event invitations, and career updates."
},
4:{
    title:"Attendance & payroll software for MSMEs & hospitals",
    description:"SmartAttendance is a modern attendance and payroll automation system designed for small businesses, hospitals, and enterprises. It supports biometric, QR, and mobile-based attendance tracking. The software automatically calculates working hours, leaves, overtime, and generates payroll reports, reducing manual HR workload and improving accuracy."
},
5:{
    title:"CRM solution for MSMEs & healthcare",
    description:"eCRM is a customer relationship management system built for small businesses and healthcare providers. It helps manage leads, customer interactions, follow-ups, and sales pipelines in a structured way. With smart analytics and automation, eCRM improves customer engagement, retention, and business growth."
},
6:{
    title:"Smart NFC card management software",
    description:"eCards is a next-generation NFC-based smart card system for digital identity, access control, and business networking. Users can share information instantly by tapping their NFC card on a smartphone. It is ideal for corporate ID cards, business cards, event passes, and secure access systems, offering a fully digital and contactless experience."
}
};

// Modal Elements
const projectModal = document.getElementById('projectModal');
const closeModalBtn = projectModal?.querySelector('.close-modal');

// Portfolio Masonry Container (Event Delegation)
const portfolioMasonry = document.querySelector('.portfolio-masonry');

/**
 * Opens modal and updates content with project data
 * @param {string|number} projectId - Project ID from data-project attribute
 */
function openProjectModal(projectId) {
  if (!projectModal) return;

  console.log('Opening project modal for ID:', projectId);

  const project = projects[projectId];
  if (!project) {
    console.warn(`Project ${projectId} not found in projects object`);
    return;
  }

  // Update modal content dynamically using modal-specific selectors
  const titleElement = projectModal.querySelector('h2');
  const descriptionElement = projectModal.querySelector('p');

  if (titleElement) titleElement.textContent = project.title;
  if (descriptionElement) descriptionElement.textContent = project.description;

  // Show modal with animation
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the project modal
 */
function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event Delegation: Single listener on portfolio-masonry
if (portfolioMasonry) {
  portfolioMasonry.addEventListener('click', (e) => {
    // Find closest parent .portfolio-card from click target
    const card = e.target.closest('.portfolio-card');
    
    if (card) {
      const projectId = card.getAttribute('data-project');
      console.log('Clicked portfolio card project id:', projectId);
      if (projectId) {
        openProjectModal(projectId);
      }
    }
  });
}

// Close Button Handler
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeProjectModal);
}

// Close Modal: Click Outside (on backdrop)
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });
}

// Close Modal: ESC Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
    closeProjectModal();
  }
});

// Contact Form Validation
const form = document.getElementById('contactForm3d');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const feedback = document.getElementById('formFeedback');
        if (!name || !email || !email.includes('@')) {
            if (feedback) feedback.innerHTML = '<span style="color:#ff5e5e;">Please fill valid name & email.</span>';
        } else {
            if (feedback) feedback.innerHTML = '<span style="color:#00ffaa;">✓ Message received. We\'ll orbit back soon.</span>';
            form.reset();
        }
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.style.background = 'rgba(3,5,10,0.98)';
    else navbar.style.background = 'rgba(3,5,10,0.85)';
});
document.getElementById('heroVideo')?.play();

// Hero text fade-in animation on load
document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .hero-badge').forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease ${idx * 0.15}s, transform 0.8s ease ${idx * 0.15}s`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 200);
});