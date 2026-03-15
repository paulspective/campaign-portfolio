(function () {
  const navbar = document.querySelector('nav');
  const indicator = navbar.querySelector('.nav-indicator');
  const links = Array.from(navbar.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const header = document.querySelector('header');
  function handleScroll() {
    if (window.scrollY > header.offsetHeight) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  handleScroll();

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
    { root: null, threshold: 0.5 } // 50% visible
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

  // Smooth scroll for nav links
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial state
  if (links.length > 0) setActiveLink(links[0]);
})();