/* Basecamp side drawer + theme toggle — shared across all pages.
   Set window.BC_BASE to '' (root pages) or '../' (pages in a subfolder) before loading. */
(function () {
  var BASE = (typeof window.BC_BASE === 'string') ? window.BC_BASE : '';

  /* ---- Theme: light by default; remember the viewer's choice ---- */
  try {
    if (localStorage.getItem('bc-theme') === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}

  var ICON = {
    tents: 'M3 20 12 5l9 15Z M12 5v15',
    'sleeping-bags': 'M7 3h7a4 4 0 0 1 4 4v14H7z M7 8h11',
    coolers: 'M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z M3 8l2-4h14l2 4 M9 8v3 M15 8v3',
    backpacks: 'M8 7V6a4 4 0 0 1 8 0v1 M6 7h12v13H6z M9 12h6'
  };
  var CATS = [
    ['backpacks', 'Backpacks'],
    ['sleeping-bags', 'Sleeping Bags'],
    ['coolers', 'Coolers'],
    ['tents', 'Tents']
  ];
  function svg(d, size) { size = size || 20; return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d.split(' M').map(function (p, i) { return '<path d="' + (i ? 'M' : '') + p + '"/>'; }).join('') + '</svg>'; }
  function getName() { try { var n = localStorage.getItem('bc-user'); return (n === null ? 'Arthur' : n).trim(); } catch (e) { return 'Arthur'; } }

  var css = '' +
  '#bc-tab{position:fixed;left:12px;top:12px;z-index:58;width:42px;height:42px;border:1px solid var(--cloud-veil);border-radius:12px;background:var(--paper-white);color:var(--midcurrent-navy);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.16);transition:transform .15s,background .2s;}' +
  '#bc-tab:hover{transform:scale(1.06);}' +
  '#bc-tab span{display:block;width:17px;height:2px;border-radius:2px;background:currentColor;}' +
  '#bc-scrim{position:fixed;inset:0;z-index:59;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .3s;}' +
  '#bc-scrim.on{opacity:1;pointer-events:auto;}' +
  '#bc-drawer{position:fixed;top:0;left:0;height:100vh;width:280px;max-width:84vw;z-index:60;background:var(--paper-white);border-right:1px solid var(--cloud-veil);' +
  'transform:translateX(-102%);transition:transform .32s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;font-family:Outfit,ui-sans-serif,system-ui,sans-serif;box-shadow:24px 0 60px -24px rgba(0,0,0,.5);}' +
  '#bc-drawer.on{transform:none;}' +
  '#bc-drawer .bc-x{position:absolute;top:14px;right:14px;background:none;border:0;color:var(--slate-gray);font-size:24px;line-height:1;cursor:pointer;}' +
  '#bc-drawer .bc-hi{display:flex;align-items:center;gap:12px;padding:22px 20px 14px;cursor:pointer;}' +
  '#bc-drawer .bc-av{width:40px;height:40px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--midcurrent-navy);color:var(--paper-white);font-weight:800;}' +
  '#bc-drawer .bc-hi .s{font-size:12px;color:var(--slate-gray);}' +
  '#bc-drawer .bc-hi .n{font-size:18px;font-weight:900;color:var(--midcurrent-navy);line-height:1.1;}' +
  '#bc-drawer .bc-sec{padding:10px 20px 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--slate-gray);border-top:1px solid var(--cloud-veil);margin-top:4px;}' +
  '#bc-drawer .bc-links{flex:1;overflow-y:auto;padding:2px 0 10px;}' +
  '#bc-drawer a.bc-item{display:flex;align-items:center;gap:14px;padding:12px 20px;color:var(--midcurrent-navy);text-decoration:none;font-weight:500;position:relative;}' +
  '#bc-drawer a.bc-item:hover{background:color-mix(in srgb, var(--deep-cobalt) 8%, transparent);}' +
  '#bc-drawer a.bc-item.on{color:var(--deep-cobalt);}' +
  '#bc-drawer a.bc-item.on::before,#bc-drawer a.bc-item:hover::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:3px;background:var(--deep-cobalt);}' +
  '#bc-drawer .bc-foot{padding:14px 20px 20px;border-top:1px solid var(--cloud-veil);}' +
  '#bc-drawer a.bc-home{display:flex;align-items:center;gap:12px;color:var(--slate-gray);text-decoration:none;font-size:14px;}' +
  '#bc-drawer a.bc-home:hover{color:var(--deep-cobalt);}' +
  '#bc-theme{position:fixed;right:20px;bottom:20px;z-index:56;width:48px;height:48px;border-radius:50%;border:1px solid var(--cloud-veil);background:var(--paper-white);color:var(--midcurrent-navy);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18);}' +
  '#bc-theme:hover{border-color:var(--deep-cobalt);color:var(--deep-cobalt);}' +
  '.bc-sun{display:none;}.dark .bc-sun{display:block;}.dark .bc-moon{display:none;}';

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var curSlug = /\/category\//.test(location.pathname) ? location.pathname.split('/').pop().replace('.html', '') : '';

  function greetInner() {
    var name = getName();
    var initial = name ? name.charAt(0).toUpperCase() : 'G';
    var txt = name ? '<div><div class="s">hello,</div><div class="n">' + name + '</div></div>'
                   : '<div><div class="n">Sign in</div><div class="s">or create your account</div></div>';
    return '<div class="bc-av">' + initial + '</div>' + txt;
  }

  // Side tab (3 small dashes)
  var tab = document.createElement('button');
  tab.id = 'bc-tab'; tab.setAttribute('aria-label', 'Open menu');
  tab.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(tab);

  var scrim = document.createElement('div'); scrim.id = 'bc-scrim'; document.body.appendChild(scrim);

  var drawer = document.createElement('nav');
  drawer.id = 'bc-drawer';
  drawer.innerHTML =
    '<button class="bc-x" aria-label="Close">&times;</button>' +
    '<div class="bc-hi" id="bc-hi" title="Set your name">' + greetInner() + '</div>' +
    '<div class="bc-sec">Shop by product</div>' +
    '<div class="bc-links">' +
      CATS.map(function (c) { return '<a class="bc-item' + (c[0] === curSlug ? ' on' : '') + '" href="' + BASE + 'category/' + c[0] + '.html">' + svg(ICON[c[0]]) + '<span>' + c[1] + '</span></a>'; }).join('') +
    '</div>' +
    '<div class="bc-foot"><a class="bc-home" href="' + BASE + 'index.html">' + svg('M3 11 12 4l9 7 M5 10v10h14V10', 18) + '<span>Home</span></a></div>';
  document.body.appendChild(drawer);

  // Theme toggle (light/dark)
  var themeBtn = document.createElement('button');
  themeBtn.id = 'bc-theme'; themeBtn.setAttribute('aria-label', 'Toggle dark mode');
  themeBtn.innerHTML =
    '<span class="bc-moon">' + svg('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z', 20) + '</span>' +
    '<span class="bc-sun">' + svg('M12 4v2 M12 18v2 M4 12H2 M22 12h-2 M6 6 4.5 4.5 M19.5 19.5 18 18 M18 6l1.5-1.5 M4.5 19.5 6 18 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 20) + '</span>';
  document.body.appendChild(themeBtn);
  themeBtn.addEventListener('click', function () {
    var dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('bc-theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  function open() { drawer.classList.add('on'); scrim.classList.add('on'); }
  function close() { drawer.classList.remove('on'); scrim.classList.remove('on'); }
  tab.addEventListener('click', open);
  scrim.addEventListener('click', close);
  drawer.querySelector('.bc-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function refreshGreeting() { var el = document.getElementById('bc-hi'); if (el) el.innerHTML = greetInner(); }
  drawer.querySelector('#bc-hi').addEventListener('click', function () { openAuth(); });

  /* ============================ Auth (Sign in / Sign up) ============================ */
  /* NOTE: front-end demo only — accounts are stored in this browser (localStorage).
     For real, secure accounts across devices, connect a backend (Firebase/Supabase). */
  function accounts() { try { return JSON.parse(localStorage.getItem('bc-accounts') || '[]'); } catch (e) { return []; } }
  function saveAccounts(a) { try { localStorage.setItem('bc-accounts', JSON.stringify(a)); } catch (e) {} }
  function session() { try { return localStorage.getItem('bc-session') || ''; } catch (e) { return ''; } }
  function enc(s) { try { return btoa(unescape(encodeURIComponent(s))); } catch (e) { return s; } }
  function setUser(name, email) { try { localStorage.setItem('bc-user', name); localStorage.setItem('bc-session', email || ''); } catch (e) {} refreshGreeting(); }

  var authCss = '' +
  '#bc-auth{position:fixed;inset:0;z-index:80;display:none;}' +
  '#bc-auth.on{display:block;}' +
  '#bc-auth .av{position:absolute;inset:0;background:rgba(6,6,10,.55);backdrop-filter:blur(4px);}' +
  '#bc-auth .card{position:relative;max-width:420px;width:calc(100% - 40px);margin:9vh auto 0;background:var(--paper-white);color:var(--midcurrent-navy);border:1px solid var(--cloud-veil);border-radius:20px;padding:26px 26px 24px;box-shadow:0 40px 90px -30px rgba(0,0,0,.6);font-family:Outfit,ui-sans-serif,system-ui,sans-serif;}' +
  '#bc-auth .x{position:absolute;top:14px;right:16px;background:none;border:0;color:var(--slate-gray);font-size:24px;line-height:1;cursor:pointer;}' +
  '#bc-auth .brand{display:flex;align-items:center;gap:8px;font-weight:900;font-size:18px;letter-spacing:-.5px;margin-bottom:6px;}' +
  '#bc-auth h3{font-weight:900;font-size:22px;margin:8px 0 2px;}' +
  '#bc-auth .sub{color:var(--slate-gray);font-size:13px;margin:0 0 16px;}' +
  '#bc-auth .tabs{display:flex;gap:6px;background:var(--morning-mist);border:1px solid var(--cloud-veil);border-radius:12px;padding:4px;margin-bottom:16px;}' +
  '#bc-auth .tabs button{flex:1;border:0;background:none;padding:9px;border-radius:9px;font-weight:700;font-size:14px;color:var(--slate-gray);cursor:pointer;font-family:inherit;}' +
  '#bc-auth .tabs button.on{background:var(--paper-white);color:var(--midcurrent-navy);box-shadow:0 1px 4px rgba(0,0,0,.12);}' +
  '#bc-auth .soc{display:grid;gap:8px;margin-bottom:14px;}' +
  '#bc-auth .soc button{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border:1px solid var(--cloud-veil);background:var(--paper-white);color:var(--midcurrent-navy);border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit;}' +
  '#bc-auth .soc button:hover{border-color:var(--deep-cobalt);}' +
  '#bc-auth .or{display:flex;align-items:center;gap:10px;color:var(--slate-gray);font-size:12px;margin:6px 0 12px;}' +
  '#bc-auth .or::before,#bc-auth .or::after{content:"";height:1px;flex:1;background:var(--cloud-veil);}' +
  '#bc-auth label{display:block;font-size:12px;font-weight:600;color:var(--slate-gray);margin:10px 0 5px;}' +
  '#bc-auth input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid var(--cloud-veil);border-radius:10px;background:var(--paper-white);color:var(--midcurrent-navy);font-size:15px;font-family:inherit;}' +
  '#bc-auth input:focus{outline:none;border-color:var(--deep-cobalt);}' +
  '#bc-auth .go{width:100%;margin-top:16px;padding:13px;border:0;border-radius:10px;background:var(--midcurrent-navy);color:var(--paper-white);font-weight:800;font-size:15px;cursor:pointer;font-family:inherit;}' +
  '#bc-auth .go:hover{background:var(--twilight-slate);}' +
  '#bc-auth .msg{min-height:18px;margin-top:10px;font-size:13px;font-weight:600;}' +
  '#bc-auth .msg.err{color:#d64545;}#bc-auth .msg.ok{color:#2f9e44;}' +
  '#bc-auth .foot{margin-top:12px;font-size:12px;color:var(--slate-gray);text-align:center;}';
  var st2 = document.createElement('style'); st2.textContent = authCss; document.head.appendChild(st2);

  var logged = !!session();
  var auth = document.createElement('div');
  auth.id = 'bc-auth'; auth.setAttribute('role', 'dialog'); auth.setAttribute('aria-modal', 'true');
  auth.innerHTML =
    '<div class="av" data-x></div>' +
    '<div class="card">' +
      '<button class="x" data-x aria-label="Close">&times;</button>' +
      '<div class="brand">' + svg('M12 3 3 20h18L12 3Z', 20) + ' BASECAMP</div>' +
      '<h3 id="bc-au-title">Welcome back</h3>' +
      '<p class="sub" id="bc-au-sub">Sign in to save your picks and check out faster.</p>' +
      '<div class="tabs"><button data-tab="in" class="on">Sign in</button><button data-tab="up">Create account</button></div>' +
      '<div class="soc">' +
        '<button data-soc="Google"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1a6.2 6.2 0 0 1 0-12.4c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 2.9 14.6 2 12 2A10 10 0 1 0 22 12c0-.7-.1-1.2-.2-1.8H12z"/></svg> Continue with Google</button>' +
        '<button data-soc="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg> Continue with GitHub</button>' +
      '</div>' +
      '<div class="or">or</div>' +
      '<form id="bc-au-form" novalidate>' +
        '<div id="bc-name-wrap" hidden><label>Full name</label><input id="bc-name" type="text" autocomplete="name" placeholder="Your name"></div>' +
        '<label>Email</label><input id="bc-email" type="email" autocomplete="email" placeholder="you@example.com">' +
        '<label>Password</label><input id="bc-pass" type="password" autocomplete="current-password" placeholder="••••••••">' +
        '<button class="go" type="submit" id="bc-go">Sign in</button>' +
        '<div class="msg" id="bc-msg"></div>' +
      '</form>' +
      '<div class="foot">Front-end demo — your account is saved on this device.</div>' +
    '</div>';
  document.body.appendChild(auth);

  var mode = 'in';
  var nameWrap = auth.querySelector('#bc-name-wrap'), msg = auth.querySelector('#bc-msg');
  function setMode(m) {
    mode = m;
    auth.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === m); });
    nameWrap.hidden = m !== 'up';
    auth.querySelector('#bc-au-title').textContent = m === 'up' ? 'Create your account' : 'Welcome back';
    auth.querySelector('#bc-au-sub').textContent = m === 'up' ? 'Join Basecamp to save your picks and check out faster.' : 'Sign in to save your picks and check out faster.';
    auth.querySelector('#bc-go').textContent = m === 'up' ? 'Create account' : 'Sign in';
    auth.querySelector('#bc-pass').setAttribute('autocomplete', m === 'up' ? 'new-password' : 'current-password');
    msg.textContent = ''; msg.className = 'msg';
  }
  function openAuth() {
    if (session()) { // already logged in -> offer sign out
      if (confirm('Signed in as ' + getName() + '. Sign out?')) { try { localStorage.removeItem('bc-session'); localStorage.setItem('bc-user', ''); } catch (e) {} refreshGreeting(); }
      return;
    }
    setMode('in'); auth.classList.add('on'); setTimeout(function () { auth.querySelector('#bc-email').focus(); }, 40);
  }
  function closeAuth() { auth.classList.remove('on'); }
  window.__bcOpenAuth = openAuth;

  auth.querySelectorAll('[data-x]').forEach(function (b) { b.addEventListener('click', closeAuth); });
  auth.querySelectorAll('.tabs button').forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.tab); }); });
  auth.querySelectorAll('[data-soc]').forEach(function (b) { b.addEventListener('click', function () { msg.className = 'msg'; msg.textContent = 'Social sign-in needs a backend — use email for now.'; }); });

  auth.querySelector('#bc-au-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = auth.querySelector('#bc-email').value.trim().toLowerCase();
    var pass = auth.querySelector('#bc-pass').value;
    var name = (auth.querySelector('#bc-name').value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.className = 'msg err'; msg.textContent = 'Please enter a valid email.'; return; }
    if (pass.length < 6) { msg.className = 'msg err'; msg.textContent = 'Password must be at least 6 characters.'; return; }
    var list = accounts();
    if (mode === 'up') {
      if (!name) { msg.className = 'msg err'; msg.textContent = 'Please enter your name.'; return; }
      if (list.some(function (a) { return a.email === email; })) { msg.className = 'msg err'; msg.textContent = 'An account with this email already exists.'; return; }
      list.push({ name: name, email: email, pass: enc(pass) }); saveAccounts(list);
      setUser(name, email);
      msg.className = 'msg ok'; msg.textContent = 'Account created! Welcome, ' + name + '.';
      setTimeout(closeAuth, 900);
    } else {
      var acc = list.find(function (a) { return a.email === email && a.pass === enc(pass); });
      if (!acc) { msg.className = 'msg err'; msg.textContent = 'Wrong email or password.'; return; }
      setUser(acc.name, acc.email);
      msg.className = 'msg ok'; msg.textContent = 'Welcome back, ' + acc.name + '!';
      setTimeout(closeAuth, 700);
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAuth(); });

  // Wire any account trigger on the page (e.g. the nav account icon on the home page)
  var acctIcon = document.querySelector('a[aria-label="Account"]');
  if (acctIcon) acctIcon.addEventListener('click', function (e) { e.preventDefault(); openAuth(); });

  /* ===================== Touchpad interactions ===================== */
  // 1) Season carousel: two-finger horizontal scroll + click/drag to change season
  (function () {
    var stage = document.getElementById('cfStage');
    var next = document.getElementById('cfNext'), prev = document.getElementById('cfPrev');
    if (!stage || !next || !prev) return;
    var area = stage.closest('.cf-inner') || stage.parentElement;
    var lock = false;
    area.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) + 2) {
        e.preventDefault();
        if (lock) return; lock = true; setTimeout(function () { lock = false; }, 360);
        (e.deltaX > 0 ? next : prev).click();
      }
    }, { passive: false });
    var down = false, sx = 0, moved = false;
    stage.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; moved = false; stage.setPointerCapture && stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - sx;
      if (Math.abs(dx) > 55 && !moved) { moved = true; (dx < 0 ? next : prev).click(); }
    });
    stage.addEventListener('pointerup', function () { down = false; });
    stage.addEventListener('pointercancel', function () { down = false; });
  })();

  // 2) Zoomable product photos: pinch (two-finger) zooms the image, move pans,
  //    double-click toggles 2x. Normal two-finger scroll still scrolls the page.
  (function () {
    var frames = document.querySelectorAll('.gal .main, .fx-media .frame');
    Array.prototype.forEach.call(frames, function (f) {
      var img = f.querySelector('img'); if (!img) return;
      f.style.overflow = 'hidden'; f.style.cursor = 'zoom-in';
      img.style.transition = 'transform .12s ease-out'; img.style.willChange = 'transform';
      var scale = 1;
      function apply(ox, oy) {
        img.style.transformOrigin = (ox != null ? ox + '% ' + oy + '%' : 'center');
        img.style.transform = 'scale(' + scale + ')';
        f.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
      }
      function at(e) { var r = f.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; }
      f.addEventListener('wheel', function (e) {
        if (!e.ctrlKey) return;              // pinch gesture only; plain scroll passes through
        e.preventDefault();
        var p = at(e);
        scale = Math.min(4, Math.max(1, scale - e.deltaY * 0.012));
        apply(p[0], p[1]);
      }, { passive: false });
      f.addEventListener('mousemove', function (e) { if (scale > 1) { var p = at(e); apply(p[0], p[1]); } });
      f.addEventListener('mouseleave', function () { scale = 1; apply(); });
      f.addEventListener('dblclick', function (e) { var p = at(e); scale = scale > 1 ? 1 : 2.2; apply(p[0], p[1]); });
    });
  })();
})();
