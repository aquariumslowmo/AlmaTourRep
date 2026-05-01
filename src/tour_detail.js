(async function () {
  // Fallback data for static tours
  const staticToursData = {
    kolsay: {
      id: 'kolsay',
      slug: 'kolsay',
      title: 'Kolsay Lake',
      location_name: 'Almaty region',
      description: 'Experience the stunning beauty of Kolsay Lake, one of the most picturesque destinations in Almaty region.',
      price: 25000,
      duration_hours: 9,
      seats_available: 5
    },
    shymbulak: {
      id: 'shymbulak',
      slug: 'shymbulak',
      title: 'Shymbulak Resort',
      location_name: 'Almaty region',
      description: 'Take the cable car to Shymbulak Resort for mountain views, snow activities, and summer hiking.',
      price: 30000,
      duration_hours: 5,
      seats_available: 3
    },
    charyn: {
      id: 'charyn',
      slug: 'charyn',
      title: 'Charyn Canyon',
      location_name: 'Almaty region',
      description: 'Explore the dramatic red rock formations and scenic views of Charyn Canyon.',
      price: 20000,
      duration_hours: 8,
      seats_available: 7
    },
    kaindy: {
      id: 'kaindy',
      slug: 'kaindy',
      title: 'Kaindy Lake',
      location_name: 'Almaty region',
      description: 'Discover the unique Kaindy Lake with its distinctive sunken tree formations.',
      price: 20000,
      duration_hours: 9,
      seats_available: 9
    },
    medeu: {
      id: 'medeu',
      slug: 'medeu',
      title: 'Medeu Ice Rink',
      location_name: 'Almaty region',
      description: 'Visit the world\'s highest ice rink at Medeu for skating and mountain views.',
      price: 25000,
      duration_hours: 6,
      seats_available: 2
    },
    koktobe: {
      id: 'koktobe',
      slug: 'koktobe',
      title: 'Kok-Tobe Hill',
      location_name: 'Almaty region',
      description: 'Enjoy panoramic views of Almaty city from Kok-Tobe Hill and its famous cable car ride.',
      price: 18000,
      duration_hours: 4,
      seats_available: 8
    },
    ayusai: {
      id: 'ayusai',
      slug: 'ayusai',
      title: 'Ayusai Waterfall',
      location_name: 'Almaty region',
      description: 'Hike to the beautiful Ayusai Waterfall during this half-day adventure.',
      price: 15000,
      duration_hours: 5,
      seats_available: 6
    },
    kokzhailau: {
      id: 'kokzhailau',
      slug: 'kokzhailau',
      title: 'Kok Zhailau Plateau',
      location_name: 'Almaty region',
      description: 'A scenic mountain plateau with panoramic views and fresh alpine air.',
      price: 18000,
      duration_hours: 6,
      seats_available: 8
    },
    almaarasan: {
      id: 'almaarasan',
      slug: 'almaarasan',
      title: 'Alma-Arasan Gorge',
      location_name: 'Almaty region',
      description: 'Relax in a beautiful gorge with waterfalls, hot springs, and mountain scenery.',
      price: 12000,
      duration_hours: 4,
      seats_available: 10
    },
    terrenkur: {
      id: 'terrenkur',
      slug: 'terrenkur',
      title: 'Terrenkur Trail',
      location_name: 'Almaty, Medeu district',
      description: 'Walk the popular Terrenkur Trail for a light city hike and scenic views.',
      price: 10000,
      duration_hours: 3,
      seats_available: 12
    },
    assy: {
      id: 'assy',
      slug: 'assy',
      title: 'Assy Plateau',
      location_name: 'Almaty region',
      description: 'Explore the high-altitude Assy Plateau, known for stunning landscapes and open skies.',
      price: 28000,
      duration_hours: 10,
      seats_available: 4
    },
    turgen: {
      id: 'turgen',
      slug: 'turgen',
      title: 'Turgen Waterfalls',
      location_name: 'Almaty region',
      description: 'Visit the scenic Turgen Waterfalls and enjoy a full day of nature and fresh air.',
      price: 22000,
      duration_hours: 8,
      seats_available: 7
    },
    bartogay: {
      id: 'bartogay',
      slug: 'bartogay',
      title: 'Bartogay Reservoir',
      location_name: 'Almaty region',
      description: 'Spend a day at Bartogay Reservoir with beautiful water views and peaceful landscapes.',
      price: 20000,
      duration_hours: 9,
      seats_available: 9
    },
    issyk: {
      id: 'issyk',
      slug: 'issyk',
      title: 'Issyk Lake',
      location_name: 'Almaty region',
      description: 'Discover Issyk Lake, a beautiful mountain lake surrounded by scenic peaks.',
      price: 17000,
      duration_hours: 7,
      seats_available: 6
    },
    panfilov: {
      id: 'panfilov',
      slug: 'panfilov',
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
        tour = (response.tours || []).find(t => String(t.id) === String(tourId) || String(t.slug || '') === String(tourId));
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
    if (hero) {
      var heroImage = tour.image_url || ('https://via.placeholder.com/1400x600?text=' + encodeURIComponent(tour.title));
      hero.style.backgroundImage = "url('" + heroImage + "')";
    }

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