const params   = new URLSearchParams(window.location.search);
const slugToDbId = {
  'kolsay': 38, 'shymbulak': 39, 'charyn': 40, 'kaindy': 41,
  'medeu': 42, 'koktobe': 43, 'ayusai': 44, 'kokzhailau': 45,
  'almaarasan': 46, 'terrenkur': 47, 'assy': 48, 'turgen': 49,
  'bartogay': 50, 'issyk': 51, 'panfilov': 52,
};
const rawTourId = params.get('tour') || '0';
const tourId = slugToDbId[rawTourId] || parseInt(rawTourId, 10) || 0;
const tourName = params.get('name')     || 'Tour';
const tourImg  = params.get('img')      || '';
const tourPrice = parseInt(params.get('price') || '0', 10);
const tourDuration = params.get('duration') || '—';
const tourStart    = params.get('start')    || '—';
const tourMeeting  = params.get('meeting')  || '—';

// Check authentication
if (!localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN)) {
  window.location.href = 'auth.html';
}

// Populate sidebar
document.getElementById('sidebarTitle').textContent   = tourName;
document.getElementById('sideDuration').textContent   = tourDuration;
document.getElementById('sideStart').textContent      = tourStart;
document.getElementById('sideMeeting').textContent    = tourMeeting;
if (tourImg) document.getElementById('sidebarImg').style.backgroundImage = `url('${tourImg}')`;
document.title = `AlmaTour | Reserve – ${tourName}`;
 
// ── State ──────────────────────────────────────────────────────────
let selectedDate = null;
let guests       = 2;
let addonTotal   = 0;
const UNAVAILABLE_DAYS = [1, 5, 10, 15, 20, 25]; // example blocked dates (day-of-month)
 
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
 
// ── Calendar init ─────────────────────────────────────────────────
const today = new Date();
let calYear  = today.getFullYear();
let calMonth = today.getMonth();
 
// Populate month / year selects
const monthSel = document.getElementById('calMonth');
const yearSel  = document.getElementById('calYear');
 
MONTHS.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = m;
  monthSel.appendChild(opt);
});
 
for (let y = today.getFullYear(); y <= today.getFullYear() + 2; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSel.appendChild(opt);
}
 
monthSel.value = calMonth;
yearSel.value  = calYear;
 
document.getElementById('calPrev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  monthSel.value = calMonth;
  yearSel.value  = calYear;
  renderCalendar();
});
 
document.getElementById('calNext').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  monthSel.value = calMonth;
  yearSel.value  = calYear;
  renderCalendar();
});
 
function renderCalendar() {
  calMonth = parseInt(monthSel.value);
  calYear  = parseInt(yearSel.value);
 
  const grid    = document.getElementById('calGrid');
  grid.innerHTML = '';
 
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
 
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
 
  for (let d = 1; d <= daysInMonth; d++) {
    const el  = document.createElement('div');
    const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isUnavail = UNAVAILABLE_DAYS.includes(d) || isPast;
 
    el.className = 'cal-day' + (isUnavail ? ' unavail' : '');
    el.textContent = d;
 
    if (selectedDate && selectedDate.d === d && selectedDate.m === calMonth && selectedDate.y === calYear) {
      el.classList.add('selected');
    }
 
    if (!isUnavail && d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()) {
      el.classList.add('today');
    }
 
    if (!isUnavail) {
      el.addEventListener('click', () => selectDate(d, calMonth, calYear));
    }
 
    grid.appendChild(el);
  }
}
 
function selectDate(d, m, y) {
  selectedDate = { d, m, y };
  const dateStr = `${MONTHS[m].slice(0,3)} ${d}, ${y}`;
  document.getElementById('dateText').textContent = dateStr;
  renderCalendar();
  updatePrice();
}
 
function toggleCalendar() {
  const wrap = document.getElementById('calendarWrap');
  wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
}
 
renderCalendar();
 
// ── Guests ────────────────────────────────────────────────────────
function changeGuests(delta) {
  guests = Math.max(1, Math.min(8, guests + delta));
  document.getElementById('guestCount').textContent = guests;
  document.getElementById('guestsLabel').textContent = `Adults: ${guests} • Children: 0`;
  document.getElementById('guestMinus').disabled = guests <= 1;
  document.getElementById('guestPlus').disabled  = guests >= 8;
  updatePrice();
}
 
// ── Add-ons ───────────────────────────────────────────────────────
function toggleAddon(el, price) {
  el.classList.toggle('active');
  addonTotal = [...document.querySelectorAll('.addon-item.active')]
    .reduce((sum, item) => {
      const txt = item.querySelector('.addon-price').textContent;
      return sum + parseInt(txt.replace(/[^0-9]/g, ''), 10);
    }, 0);
  updatePrice();
}
 
// ── Price update ──────────────────────────────────────────────────
function updatePrice() {
  const base   = tourPrice * guests;
  const total  = base + addonTotal;
 
  document.getElementById('priceBaseLabel').textContent = `Base price × ${guests}`;
  document.getElementById('priceBase').textContent      = `${base.toLocaleString()} ₸`;
  document.getElementById('priceAddons').textContent    = `${addonTotal.toLocaleString()} ₸`;
  document.getElementById('priceTotal').textContent     = `${total.toLocaleString()} ₸`;
 
  if (selectedDate) {
    const { d, m, y } = selectedDate;
    document.getElementById('priceSummary').textContent =
      `${guests} Guest${guests > 1 ? 's' : ''} · ${MONTHS[m].slice(0,3)} ${d} · Total: ${total.toLocaleString()} ₸`;
  } else {
    document.getElementById('priceSummary').textContent = 'Select a date to continue';
  }
}
 
updatePrice();
 
function proceedToPayment() {
  const summaryEl = document.getElementById('priceSummary');
  if (!selectedDate) {
    summaryEl.textContent = '⚠️ Please select a date first.';
    summaryEl.style.color = '#dc2626';
    document.getElementById('calendarWrap').style.display = 'block';
    document.getElementById('calendarWrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const { d, m, y } = selectedDate;
  const dateStr = `${MONTHS[m].slice(0,3)} ${d}, ${y}`;

  const selectedAddons = [...document.querySelectorAll('.addon-item.active')].map(item => item.querySelector('.addon-name').textContent);

  // Create booking via API
  createBooking();
}

async function createBooking() {
  try {
    const bookingData = {
      tour_id: tourId,
      seats: guests
    };

    const response = await api.createBooking(bookingData);

    if (response && response.booking_id) {
      const summaryEl = document.getElementById('priceSummary');
      summaryEl.textContent = '✅ Booking confirmed! Redirecting to payment...';
      summaryEl.style.color = '#10b981';

      const payParams = new URLSearchParams({
        booking_id: response.booking_id,
        tour: rawTourId,
        name: tourName,
        img: tourImg,
        price: response.total_price,
        guests: guests,
      });

      setTimeout(() => {
        window.location.href = 'payment.html?' + payParams.toString();
      }, 2000);
    } else {
      throw new Error('Failed to create booking');
    }
  } catch (error) {
    console.error('Booking error:', error);
    const summaryEl = document.getElementById('priceSummary');
    summaryEl.textContent = '❌ Booking failed. Please try again.';
    summaryEl.style.color = '#dc2626';
  }
}