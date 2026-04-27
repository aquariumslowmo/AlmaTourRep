(function () {
  const PER_PAGE = 6;
 
  const allCards = [...document.querySelectorAll('.tour-grid .tour-card')];
  const totalPages = Math.ceil(allCards.length / PER_PAGE);
  let currentPage = 0;
 
  const pgButtonsEl = document.getElementById('pgButtons');
  const pgPrev      = document.getElementById('pgPrev');
  const pgNext      = document.getElementById('pgNext');
 
  // Build numbered page buttons
  function buildButtons() {
    pgButtonsEl.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.addEventListener('click', () => goTo(i));
      pgButtonsEl.appendChild(btn);
    }
  }
 
  // Show only cards for the current page
  function showPage(p) {
    allCards.forEach((card, idx) => {
      const onThisPage = idx >= p * PER_PAGE && idx < (p + 1) * PER_PAGE;
      card.style.display = onThisPage ? '' : 'none';
    });
 
    // Update button states
    [...pgButtonsEl.children].forEach((btn, i) => {
      btn.classList.toggle('active', i === p);
    });
 
    pgPrev.disabled = p === 0;
    pgNext.disabled = p === totalPages - 1;
 
    // Scroll to top of grid
    document.querySelector('.tour-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
 
  function goTo(p) {
    currentPage = p;
    showPage(currentPage);
  }
 
  function changePage(delta) {
    const next = currentPage + delta;
    if (next >= 0 && next < totalPages) goTo(next);
  }
 
  // Expose changePage globally (called by onclick in HTML)
  window.changePage = changePage;
 
  buildButtons();
  showPage(0);
})();