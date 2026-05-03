const params = new URLSearchParams(window.location.search);
const tourId      = params.get('tour')     || '';
const tourName    = params.get('name')     || 'Tour';
const tourImg     = params.get('img')      || '';
const tourPrice   = parseInt(params.get('price') || '0', 10);
const tourDuration = params.get('duration') || '—';
const tourStart    = params.get('start')    || '—';
const tourMeeting  = params.get('meeting')  || '—';
const guests       = parseInt(params.get('guests') || '2', 10);
const dateStr      = params.get('date')    || '—';
const addonTotal   = parseInt(params.get('addons') || '0', 10);
const addonNames   = (params.get('addonNames') || '').split(',').filter(Boolean);
 
const base  = tourPrice * guests;
const total = base + addonTotal;
 
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
 
// ── Populate sidebar ─────────────────────────────────────────────────
if (tourImg) document.getElementById('sidebarImg').style.backgroundImage = `url('${tourImg}')`;
document.getElementById('sidebarTitle').textContent  = tourName;
document.getElementById('sidebarMeta').textContent = `${dateStr} · ${tourStart}`;
document.getElementById('sidebarGuests').textContent = `${guests} Guest${guests > 1 ? 's' : ''} · Small-group guided tour`;
document.getElementById('priceBase').textContent     = `${base.toLocaleString()} ₸`;
document.getElementById('priceAddons').textContent   = `${addonTotal.toLocaleString()} ₸`;
document.getElementById('priceTotal').textContent    = `${total.toLocaleString()} ₸`;
document.getElementById('btnTotalLabel').textContent = `${total.toLocaleString()} ₸`;
document.getElementById('btnPayLabel').textContent   = `Pay Now · ${total.toLocaleString()} ₸`;
document.getElementById('infoPickup').textContent = `${tourMeeting} · ${tourStart}`;
document.title = `AlmaTour | Pay – ${tourName}`;
 
// Add-on chips
const chipsEl = document.getElementById('addonsChips');
addonNames.forEach(name => {
  if (!name) return;
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${name}`;
  chipsEl.appendChild(chip);
});
 
// ── Pre-fill from session ─────────────────────────────────────────────
const session = JSON.parse(localStorage.getItem('almaTour_session') || 'null');
if (session) {
  document.getElementById('payName').value  = session.name  || '';
  document.getElementById('payEmail').value = session.email || '';
}
 
// ── Card formatting ───────────────────────────────────────────────────
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
 
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
}
 
// ── Validation ────────────────────────────────────────────────────────
function showError(msg) {
  document.getElementById('payError').textContent = msg;
}
 
function validate() {
  const name   = document.getElementById('payName').value.trim();
  const email  = document.getElementById('payEmail').value.trim();
  const phone  = document.getElementById('payPhone').value.trim();
  const card   = document.getElementById('payCard').value.replace(/\s/g, '');
  const expiry = document.getElementById('payExpiry').value.trim();
  const cvv    = document.getElementById('payCVV').value.trim();
 
  if (!name)                               { showError('Full name is required.'); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('Enter a valid email.'); return false; }
  if (!phone)                              { showError('Phone number is required.'); return false; }
  if (card.length !== 16 || isNaN(card))  { showError('Enter a valid 16-digit card number.'); return false; }
  if (!/^\d{2}\/\d{2}$/.test(expiry))     { showError('Enter expiry as MM/YY.'); return false; }
  if (cvv.length < 3)                     { showError('Enter a valid 3-digit CVV.'); return false; }
 
  showError('');
  return true;
}
 
// ── Save booking to localStorage ──────────────────────────────────────
function saveBooking() {
  const bookings = JSON.parse(localStorage.getItem('almaTour_bookings') || '[]');
 
  const booking = {
    id:        Date.now(),
    tourId,
    tourName,
    tourImg,
    location:  'Almaty Region',
    date:      dateStr,
    guests,
    total,
    addonNames,
    status:    'Confirmed',
    bookedAt:  new Date().toISOString(),
  };
 
  bookings.push(booking);
  localStorage.setItem('almaTour_bookings', JSON.stringify(bookings));
}
 
// ── Process payment ───────────────────────────────────────────────────
function processPayment() {
  if (!validate()) return;
 
  const btn = document.getElementById('btnPay');
  btn.classList.add('loading');
  btn.querySelector('#btnPayLabel').textContent = 'Processing…';
 
  // Simulate payment processing delay
  setTimeout(() => {
    saveBooking();
 
    document.getElementById('successMsg').textContent =
      `${tourName} on ${dateStr} for ${guests} guest${guests > 1 ? 's' : ''} has been confirmed. Check your profile for details.`;
 
    document.getElementById('successOverlay').style.display = 'flex';
 
    btn.classList.remove('loading');
    btn.querySelector('#btnPayLabel').textContent = `Pay Now · ${total.toLocaleString()} ₸`;
  }, 1800);
}