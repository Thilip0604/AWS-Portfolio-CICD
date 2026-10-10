// ─── Subtle Minimalist Canvas Background ──────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let animationFrameId = null;

let width = window.innerWidth;
let height = window.innerHeight;

const points = [];
const POINT_COUNT = Math.min(Math.floor((width * height) / 22000), 55);
const MAX_DISTANCE = 120;

function initPoints() {
  points.length = 0;
  for (let i = 0; i < POINT_COUNT; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.2 + 0.8,
    });
  }
}

function resizeCanvas() {
  if (!canvas) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initPoints();
}

if (canvas && ctx) {
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  function drawNetwork() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const opacity = (1 - dist / MAX_DISTANCE) * 0.08;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(drawNetwork);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    drawNetwork();
  }
}

// ─── DOM Ready: Navigation, Smooth Scroll & Form Logic ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
    document.querySelectorAll('svg.lucide').forEach(svg => {
      svg.setAttribute('aria-hidden', 'true');
    });
  }

  // 1. Navbar Glass State on Scroll
  const navBar = document.getElementById('main-nav');
  function handleNavScroll() {
    if (!navBar) return;
    if (window.scrollY > 25) {
      navBar.classList.add('nav-scrolled');
    } else {
      navBar.classList.remove('nav-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 2. Exact Smooth-Scroll Anchor Redirection (Web Guidelines Compliant)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close mobile drawer if open
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
        }

        // Special case: Home scrolls to absolute top of viewport
        if (targetId === '#home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '#home');
          }
          return;
        }

        // Accurate offset scroll calculation for section headers (64px = navbar height)
        const headerOffset = 64;
        const targetPosition = Math.max(0, targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash cleanly
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', targetId);
        }
      }
    });
  });

  // 3. Active Nav Link Highlighting via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('#desktop-nav a[href^="#"]');

  if (sections.length > 0 && desktopLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active-nav');
            } else {
              link.classList.remove('active-nav');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
      }
    });
  }

  // 5. One-Click Copy Email Address
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');
  const statusAnnouncer = document.getElementById('status-announcer');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'kthilip0604@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        if (copyToast) {
          copyToast.classList.remove('opacity-0', 'pointer-events-none');
          copyToast.classList.add('opacity-100');
        }
        if (statusAnnouncer) {
          statusAnnouncer.textContent = 'Email address copied to clipboard.';
        }
        setTimeout(() => {
          if (copyToast) {
            copyToast.classList.remove('opacity-100');
            copyToast.classList.add('opacity-0', 'pointer-events-none');
          }
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // 6. Asynchronous Contact Form (Web3Forms API)
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formSubmitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnHTML = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Sending message…</span>
      `;

      formStatus.className = 'text-xs p-3 rounded-md mt-3 transition-opacity duration-200';
      formStatus.innerHTML = '';

      const formData = new FormData(contactForm);
      const payload = JSON.stringify(Object.fromEntries(formData));

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: payload
        });

        const data = await response.json();

        if (response.status === 200) {
          formStatus.className = 'text-xs p-3 rounded-md mt-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium';
          formStatus.innerHTML = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
          if (statusAnnouncer) {
            statusAnnouncer.textContent = 'Message sent successfully.';
          }
          contactForm.reset();
        } else {
          formStatus.className = 'text-xs p-3 rounded-md mt-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium';
          formStatus.innerHTML = data.message || 'Unable to send message right now. Please email directly at kthilip0604@gmail.com.';
        }
      } catch (err) {
        formStatus.className = 'text-xs p-3 rounded-md mt-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium';
        formStatus.innerHTML = 'Network error occurred. Please email directly at kthilip0604@gmail.com.';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnHTML;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
});
