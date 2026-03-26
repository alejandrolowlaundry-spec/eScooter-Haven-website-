/* =========================================
   eScooterHaven — Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const body = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        body.style.overflow = '';
      }
    });
  }

  /* ---- Sticky Header Shadow ---- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---- Reading Progress Bar ---- */
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    const article = document.querySelector('.article-body') || document.querySelector('article');
    if (article) {
      window.addEventListener('scroll', function () {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const progress = Math.min(
          100,
          Math.max(0, ((scrolled - articleTop + windowHeight * 0.5) / articleHeight) * 100)
        );
        progressBar.style.width = progress + '%';
      }, { passive: true });
    }
  }

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').classList.remove('open');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });

  // Open first FAQ by default if exists
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) {
    firstFaq.classList.add('open');
    const firstAnswer = firstFaq.querySelector('.faq-answer');
    if (firstAnswer) firstAnswer.classList.add('open');
  }

  /* ---- Back to Top Button ---- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Counter Animation ---- */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      }

      requestAnimationFrame(update);
    });
  }

  // Intersection observer for counters
  const statSection = document.querySelector('.stats-grid, .trust-grid');
  if (statSection) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statSection);
  }

  /* ---- Active Nav Link Highlighting ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* ---- Category Filter Pills (blog page) ---- */
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) {
        p.classList.remove('active');
      });
      pill.classList.add('active');
    });
  });

  /* ---- Newsletter Form ---- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = newsletterForm.querySelector('button');
        const original = btn.textContent;
        btn.textContent = 'Subscribed! ✓';
        btn.style.background = '#065f46';
        setTimeout(function () {
          btn.textContent = original;
          btn.style.background = '';
          input.value = '';
        }, 3000);
      }
    });
  }

  /* ---- Contact Form ---- */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = '#065f46';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});
