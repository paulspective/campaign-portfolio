(function () {
  const navbar = document.querySelector('nav');
  const indicator = navbar.querySelector('.nav-indicator');
  const links = Array.from(navbar.querySelectorAll('a[href^="#"]'));
  const menuToggle = document.querySelector('.menu-toggle');
  const form = document.querySelector('.contact-form');
  const success = document.getElementById('form-success');
  const overlay = document.querySelector('.overlay');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      form.reset();
      success.style.display = 'block';
    }
  });

  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const header = document.querySelector('header');

  function toggleOverlay(show) {
    if (show) {
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
      overlay.style.backdropFilter = 'blur(20px)';
      overlay.style.webkitBackdropFilter = 'blur(20px)';
    } else {
      overlay.style.opacity = '0';
      overlay.style.backdropFilter = 'blur(0px)';
      overlay.style.webkitBackdropFilter = 'blur(0px)';
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
      }, 500);
    }
  }

  function toggleMobileMenu() {
    const isOpen = navbar.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) toggleOverlay(true);
    else toggleOverlay(false);
    const current = links.find(a => a.classList.contains('active'));
    if (current) moveIndicator(current);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      toggleMobileMenu();
    });
  }

  let lastScrollY = window.scrollY;
  let isTicking = false;

  function updateScrollState() {
    if (lastScrollY > header.offsetHeight) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    isTicking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateScrollState);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  updateScrollState();

  function moveIndicator(targetLink) {
    if (!targetLink) {
      indicator.style.width = '0';
      return;
    }
    const navRect = navbar.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  }

  function setActiveLink(link) {
    links.forEach(a => a.classList.toggle('active', a === link));
    moveIndicator(link);
  }

  // IntersectionObserver for active section detection
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeLink = links.find(
            a => a.getAttribute('href') === `#${entry.target.id}`
          );
          if (activeLink) setActiveLink(activeLink);
        }
      });
    },
    { root: null, threshold: 0.25 }
  );

  sections.forEach(section => observer.observe(section));

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const current = links.find(a => a.classList.contains('active')) || links[0];
      moveIndicator(current);
    }, 150);
  });

  // Close mobile menu on outside click
  document.addEventListener('click', event => {
    if (!navbar.classList.contains('open')) return;
    if (navbar.contains(event.target)) return;
    toggleMobileMenu();
  });

  // Smooth scroll for nav links
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // close mobile menu after selecting an item
      if (navbar.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Initial state
  if (links.length > 0) setActiveLink(links[0]);
})();