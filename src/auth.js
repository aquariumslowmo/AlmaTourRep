// ── Zoom animation on load
setTimeout(() => document.getElementById('leftBg').classList.add('zoomed'), 100);

// ── Check if already logged in
if (localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN)) {
  window.location.href = 'index.html';
}

// ── Tab switching
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
  document.getElementById('loginPanel').classList.toggle('active', tab === 'login');
  document.getElementById('registerPanel').classList.toggle('active', tab === 'register');
  clearMessages();
}

function clearMessages() {
  ['loginMsg', 'registerMsg'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'msg';
    el.textContent = '';
  });
}

// ── Login (via API)
async function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msgEl    = document.getElementById('loginMsg');
  const btn      = document.getElementById('loginBtn');

  if (!email || !password) {
    showMsg(msgEl, 'error', 'Please fill in all fields.');
    return;
  }

  btn.classList.add('loading');
  btn.textContent = 'Logging in…';

  try {
    const response = await api.login(email, password);

    if (response && response.token) {
      showMsg(msgEl, 'success', 'Success! Redirecting…');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } else {
      showMsg(msgEl, 'error', 'Invalid credentials. Please try again.');
      btn.classList.remove('loading');
      btn.textContent = 'Login';
    }
  } catch (error) {
    showMsg(msgEl, 'error', 'Login failed. Please check your credentials.');
    btn.classList.remove('loading');
    btn.textContent = 'Login';
  }
}

// ── Register (Note: Registration may need to be handled via backend)
async function handleRegister() {
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;
  const msgEl    = document.getElementById('registerMsg');
  const btn      = document.getElementById('registerBtn');

  if (!name || !email || !password || !confirm) {
    showMsg(msgEl, 'error', 'Please fill in all fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMsg(msgEl, 'error', 'Please enter a valid email.');
    return;
  }
  if (password.length < 6) {
    showMsg(msgEl, 'error', 'Password must be at least 6 characters.');
    return;
  }
  if (password !== confirm) {
    showMsg(msgEl, 'error', 'Passwords do not match.');
    return;
  }

  btn.classList.add('loading');
  btn.textContent = 'Creating account…';

  try {
    const response = await api.register(name, email, password);
    if (response && response.token) {
      showMsg(msgEl, 'success', 'Account created! Redirecting…');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } else {
      showMsg(msgEl, 'error', 'Registration failed. Please try again.');
      btn.classList.remove('loading');
      btn.textContent = 'Sign Up';
    }
  } catch (error) {
    const msg = error.message?.includes('already registered')
      ? 'An account with this email already exists.'
      : 'Registration failed. Please try again.';
    showMsg(msgEl, 'error', msg);
    btn.classList.remove('loading');
    btn.textContent = 'Sign Up';
  }
}


// ── Utility
function showMsg(el, type, text) {
  el.className = 'msg ' + type;
  el.textContent = text;
}

// ── Enter key support
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginActive = document.getElementById('loginPanel').classList.contains('active');
  if (loginActive) handleLogin();
  else handleRegister();
});

