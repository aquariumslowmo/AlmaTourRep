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
 
 
// ── Tour image map
const TOUR_IMAGES = {
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
 
// ── Show booking detail panel
function showBookingDetail(b) {
  const section = document.getElementById('section-bookings');
 
  const dateObj = b.schedule_date ? new Date(b.schedule_date) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    : b.schedule_date || '—';
 
  const img = TOUR_IMAGES[b.title] || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80';
  const isCancelled = b.status === 'cancelled';
  const basePrice = b.total_price || 0;
  const statusIsConfirmed = b.status === 'confirmed';
 
  section.innerHTML = `
    <div class="detail-back-row">
      <button class="detail-back-btn" onclick="backToBookings()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div>
        <h2 class="section-heading" style="margin-bottom:2px">Booking Details</h2>
        <p class="detail-subtitle">Your booking information and trip details.</p>
      </div>
    </div>
 
    <div class="booking-detail-card">
      <div class="detail-hero-row">
        <img src="${img}" alt="${b.title}" class="detail-hero-img" onerror="this.src='https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'">
        <div class="detail-hero-info">
          <h3 class="detail-tour-title">${b.title || 'Tour'}</h3>
          <div class="detail-tour-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#2563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            ${b.location_name || 'Almaty Region, Kazakhstan'}
          </div>
          <div class="detail-rating">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>4.8</span> <span class="detail-rating-count">(153 reviews)</span>
          </div>
        </div>
      </div>
 
      <div class="detail-info-grid">
        <div class="detail-info-block">
          <h4 class="detail-block-title">Booking Information</h4>
          <div class="detail-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span class="detail-info-label">Date</span>
            <span class="detail-info-val">${formattedDate}</span>
          </div>
          <div class="detail-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span class="detail-info-label">Guests</span>
            <span class="detail-info-val">${b.seats_booked} Adult${b.seats_booked > 1 ? 's' : ''}</span>
          </div>
          <div class="detail-info-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${statusIsConfirmed ? '#16a34a' : '#dc2626'}" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="detail-info-label">Status</span>
            <span class="detail-status-badge ${b.status}">${statusIsConfirmed ? 'Confirmed' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
          </div>
        </div>
 
        <div class="detail-payment-block">
          <h4 class="detail-block-title">Payment Summary</h4>
          <div class="detail-payment-row">
            <span>Base Price (${b.seats_booked} Adult${b.seats_booked > 1 ? 's' : ''})</span>
            <span>${basePrice.toLocaleString()} ₸</span>
          </div>
          <div class="detail-payment-row">
            <span>Add-ons</span>
            <span>0 ₸</span>
          </div>
          <div class="detail-payment-divider"></div>
          <div class="detail-payment-row detail-payment-total">
            <span>Total</span>
            <span class="detail-total-amount">${basePrice.toLocaleString()} ₸</span>
          </div>
          <div class="detail-payment-status ${isCancelled ? 'cancelled' : 'paid'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${isCancelled ? 'Booking Cancelled' : 'Payment Completed'}
          </div>
        </div>
      </div>
 
      <div class="detail-info-grid detail-lower-grid">
        <div class="detail-info-block">
          <h4 class="detail-block-title">Trip Information</h4>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            <span class="detail-info-label">Meeting Point</span>
            <span class="detail-info-val">${b.location_name || 'Almaty'}</span>
          </div>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="detail-info-label">Start Time</span>
            <span class="detail-info-val">08:00 AM</span>
          </div>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span class="detail-info-label">Duration</span>
            <span class="detail-info-val">1 Day Tour</span>
          </div>
        </div>
 
        <div class="detail-info-block">
          <h4 class="detail-block-title">Contact Information</h4>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span class="detail-info-label">Guide</span>
            <span class="detail-info-val">Aidos Baizhanov</span>
          </div>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <span class="detail-info-label">Phone</span>
            <span class="detail-info-val">+7 777 123 4567</span>
          </div>
          <div class="detail-info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span class="detail-info-label">Email</span>
            <span class="detail-info-val">aidos@almatour.com</span>
          </div>
        </div>
      </div>
 
      ${!isCancelled ? `
      <div class="detail-actions-row">
        <button class="detail-btn-cancel" onclick="cancelBooking(${b.id})" id="cancelBookingBtn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          Cancel Booking
        </button>
        <button class="detail-btn-download" onclick="downloadTicket()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Ticket
        </button>
      </div>
      <div class="detail-support-note">
        🔒 Need help? Contact us at <a href="mailto:support@almatour.com">support@almatour.com</a> or <a href="tel:+77001234567">+7 700 123 4567</a>
      </div>
      ` : `
      <div class="detail-cancelled-notice">
        This booking has been cancelled. <a href="tours.html">Browse new tours →</a>
      </div>
      `}
    </div>
  `;
}
 
function backToBookings() {
  renderBookings();
}
 
async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
 
  const btn = document.getElementById('cancelBookingBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Cancelling…'; }
 
  try {
    await api.cancelBooking(bookingId);
    // Booking is deleted from server — go back to list
    backToBookings();
  } catch (error) {
    console.error('Cancel failed:', error);
    alert('Failed to cancel booking. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = 'Cancel Booking'; }
  }
}
 
function downloadTicket() {
  alert('Ticket download coming soon!');
}
 
// ── Bookings list view
async function renderBookings() {
  const section = document.getElementById('section-bookings');
  section.innerHTML = `
    <h2 class="section-heading">My Bookings</h2>
    <div class="bookings-grid" id="bookingsGrid">
      <div class="empty-state"><p>Loading bookings...</p></div>
    </div>`;
 
  const grid = document.getElementById('bookingsGrid');
 
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
      const img = TOUR_IMAGES[b.title] || '';
      const imgStyle = img ? `style="background-image:url('${img}')"` : '';
 
      const card = document.createElement('div');
      card.className = 'booking-card';
 
      // Safely pass booking data via data attribute
      card.innerHTML = `
        <div class="booking-card-img" ${imgStyle}></div>
        <div class="booking-card-body">
          <div class="booking-card-title">${b.title || 'Tour'}</div>
          <div class="booking-card-meta">${b.schedule_date} · ${b.seats_booked} Guest${b.seats_booked > 1 ? 's' : ''}</div>
          <span class="status-badge ${statusClass}">${statusIcon} ${b.status}</span>
          <button class="btn-view-details">View Details</button>
        </div>`;
 
      card.querySelector('.btn-view-details').addEventListener('click', () => showBookingDetail(b));
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load bookings:', error);
    grid.innerHTML = '<div class="empty-state"><p>Failed to load bookings. Please try again.</p></div>';
  }
}
 
renderBookings();