// ── Auth check
const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
if (!token) {
  window.location.replace('auth.html');
}

const userSession = JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER) || '{}');

// ── Profile data
let profileData = {
  name:  userSession.name || '',
  email: userSession.email || '',
  phone: '',
};
 
// ── Populate sidebar & profile card ──────────────────────────────────
function renderProfile() {
  const initials = profileData.name
    ? profileData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
 
  document.getElementById('avatarEl').textContent   = initials;
  document.getElementById('sidebarName').textContent = profileData.name  || '—';
  document.getElementById('sidebarEmail').textContent = profileData.email || '—';
  document.getElementById('infoName').textContent   = profileData.name  || '—';
  document.getElementById('infoEmail').textContent  = profileData.email || '—';
  document.getElementById('infoPhone').textContent  = profileData.phone || 'Not set';
}
 
renderProfile();
 
// ── Edit profile toggle ───────────────────────────────────────────────
function toggleEdit() {
  const view = document.getElementById('profileInfoView');
  const form = document.getElementById('profileEditForm');
  const isEditing = form.style.display !== 'none';
 
  if (isEditing) {
    form.style.display = 'none';
    view.style.display = '';
  } else {
    document.getElementById('editName').value  = profileData.name;
    document.getElementById('editEmail').value = profileData.email;
    document.getElementById('editPhone').value = profileData.phone;
    form.style.display = 'block';
    view.style.display = 'none';
  }
}
 
function saveProfile() {
  profileData.name  = document.getElementById('editName').value.trim()  || profileData.name;
  profileData.email = document.getElementById('editEmail').value.trim() || profileData.email;
  profileData.phone = document.getElementById('editPhone').value.trim();

  // Update local storage
  const userData = JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER) || '{}');
  userData.name = profileData.name;
  userData.email = profileData.email;
  localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(userData));

  renderProfile();
  toggleEdit();
}
 
// ── Section navigation ────────────────────────────────────────────────
function showSection(id, btn) {
  document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.side-nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  btn.classList.add('active');
}
 
// ── Bookings (fetch from API)
async function renderBookings() {
  const grid = document.getElementById('bookingsGrid');
  grid.innerHTML = '<div class="empty-state"><p>Loading bookings...</p></div>';

  try {
    const response = await api.getMyBookings();
    const bookings = response.bookings || [];

    grid.innerHTML = '';

    if (!bookings.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🗓️</div>
          <p>No bookings yet.<br><a href="tours.html">Browse tours</a> to get started.</p>
        </div>`;
      return;
    }

    bookings.forEach(b => {
      const statusClass = b.status.toLowerCase();
      const statusIcon  = b.status === 'confirmed' ? '✓' : b.status === 'cancelled' ? '✗' : '⏳';

      const tourImages = {
        'Kolsay Lake':         'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726822/kolsay_rct78o.jpg',
        'Shymbulak Resort':    'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726820/shymb_l6hu9x.jpg',
        'Charyn Canyon':       'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        'Kaindy Lake':         'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        'Medeu Ice Rink':      'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726822/medeu_qc7ys7.jpg',
        'Kok-Tobe Hill':       'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726822/kolsay_rct78o.jpg',
        'Ayusai Waterfall':    'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726367/ayusai_fqjwan.jpg',
        'Kok Zhailau Plateau': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'Alma-Arasan Gorge':   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
        'Terrenkur Trail':     'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
        'Assy Plateau':        'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
        'Turgen Waterfalls':   'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800&q=80',
        'Bartogay Reservoir':  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        'Issyk Lake':          'https://images.unsplash.com/photo-1478827217976-7214a0556393?w=800&q=80',
        'Panfilov Park':       'https://res.cloudinary.com/dxrk1grhm/image/upload/v1777726821/panfilov-park_skbo1w.jpg',
      };
      const img = tourImages[b.title] || '';
      const imgStyle = img ? `style="background-image:url('${img}')"` : '';

      const card = document.createElement('div');
      card.className = 'booking-card';
      card.innerHTML = `
        <div class="booking-card-img" ${imgStyle}></div>
        <div class="booking-card-body">
          <div class="booking-card-title">${b.title || 'Tour'}</div>
          <div class="booking-card-meta">${b.schedule_date} · ${b.seats_booked} Guest${b.seats_booked > 1 ? 's' : ''}</div>
          <span class="status-badge ${statusClass}">${statusIcon} ${b.status}</span>
          <button class="btn-view-details" onclick="window.location.href='tour_detail.html?tour=${b.tour_id}'">View Details</button>
        </div>`;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load bookings:', error);
    grid.innerHTML = '<div class="empty-state"><p>Failed to load bookings. Please try again.</p></div>';
  }
}
 
renderBookings();
 
// ── Favorites (static sample) ─────────────────────────────────────────
function renderFavorites() {
  const favs = [
    { id: 'kaindy',    name: 'Kaindy Lake Tour',             img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', location: 'Almaty Region' },
    { id: 'charyn',    name: 'Charyn Canyon',                img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', location: 'Almaty Region' },
    { id: 'koktobe',   name: 'Kok-Tobe Hill',                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', location: 'Almaty Region' },
  ];
 
  const grid = document.getElementById('favoritesGrid');
  grid.innerHTML = '';
 
  favs.forEach(f => {
    const card = document.createElement('div');
    card.className = 'fav-card';
    card.innerHTML = `
      <div class="fav-card-img" style="background-image:url('${f.img}')"></div>
      <div class="fav-card-body">
        <div class="fav-card-title">${f.name}</div>
        <div class="fav-location">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="color:#2563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          ${f.location}
        </div>
      </div>`;
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `tour_detail.html?tour=${f.id}`;
    grid.appendChild(card);
  });
}
 
renderFavorites();
 
// ── Logout ────────────────────────────────────────────────────────────
function logout() {
  api.logout();
  window.location.href = 'auth.html';
}

// ── Delete account ────────────────────────────────────────────────────
function deleteAccount() {
  if (confirm('Are you sure? This will permanently delete your account and all bookings.')) {
    api.logout();
    window.location.href = 'auth.html';
  }
}

// ─── Cancel Booking ────────────────────────────────────────────────────
window.cancelBooking = async function(bookingId) {
  if (confirm("Are you sure you want to cancel this booking?")) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert("Booking cancelled successfully!");
        renderBookings(); // refresh list
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to cancel");
      }
    } catch (e) {
      console.error(e);
      alert("Error canceling booking");
    }
  }
};
