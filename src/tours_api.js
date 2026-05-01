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
  const pgPrev = document.getElementById('pgPrev');
  const pgNext = document.getElementById('pgNext');
  const tourGrid = document.querySelector('.tour-grid');
  const paginationRow = document.querySelector('.pagination-row');
  const applyBtn = document.querySelector('.apply-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const searchInput = document.querySelector('.search-input input');
  const priceRange = document.querySelector('input[type="range"]');
  const typeCheckboxes = document.querySelectorAll('.filter-group:nth-of-type(4) input[type="checkbox"]');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getTourKey(tour) {
    return String(tour?.slug || tour?.id || '');
  }

  function formatDurationLabel(tour) {
    if (tour?.meta_text) return tour.meta_text;

    const hours = Number(tour?.duration_hours);
    if (!Number.isFinite(hours) || hours <= 0) return 'Day trip';

    const hoursText = Number.isInteger(hours) ? `${hours} hours` : `${hours.toFixed(1)} hours`;
    const tripKind = hours <= 5 ? 'Half day' : 'Day trip';
    return `${hoursText} · ${tripKind}`;
  }

  function renderStars(rating) {
    const safeRating = Number(rating);
    const filled = Number.isFinite(safeRating) ? Math.max(0, Math.min(5, Math.round(safeRating))) : 5;
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }

  function formatRatingText(tour) {
    const rating = Number(tour?.rating);
    const ratingValue = Number.isFinite(rating) ? rating.toFixed(1) : '4.8';
    const count = Number(tour?.rating_count);
    const ratingCount = Number.isFinite(count) ? count.toLocaleString() : '3,624';
    return `${ratingValue} (${ratingCount})`;
  }

  function formatPrice(price) {
    const value = Number(price) || 0;
    return `${Math.round(value).toLocaleString()} ₸`;
  }

  function resolveImageUrl(tour) {
    return tour?.image_url || `https://via.placeholder.com/800x600?text=${encodeURIComponent(tour?.title || 'AlmaTour')}`;
  }

  function setPaginationVisibility(visible) {
    if (!paginationRow) return;
    paginationRow.classList.toggle('pagination-row--hidden', !visible);
  }

  function renderLoadingState() {
    if (!tourGrid) return;
    tourGrid.classList.add('tour-grid--loading');
    tourGrid.setAttribute('aria-busy', 'true');
    tourGrid.innerHTML = `
      <div class="tour-loader" role="status" aria-live="polite" aria-label="Loading tours">
        <span class="tour-spinner" aria-hidden="true"></span>
        <p>Loading tours...</p>
      </div>
    `;
    setPaginationVisibility(false);
  }

  function renderEmptyState(message) {
    if (!tourGrid) return;
    tourGrid.classList.remove('tour-grid--loading');
    tourGrid.removeAttribute('aria-busy');
    tourGrid.innerHTML = `
      <div class="tour-loader tour-empty-state" role="status">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    setPaginationVisibility(false);
  }

  function renderErrorState(message) {
    if (!tourGrid) return;
    tourGrid.classList.remove('tour-grid--loading');
    tourGrid.removeAttribute('aria-busy');
    tourGrid.innerHTML = `
      <div class="tour-loader tour-error-state">
        <p>${escapeHtml(message)}</p>
        <button class="apply-btn" type="button" id="retryLoadTours">Retry</button>
      </div>
    `;
    setPaginationVisibility(false);

    const retryBtn = document.getElementById('retryLoadTours');
    if (retryBtn) retryBtn.addEventListener('click', loadTours);
  }

  function createTourCard(tour) {
    const card = document.createElement('article');
    card.className = 'tour-card';

    const tourKey = getTourKey(tour);
    const ratingValue = Number(tour?.rating);
    const badge = tour?.badge || 'Nature';
    const spotsLeft = tour?.spots_left ?? tour?.seats_available ?? '—';

    card.innerHTML = `
      <img src="${escapeHtml(resolveImageUrl(tour))}" alt="${escapeHtml(tour?.title || 'Tour')}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x600?text=${encodeURIComponent(tour?.title || 'AlmaTour')}'">
      <div class="tour-content">
        <div class="tour-meta-top">
          <span>${escapeHtml(formatDurationLabel(tour))}</span>
          <span class="badge">${escapeHtml(badge)}</span>
        </div>
        <h3>${escapeHtml(tour?.title || 'Untitled tour')}</h3>
        <p>${escapeHtml(tour?.location_name || 'Almaty region')}</p>
        <div class="tour-bottom">
          <div>
            <div class="tour-rating">${renderStars(ratingValue)} <span>${escapeHtml(formatRatingText(tour))}</span></div>
            <small>Spots left: ${escapeHtml(spotsLeft)}</small>
          </div>
          <div class="tour-price">From <strong>${escapeHtml(formatPrice(tour?.price))}</strong></div>
        </div>
        <a href="tour_detail.html?tour=${encodeURIComponent(tourKey)}&from=api" class="details-btn">View Details</a>
      </div>
    `;
    return card;
  }

  function buildButtons() {
    if (!pgButtonsEl) return;
    pgButtonsEl.innerHTML = '';
    totalPages = Math.ceil(filteredTours.length / PER_PAGE);

    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = i + 1;
      btn.addEventListener('click', () => goTo(i));
      pgButtonsEl.appendChild(btn);
    }
  }

  function updatePaginationState() {
    if (pgPrev) pgPrev.disabled = currentPage === 0 || totalPages === 0;
    if (pgNext) pgNext.disabled = currentPage >= totalPages - 1 || totalPages === 0;

    if (pgButtonsEl) {
      [...pgButtonsEl.children].forEach((btn, i) => {
        btn.classList.toggle('active', i === currentPage);
      });
    }
  }

  function showPage(pageIndex) {
    if (!tourGrid) return;

    currentPage = pageIndex;
    tourGrid.classList.remove('tour-grid--loading');
    tourGrid.removeAttribute('aria-busy');
    tourGrid.innerHTML = '';

    if (filteredTours.length === 0) {
      renderEmptyState('No tours match your filters yet.');
      return;
    }

    const start = pageIndex * PER_PAGE;
    const pageTours = filteredTours.slice(start, start + PER_PAGE);
    pageTours.forEach((tour) => tourGrid.appendChild(createTourCard(tour)));

    updatePaginationState();
    setPaginationVisibility(true);
    tourGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goTo(pageIndex) {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    showPage(pageIndex);
  }

  function changePage(delta) {
    const next = currentPage + delta;
    if (next >= 0 && next < totalPages) goTo(next);
  }

  window.changePage = changePage;

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const maxPrice = priceRange ? parseInt(priceRange.value, 10) : Number.POSITIVE_INFINITY;

    const checkedTypes = Array.from(typeCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.parentElement.textContent.trim().toLowerCase());

    filteredTours = allTours.filter((tour) => {
      if (Number(tour.price) > maxPrice) return false;

      const tourType = String(tour.badge || '').trim().toLowerCase();
      if (checkedTypes.length > 0 && !checkedTypes.includes(tourType)) return false;

      if (searchTerm) {
        const title = String(tour.title || '').toLowerCase();
        const desc = String(tour.description || '').toLowerCase();
        const location = String(tour.location_name || '').toLowerCase();
        const meta = String(tour.meta_text || '').toLowerCase();
        if (!title.includes(searchTerm) && !desc.includes(searchTerm) && !location.includes(searchTerm) && !meta.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    currentPage = 0;
    buildButtons();
    showPage(0);
  }

  async function loadTours() {
    renderLoadingState();

    try {
      if (typeof api === 'undefined') {
        throw new Error('API client is not available');
      }

      const response = await api.listTours();
      allTours = response?.tours || [];
      filteredTours = [...allTours];
      currentPage = 0;
      buildButtons();

      if (filteredTours.length === 0) {
        renderEmptyState('No tours available yet.');
        return;
      }

      showPage(0);
    } catch (error) {
      console.error('Failed to load tours:', error);
      renderErrorState('Failed to load tours. Please try again.');
    }
  }

  if (applyBtn) applyBtn.addEventListener('click', applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (priceRange) priceRange.value = priceRange.max || 35000;
      Array.from(typeCheckboxes).forEach((cb) => (cb.checked = false));
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  }

  await loadTours();
})();

