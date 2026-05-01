# Download the clean file content and overwrite tour_detail.js
# Just paste this entire block into PowerShell:

$clean = @'
/**
 * Tour Detail Page - API Integration
 */
(async function () {
  try {
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour');
    if (!tourId) { showError('Tour ID not provided in URL'); return; }

    const session = JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEYS.SESSION) || 'null');
    if (!session || !session.token) { window.location.href = 'auth.html'; return; }

    const response = await api.listTours();
    const tour = (response.tours || []).find(t => String(t.id) === String(tourId));
    if (!tour) { showError(`Tour "${tourId}" not found`); return; }

    populateTourDetail(tour);

  } catch (error) {
    console.error('Failed to load tour details:', error);
    showError('Failed to load tour details.');
  }

  function showError(msg) {
    document.body.innerHTML = `<div style="padding:40px;text-align:center"><h2>Error</h2><p>${msg}</p><a href="tours.html">← Back to Tours</a></div>`;
  }

  function setIfExists(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  }

  function populateTourDetail(tour) {
    document.title = `AlmaTour | ${tour.title}`;
    setIfExists('detailTitle', tour.title);
    setIfExists('detailLocation', tour.location_name || 'Almaty region · Kazakhstan');
    setIfExists('detailDesc', tour.description || 'Amazing tour destination.');
    setIfExists('detailAbout', tour.description || 'Amazing tour destination.');
    setIfExists('bcPrice', `${Math.round(tour.price).toLocaleString()} ₸`);

    const ratingEl = document.getElementById('detailRatingLine');
    if (ratingEl) ratingEl.textContent = '★★★★☆ 4.8 (324 reviews)';
    const starsEl = document.getElementById('bcStars');
    if (starsEl) starsEl.textContent = '★★★★☆ 4.8';

    const heroEl = document.getElementById('detailHero');
    if (heroEl) heroEl.style.backgroundImage = `url('https://via.placeholder.com/1400x600?text=${encodeURIComponent(tour.title)}')`;

    const bookBtn = document.getElementById('btnBookNow');
    if (bookBtn) bookBtn.href = `booking.html?tour=${tour.id}`;

    populateItinerary(tour);
    populateIncluded();
    populateGallery(tour);
  }

  function populateItinerary(tour) {
    const list = document.getElementById('itineraryList');
    if (!list) return;
    const d = tour.duration_hours || 8, s = 7;
    const steps = [
      { time: `0${s}:00`, label: 'Departure from Almaty', milestone: true },
      { time: `0${s+2}:00`, label: `Arrival at ${tour.location_name}` },
      { time: `${s+Math.floor(d/2)}:00`, label: 'Lunch break', milestone: true },
      { time: `${s+d-1}:00`, label: 'Return to Almaty', milestone: true },
    ];
    list.innerHTML = steps.map(st => `<li class="${st.milestone?'milestone':''}"><div class="time">${st.time}</div><div class="label">${st.label}</div></li>`).join('');
  }

  function populateIncluded() {
    const inc = document.getElementById('includedList');
    const exc = document.getElementById('excludedList');
    if (inc) inc.innerHTML = ['Transportation','Guide','Entrance fees'].map(i=>`<li>✓ ${i}</li>`).join('');
    if (exc) exc.innerHTML = ['Meals','Personal expenses'].map(i=>`<li>✗ ${i}</li>`).join('');
  }

  function populateGallery(tour) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = [1,2,3,4].map(i=>`<div class="gallery-item"><img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(tour.title)}+${i}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+${i}'"></div>`).join('');
  }
})();
'@

$clean | Set-Content C:\Users\aiblb\PycharmProjects\AlmaTourRep\src\tour_detail.js -Encoding UTF8