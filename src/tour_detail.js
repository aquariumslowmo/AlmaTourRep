(async function () {
  try {
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour');
    if (!tourId) { showError('Tour ID not provided'); return; }

    const response = await api.listTours();
    const tour = (response.tours || []).find(t => String(t.id) === String(tourId));
    if (!tour) { showError('Tour not found'); return; }

    document.title = 'AlmaTour | ' + tour.title;

    const set = function(id, val) {
      var el = document.getElementById(id);
      if (el && val != null) el.textContent = val;
    };

    set('detailTitle', tour.title);
    set('detailLocation', tour.location_name);
    set('detailDesc', tour.description || '');
    set('detailAbout', tour.description || '');
    set('bcPrice', Math.round(tour.price).toLocaleString() + ' T');

    var hero = document.getElementById('detailHero');
    if (hero) hero.style.backgroundImage = "url('https://via.placeholder.com/1400x600?text=" + encodeURIComponent(tour.title) + "')";

    var book = document.getElementById('btnBookNow');
    if (book) book.href = 'booking.html?tour=' + tour.id;

    var inc = document.getElementById('includedList');
    if (inc) inc.innerHTML = '<li>Transportation</li><li>Guide</li><li>Entrance fees</li>';

    var exc = document.getElementById('excludedList');
    if (exc) exc.innerHTML = '<li>Meals</li><li>Personal expenses</li>';

    var grid = document.getElementById('galleryGrid');
    if (grid) {
      var html = '';
      for (var i = 1; i <= 4; i++) {
        html += '<div class="gallery-item"><img src="https://via.placeholder.com/400x300?text=' + encodeURIComponent(tour.title) + '+' + i + '"></div>';
      }
      grid.innerHTML = html;
    }

  } catch (err) {
    console.error(err);
    showError('Failed to load tour details.');
  }

  function showError(msg) {
    document.body.innerHTML = '<div style="padding:40px;text-align:center"><h2>Error</h2><p>' + msg + '</p><a href="tours.html">Back to Tours</a></div>';
  }
})();