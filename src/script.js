  const allCards = [...document.querySelectorAll('#toursGrid .tour-card')];
  let page = 0;
  const perPage = 3;
  const totalPages = Math.ceil(allCards.length / perPage);

  function showPage(p) {
    allCards.forEach((c, i) => {
      c.style.display = (i >= p * perPage && i < (p + 1) * perPage) ? '' : 'none';
    });
    document.getElementById('prevBtn').classList.toggle('active', p > 0);
    document.getElementById('nextBtn').classList.toggle('active', p < totalPages - 1);
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (page < totalPages - 1) { page++; showPage(page); }
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (page > 0) { page--; showPage(page); }
  });

  showPage(0);

  // Scroll-reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .step-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });