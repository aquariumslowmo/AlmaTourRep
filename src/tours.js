(function () {
  const PER_PAGE = 6;
 
  const allCards = [...document.querySelectorAll('.tour-grid .tour-card')];
  let filteredCards = [...allCards]; // Working copy of cards after filtering
  let totalPages = Math.ceil(filteredCards.length / PER_PAGE);
  let currentPage = 0;
 
  const pgButtonsEl = document.getElementById('pgButtons');
  const pgPrev      = document.getElementById('pgPrev');
  const pgNext      = document.getElementById('pgNext');
 
  // Build numbered page buttons
  function buildButtons() {
    if (!pgButtonsEl) return;
    pgButtonsEl.innerHTML = '';
    totalPages = Math.ceil(filteredCards.length / PER_PAGE);
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.addEventListener('click', () => goTo(i));
      pgButtonsEl.appendChild(btn);
    }
  }
 
  // Show only cards for the current page
  function showPage(p) {
    const grid = document.querySelector('.tour-grid');

    // First hide all cards
    allCards.forEach(c => c.style.display = 'none');

    // Show only the filtered ones for this page
    filteredCards.forEach((card, idx) => {
      const onThisPage = idx >= p * PER_PAGE && idx < (p + 1) * PER_PAGE;
      if (onThisPage) {
        card.style.display = '';
      }
    });
 
    // Update button states
    if (pgButtonsEl) {
      [...pgButtonsEl.children].forEach((btn, i) => {
        btn.classList.toggle('active', i === p);
      });
    }

    if (pgPrev) pgPrev.disabled = p === 0 || totalPages === 0;
    if (pgNext) pgNext.disabled = p >= totalPages - 1;

    // Scroll to top of grid
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
 
  function goTo(p) {
    if (p < 0 || p >= totalPages) return;
    currentPage = p;
    showPage(currentPage);
  }
 
  function changePage(delta) {
    const next = currentPage + delta;
    if (next >= 0 && next < totalPages) goTo(next);
  }
 
  // Expose changePage globally (called by onclick in HTML)
  window.changePage = changePage;
 
  // --- FILTERING LOGIC ---
  const applyBtn = document.querySelector('.apply-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const searchInput = document.querySelector('.search-input input');
  const priceRange = document.querySelector('input[type="range"]');
  const typeCheckboxes = document.querySelectorAll('.filter-group:nth-of-type(4) input[type="checkbox"]');

  // Parse price from card properly
  function getCardPrice(card) {
    const priceText = card.querySelector('.tour-price strong').textContent;
    return parseInt(priceText.replace(/,/g, '').replace(' ₸', ''), 10);
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const maxPrice = priceRange ? parseInt(priceRange.value, 10) : Number.POSITIVE_INFINITY;

    // Get checked categories
    const checkedTypes = Array.from(typeCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.parentElement.textContent.trim());

    filteredCards = allCards.filter(card => {
      // 1. Price search
      const cardPrice = getCardPrice(card);
      if (cardPrice > maxPrice) return false;

      // 2. Type search
      const cardType = card.querySelector('.badge').textContent.trim();
      if (checkedTypes.length > 0 && !checkedTypes.includes(cardType)) return false;

      // 3. Text search
      if (searchTerm) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        if (!title.includes(searchTerm) && !desc.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    currentPage = 0;
    buildButtons();
    showPage(0);
  }

  if (applyBtn) applyBtn.addEventListener('click', applyFilters);

  // Bind the search input to enter key
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (priceRange) priceRange.value = 35000;
      // Update the visual tracker if you have one, falling back to simple reset
      Array.from(typeCheckboxes).forEach(cb => cb.checked = false);
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  }

  buildButtons();
  showPage(0);
})();