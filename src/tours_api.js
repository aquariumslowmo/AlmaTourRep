/**
 * Tours Page - API Integration
 * Loads tours from backend and manages filtering & pagination
 */

(async function () {


  const PER_PAGE = 6;

  let allTours = [];
  let filteredTours = [];
  let totalPages = 0;
  let currentPage = 0;

  const pgButtonsEl = document.getElementById('pgButtons');
  const pgPrev       = document.getElementById('pgPrev');
  const pgNext       = document.getElementById('pgNext');
  const tourGrid     = document.querySelector('.tour-grid');

  // ──────────────────────────────────────────────────────────────────
  // Load tours from API
  // ──────────────────────────────────────────────────────────────────
  async function loadTours() {
    try {
      const response = await api.listTours();
      allTours = response.tours || [];
      filteredTours = [...allTours];
      buildButtons();
      showPage(0);
    } catch (error) {
      console.error('Failed to load tours:', error);
      tourGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2em;">Failed to load tours. Please try again.</div>';
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // Render tour card HTML
  // ──────────────────────────────────────────────────────────────────
  function createTourCard(tour) {
    const card = document.createElement('article');
    card.className = 'tour-card';

    const imageUrl = `/images/${tour.id}.jpg`; // Change when you have backend image storage
    const rating = '★★★★☆';
    const ratingCount = '4.8 (3,624)';
    const spot = tour.seats_available > 0 ? tour.seats_available : 'Full';

    card.innerHTML = `
      <img src="${imageUrl}" alt="${tour.title}" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(tour.title)}'">
      <div class="tour-content">
        <div class="tour-meta-top">
          <span>${tour.duration_hours || 2} hours · Day trip</span>
          <span class="badge">Nature</span>
        </div>
        <h3>${tour.title}</h3>
        <p>${tour.location_name}</p>
        <div class="tour-bottom">
          <div>
            <div class="tour-rating">${rating} <span>${ratingCount}</span></div>
            <small>Spots left: ${spot}</small>
          </div>
          <div class="tour-price">From <strong>${Math.round(tour.price).toLocaleString()} ₸</strong></div>
        </div>
        <a href="tour_detail.html?tour=${tour.id}&from=api" class="details-btn">View Details</a>
      </div>
    `;
    return card;
  }

  // ──────────────────────────────────────────────────────────────────
  // Build (render) page buttons
  // ──────────────────────────────────────────────────────────────────
  function buildButtons() {
    pgButtonsEl.innerHTML = '';
    totalPages = Math.ceil(filteredTours.length / PER_PAGE);
    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i + 1;
      btn.addEventListener('click', () => goTo(i));
      pgButtonsEl.appendChild(btn);
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // Show page
  // ──────────────────────────────────────────────────────────────────
  function showPage(p) {
    currentPage = p;

    // Clear grid
    tourGrid.innerHTML = '';

    // Get tours for this page
    const start = p * PER_PAGE;
    const end = start + PER_PAGE;
    const pageToTours = filteredTours.slice(start, end);

    // Render cards
    pageToTours.forEach(tour => {
      tourGrid.appendChild(createTourCard(tour));
    });

    // Update button states
    [...pgButtonsEl.children].forEach((btn, i) => {
      btn.classList.toggle('active', i === p);
    });

    pgPrev.disabled = p === 0 || totalPages === 0;
    pgNext.disabled = p >= totalPages - 1;

    // Scroll to top
    tourGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goTo(p) {
    if (p < 0 || p >= totalPages) return;
    showPage(p);
  }

  function changePage(delta) {
    const next = currentPage + delta;
    if (next >= 0 && next < totalPages) goTo(next);
  }

  window.changePage = changePage;

  // ──────────────────────────────────────────────────────────────────
  // Filtering
  // ──────────────────────────────────────────────────────────────────
  const applyBtn = document.querySelector('.apply-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const searchInput = document.querySelector('.search-input input');
  const priceRange = document.querySelector('input[type="range"]');
  const typeCheckboxes = document.querySelectorAll('.filter-group:nth-of-type(4) input[type="checkbox"]');

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const maxPrice = parseInt(priceRange.value, 10);

    const checkedTypes = Array.from(typeCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.parentElement.textContent.trim());

    filteredTours = allTours.filter(tour => {
      // 1. Price filter
      if (Math.round(tour.price) > maxPrice) return false;

      // 2. Type filter (placeholder - adjust based on your tour types)
      if (checkedTypes.length > 0) {
        // Add your logic here to match tour types
      }

      // 3. Text search
      if (searchTerm) {
        const title = tour.title.toLowerCase();
        const desc = (tour.description || '').toLowerCase();
        const location = (tour.location_name || '').toLowerCase();
        if (!title.includes(searchTerm) && !desc.includes(searchTerm) && !location.includes(searchTerm)) {
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
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      priceRange.value = 35000;
      Array.from(typeCheckboxes).forEach(cb => cb.checked = false);
      searchInput.value = '';
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // Initial load
  // ──────────────────────────────────────────────────────────────────
  await loadTours();
})();

