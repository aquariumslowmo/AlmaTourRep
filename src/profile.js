const session = JSON.parse(localStorage.getItem('almaTour_session') || 'null');
if (!session) window.location.replace('auth.html');
 
// ── Profile data (extend session with extra fields) ───────────────────
let profileData = JSON.parse(localStorage.getItem('almaTour_profile') || 'null') || {
  name:  session ? session.name  : '',
  email: session ? session.email : '',
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
 
  localStorage.setItem('almaTour_profile', JSON.stringify(profileData));
 
  // Also update session name
  const s = JSON.parse(localStorage.getItem('almaTour_session') || '{}');
  s.name  = profileData.name;
  s.email = profileData.email;
  localStorage.setItem('almaTour_session', JSON.stringify(s));
 
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
 
// ── Bookings ──────────────────────────────────────────────────────────
function renderBookings() {
  const bookings = JSON.parse(localStorage.getItem('almaTour_bookings') || '[]');
  const grid = document.getElementById('bookingsGrid');
  grid.innerHTML = '';
 
  if (!bookings.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗓️</div>
        <p>No bookings yet.<br><a href="tours.html">Browse tours</a> to get started.</p>
      </div>`;
    return;
  }
 
  bookings.slice().reverse().forEach(b => {
    const statusClass = b.status.toLowerCase();
    const statusIcon  = b.status === 'Confirmed' ? '✓' : b.status === 'Pending' ? '⏳' : '✗';
    const imgStyle    = b.tourImg
      ? `style="background-image:url('${b.tourImg}')"`
      : '';
 
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.innerHTML = `
      <div class="booking-card-img" ${imgStyle}></div>
      <div class="booking-card-body">
        <div class="booking-card-title">${b.tourName}</div>
        <div class="booking-card-meta">${b.date} · ${b.guests} Guest${b.guests > 1 ? 's' : ''}</div>
        <span class="status-badge ${statusClass}">${statusIcon} ${b.status}</span>
        <button class="btn-view-details" onclick="window.location.href='tour_detail.html?tour=${b.tourId}'">View Details</button>
      </div>`;
    grid.appendChild(card);
  });
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
  localStorage.removeItem('almaTour_session');
  window.location.href = 'auth.html';
}
 
// ── Delete account ────────────────────────────────────────────────────
function deleteAccount() {
  if (confirm('Are you sure? This will permanently delete your account and all bookings.')) {
    ['almaTour_session','almaTour_profile','almaTour_bookings'].forEach(k => localStorage.removeItem(k));
    window.location.href = 'auth.html';
  }
}