(async function () {
  // Fallback data for static tours
  const staticToursData = {
    'kolsay': {
      id: 'kolsay',
      title: 'Kolsay Lake',
      location_name: 'Almaty region, Kegensky district',
      description: 'Experience the stunning beauty of Kolsay Lake, one of the most picturesque destinations in Almaty region. This 9-hour day trip takes you through breathtaking mountain landscapes and crystal-clear alpine lakes.',
      price: 25000,
      duration_hours: 9,
      seats_available: 5
    },
    'shymbulak': {
      id: 'shymbulak',
      title: 'Shymbulak Mountain Resort',
      location_name: 'Almaty, Medeu district',
      description: 'Visit the famous Shymbulak Mountain Resort for stunning mountain views and outdoor activities. Perfect for skiing in winter and hiking in summer.',
      price: 30000,
      duration_hours: 5,
      seats_available: 3
    },
    'charyn': {
      id: 'charyn',
      title: 'Charyn Canyon',
      location_name: 'Almaty region, Yenbekshikazakh District',
      description: 'Explore the breathtaking Charyn Canyon with its dramatic red rock formations and scenic views.',
      price: 20000,
      duration_hours: 8,
      seats_available: 7
    },
    'kaindy': {
      id: 'kaindy',
      title: 'Kaindy Lake',
      location_name: 'Almaty region',
      description: 'Discover the unique Kaindy Lake with its distinctive sunken tree formations. A truly unique natural wonder.',
      price: 20000,
      duration_hours: 9,
      seats_available: 9
    },
    'medeu': {
      id: 'medeu',
      title: 'Medeu Ice Rink',
      location_name: 'Almaty, Medeu',
      description: 'Visit the world\'s highest ice rink at Medeu for ice skating and stunning mountain views.',
      price: 25000,
      duration_hours: 6,
      seats_available: 2
    },
    'koktobe': {
      id: 'koktobe',
      title: 'Kok-Tobe Hill',
      location_name: 'Almaty region',
      description: 'Experience panoramic views of Almaty city from Kok-Tobe Hill, a popular tourist destination with cable car rides.',
      price: 18000,
      duration_hours: 4,
      seats_available: 8
    },
    'ayusai': {
      id: 'ayusai',
      title: 'Ayusai Waterfall',
      location_name: 'Almaty region',
      description: 'Hike to the beautiful Ayusai Waterfall during this 5-hour half-day adventure.',
      price: 15000,
      duration_hours: 5,
      seats_available: 6
    },
    'panfilov': {
      id: 'panfilov',
      title: 'Panfilov Park',
      location_name: 'Almaty City Center',
      description: 'Stroll through the historic Panfilov Park in the heart of Almaty city.',
      price: 8000,
      duration_hours: 3,
      seats_available: 15
    }
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tour');
    if (!tourId) { showError('Tour ID not provided'); return; }

    let tour = null;

    // First try to get from API
    if (typeof api !== 'undefined') {
      try {
        const response = await api.listTours();
        tour = (response.tours || []).find(t => String(t.id) === String(tourId));
      } catch (err) {
        console.warn('Failed to fetch from API, using static data:', err);
      }
    }

    // If not found in API, use static data
    if (!tour) {
      tour = staticToursData[tourId];
    }

    if (!tour) {
      showError('Tour not found. Please check the tour ID and try again.');
      return;
    }

    document.title = 'AlmaTour | ' + tour.title;

    const set = function(id, val) {
      var el = document.getElementById(id);
      if (el && val != null) el.textContent = val;
    };

    set('detailTitle', tour.title);
    set('detailLocation', tour.location_name);
    set('detailDesc', tour.description || 'Discover amazing destinations around Almaty.');
    set('detailAbout', tour.description || 'Explore the beauty of Almaty region with professional guides.');
    set('bcPrice', Math.round(tour.price).toLocaleString() + ' ₸');

    var hero = document.getElementById('detailHero');
    if (hero) hero.style.backgroundImage = "url('https://via.placeholder.com/1400x600?text=" + encodeURIComponent(tour.title) + "')";

    var book = document.getElementById('btnBookNow');
    if (book) book.href = 'booking.html?tour=' + tour.id;

    // Rating
    var ratingEl = document.getElementById('detailRatingLine');
    if (ratingEl) ratingEl.textContent = '★★★★☆ 4.8 (3,624 reviews)';

    var bcStarsEl = document.getElementById('bcStars');
    if (bcStarsEl) bcStarsEl.textContent = '★★★★☆ 4.8';

    var inc = document.getElementById('includedList');
    if (inc) inc.innerHTML = '<li>Professional guide</li><li>Transportation</li><li>Entrance fees</li><li>Bottled water</li>';

    var exc = document.getElementById('excludedList');
    if (exc) exc.innerHTML = '<li>Meals and drinks</li><li>Personal expenses</li><li>Travel insurance</li>';

    // Itinerary
    var itin = document.getElementById('itineraryList');
    if (itin) itin.innerHTML = '<li><strong>8:00 AM</strong> - Hotel pickup</li><li><strong>9:00 AM</strong> - Arrival at trailhead</li><li><strong>12:00 PM</strong> - Lunch break</li><li><strong>3:00 PM</strong> - Return journey begins</li><li><strong>6:00 PM</strong> - Arrival at hotel</li>';

    var grid = document.getElementById('galleryGrid');
    if (grid) {
      var html = '';
      for (var i = 1; i <= 4; i++) {
        html += '<div class="gallery-item"><img src="https://via.placeholder.com/400x300?text=' + encodeURIComponent(tour.title) + '+' + i + '"></div>';
      }
      grid.innerHTML = html;
    }

  } catch (err) {
    console.error('Error loading tour details:', err);
    showError('Failed to load tour details. Please try again.');
  }

  function showError(msg) {
    document.body.innerHTML = '<div style="padding:40px;text-align:center"><h2>Error</h2><p>' + msg + '</p><a href="tours.html">Back to Tours</a></div>';
  }
})();