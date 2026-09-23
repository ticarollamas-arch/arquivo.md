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
  '#bc-tab{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:55;width:32px;height:54px;border:1px solid var(--cloud-veil);border-left:0;border-radius:0 12px 12px 0;background:var(--paper-white);color:var(--midcurrent-navy);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;box-shadow:3px 0 14px rgba(0,0,0,.12);transition:transform .2s,background .2s;}' +
  '#bc-tab:hover{transform:translateY(-50%) translateX(2px);}' +
  '#bc-tab span{display:block;width:15px;height:2px;border-radius:2px;background:currentColor;}' +
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
                   : '<div><div class="n">Welcome</div><div class="s">tap to add your name</div></div>';
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

  drawer.querySelector('#bc-hi').addEventListener('click', function () {
    var n = prompt('Enter your name (leave empty to remove the greeting):', getName());
    if (n === null) return;
    try { localStorage.setItem('bc-user', n.trim()); } catch (e) {}
    document.getElementById('bc-hi').innerHTML = greetInner();
  });
})();
