// ── Zoom animation on load
setTimeout(() => document.getElementById('leftBg').classList.add('zoomed'), 100);
 
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
 
// ── User storage helpers (localStorage JSON array)
function getUsers() {
  return JSON.parse(localStorage.getItem('almaTour_users') || '[]');
}
 
function saveUsers(users) {
  localStorage.setItem('almaTour_users', JSON.stringify(users));
}
 
function setSession(user) {
  const session = { name: user.name, email: user.email };
  localStorage.setItem('almaTour_session', JSON.stringify(session));
}
 
// ── Login
function handleLogin() {
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
 
  setTimeout(() => {
    const users = getUsers();
    const user  = users.find(u => u.email === email && u.password === password);
 
    if (user) {
      setSession(user);
      showMsg(msgEl, 'success', 'Success! Redirecting…');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } else {
      showMsg(msgEl, 'error', 'Invalid email or password.');
      btn.classList.remove('loading');
      btn.textContent = 'Login';
    }
  }, 600);
}
 
// ── Register
function handleRegister() {
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
 
  setTimeout(() => {
    const users = getUsers();
 
    if (users.find(u => u.email === email)) {
      showMsg(msgEl, 'error', 'An account with this email already exists.');
      btn.classList.remove('loading');
      btn.textContent = 'Sign Up';
      return;
    }
 
    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    setSession(newUser);
 
    showMsg(msgEl, 'success', 'Account created! Redirecting…');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  }, 600);
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
 
// ── If already logged in, skip to main
if (localStorage.getItem('almaTour_session')) {
  window.location.href = 'index.html';
}