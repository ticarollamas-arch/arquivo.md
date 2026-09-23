/* Basecamp side rail — shared across all pages.
   Set window.BC_BASE to '' (root pages) or '../' (pages in a subfolder) before loading. */
(function () {
  var BASE = (typeof window.BC_BASE === 'string') ? window.BC_BASE : '';
  var ICON = {
    tents:'M3 20 12 5l9 15Z M12 5v15',
    'sleeping-bags':'M7 3h7a4 4 0 0 1 4 4v14H7z M7 8h11',
    'sleeping-pads':'M3 9h18v6H3z M6 9v6 M18 9v6',
    apparel:'M6 3 3 7l3 2v12h12V9l3-2-3-4-4 2H10z',
    footwear:'M4 6h4l2 6h8a2 2 0 0 1 2 2v4H4z',
    backpacks:'M8 7V6a4 4 0 0 1 8 0v1 M6 7h12v13H6z M9 12h6',
    cooking:'M4 11h16 M6 11v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6 M9 7c0-1 .5-2 1-3 M14 7c0-1 .5-2 1-3',
    lighting:'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3 11h6a6 6 0 0 0-3-11Z',
    hydration:'M9 2h6 M10 2v3 M14 2v3 M8 8h8v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z',
    traction:'M4 7h16 M6 7v3l-2 4 M12 7v3v4 M18 7v3l2 4',
    tools:'M14 7a4 4 0 0 1-5 5l-6 6 3 3 6-6a4 4 0 0 1 5-5z'
  };
  var CATS = [
    ['tents','Tents'], ['sleeping-bags','Sleeping Bags'], ['sleeping-pads','Sleeping Pads'],
    ['apparel','Jackets & Apparel'], ['footwear','Boots & Footwear'], ['backpacks','Backpacks'],
    ['cooking','Stoves & Cooking'], ['lighting','Lighting'], ['hydration','Hydration'],
    ['traction','Traction'], ['tools','Tools']
  ];
  function svg(d, size) { size = size || 22; return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d.split(' M').map(function(p,i){return '<path d="'+(i?'M':'')+p+'"/>';}).join('') + '</svg>'; }
  function getName() { try { var n = localStorage.getItem('bc-user'); return (n === null ? 'Arthur' : n).trim(); } catch (e) { return 'Arthur'; } }

  var css = '' +
  '#bc-rail{position:fixed;top:0;left:0;height:100vh;width:68px;z-index:55;display:flex;flex-direction:column;' +
  'background:linear-gradient(180deg,#12130f 0%,#0d0d10 100%);border-right:1px solid #23241d;overflow:hidden;' +
  'transition:width .28s cubic-bezier(.2,.7,.2,1);font-family:Outfit,ui-sans-serif,system-ui,sans-serif;}' +
  '#bc-rail:hover,#bc-rail.pin{width:264px;box-shadow:24px 0 60px -30px rgba(0,0,0,.8);}' +
  '#bc-rail .bc-handle{position:absolute;top:50%;right:-1px;transform:translateY(-50%);width:6px;height:64px;border-radius:6px;background:linear-gradient(180deg,#37b24d,#f08c00);}' +
  '#bc-rail .bc-top{display:flex;align-items:center;gap:12px;padding:18px 16px 8px;color:#fff;}' +
  '#bc-rail .bc-logo{width:34px;height:34px;border-radius:10px;flex:none;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#37b24d,#f08c00);}' +
  '#bc-rail .bc-word{font-weight:900;letter-spacing:-.5px;font-size:18px;white-space:nowrap;opacity:0;transition:opacity .2s;}' +
  '#bc-rail.show .bc-word{opacity:1;}' +
  '#bc-rail .bc-hi{display:flex;align-items:center;gap:12px;margin:6px 12px 6px;padding:10px 8px;border-radius:12px;background:rgba(255,255,255,.04);cursor:pointer;}' +
  '#bc-rail .bc-av{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#37b24d,#f08c00);color:#0a0a0c;font-weight:800;}' +
  '#bc-rail .bc-hitext{white-space:nowrap;opacity:0;transition:opacity .2s;line-height:1.15;}' +
  '#bc-rail.show .bc-hitext{opacity:1;}' +
  '#bc-rail .bc-hitext .s{font-size:11px;color:#9aa0a6;}' +
  '#bc-rail .bc-hitext .n{font-size:15px;font-weight:800;color:#fff;}' +
  '#bc-rail .bc-sec{padding:8px 16px 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6f7568;white-space:nowrap;opacity:0;transition:opacity .2s;}' +
  '#bc-rail.show .bc-sec{opacity:1;}' +
  '#bc-rail .bc-links{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:12px;}' +
  '#bc-rail a.bc-item{display:flex;align-items:center;gap:14px;padding:11px 22px;color:#c8ccc2;text-decoration:none;position:relative;white-space:nowrap;}' +
  '#bc-rail a.bc-item svg{flex:none;}' +
  '#bc-rail a.bc-item .lb{opacity:0;transition:opacity .2s,transform .15s;}' +
  '#bc-rail.show a.bc-item .lb{opacity:1;}' +
  '#bc-rail a.bc-item:hover{color:#fff;}' +
  '#bc-rail a.bc-item:hover .lb{transform:translateX(3px);}' +
  '#bc-rail a.bc-item:hover::before,#bc-rail a.bc-item.on::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;border-radius:3px;background:linear-gradient(180deg,#37b24d,#f08c00);}' +
  '#bc-rail a.bc-item.on{color:#fff;}' +
  '#bc-rail .bc-foot{padding:10px 22px 18px;}' +
  '#bc-rail a.bc-home{display:flex;align-items:center;gap:14px;color:#9aa0a6;text-decoration:none;white-space:nowrap;font-size:14px;}' +
  '#bc-rail a.bc-home:hover{color:#fff;}' +
  '#bc-burger{position:fixed;top:12px;left:12px;z-index:56;width:44px;height:44px;border-radius:12px;border:1px solid #23241d;background:#101014;color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;}' +
  '@media(min-width:980px){body{padding-left:68px;}#bc-burger{display:none;}}' +
  '@media(max-width:979px){#bc-rail{width:264px;left:-280px;transition:left .3s cubic-bezier(.2,.7,.2,1);}#bc-rail.open{left:0;box-shadow:24px 0 60px -20px rgba(0,0,0,.85);}#bc-rail .bc-word,#bc-rail .bc-hitext,#bc-rail .bc-sec,#bc-rail a.bc-item .lb{opacity:1!important;}#bc-burger{display:flex;}#bc-scrim{position:fixed;inset:0;z-index:54;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s;}#bc-scrim.on{opacity:1;pointer-events:auto;}}';

  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function isCat() { return /\/category\//.test(location.pathname); }
  var curSlug = isCat() ? (location.pathname.split('/').pop().replace('.html','')) : '';

  function greetHTML() {
    var name = getName();
    var initial = name ? name.charAt(0).toUpperCase() : 'G';
    var text = name ? '<span class="s">hello,</span><br><span class="n">' + name + '</span>' : '<span class="n">Guest</span><span class="s"> · tap to sign in</span>';
    return '<div class="bc-hi" id="bc-hi" title="Set your name"><div class="bc-av">' + initial + '</div><div class="bc-hitext">' + text + '</div></div>';
  }

  var rail = document.createElement('nav');
  rail.id = 'bc-rail';
  rail.innerHTML =
    '<div class="bc-handle"></div>' +
    '<div class="bc-top"><div class="bc-logo">' + svg('M12 3 3 20h18L12 3Z', 20) + '</div><span class="bc-word">BASECAMP</span></div>' +
    greetHTML() +
    '<div class="bc-sec">Shop by product</div>' +
    '<div class="bc-links">' +
      CATS.map(function (c) {
        return '<a class="bc-item' + (c[0] === curSlug ? ' on' : '') + '" href="' + BASE + 'category/' + c[0] + '.html">' + svg(ICON[c[0]]) + '<span class="lb">' + c[1] + '</span></a>';
      }).join('') +
    '</div>' +
    '<div class="bc-foot"><a class="bc-home" href="' + BASE + 'index.html">' + svg('M3 11 12 4l9 7 M5 10v10h14V10', 20) + '<span class="lb">Home</span></a></div>';
  document.body.appendChild(rail);

  var burger = document.createElement('button');
  burger.id = 'bc-burger'; burger.setAttribute('aria-label', 'Open menu');
  burger.innerHTML = svg('M4 6h16 M4 12h16 M4 18h16', 22);
  document.body.appendChild(burger);
  var scrim = document.createElement('div'); scrim.id = 'bc-scrim'; document.body.appendChild(scrim);

  // Desktop: click to pin open; Mobile: burger toggles drawer
  rail.addEventListener('mouseenter', function () { rail.classList.add('show'); });
  rail.addEventListener('mouseleave', function () { if (!rail.classList.contains('pin')) rail.classList.remove('show'); });
  rail.querySelector('.bc-top').addEventListener('click', function () { rail.classList.toggle('pin'); rail.classList.toggle('show', rail.classList.contains('pin')); });
  function openM() { rail.classList.add('open', 'show'); scrim.classList.add('on'); }
  function closeM() { rail.classList.remove('open'); scrim.classList.remove('on'); }
  burger.addEventListener('click', openM);
  scrim.addEventListener('click', closeM);

  // Sign-in / change name
  rail.querySelector('#bc-hi').addEventListener('click', function (e) {
    e.stopPropagation();
    var cur = getName();
    var n = prompt('Enter your name (leave empty to remove the greeting):', cur);
    if (n === null) return;
    try { if (n.trim()) localStorage.setItem('bc-user', n.trim()); else localStorage.setItem('bc-user', ''); } catch (err) {}
    var holder = document.createElement('div'); holder.innerHTML = greetHTML();
    var fresh = holder.firstChild;
    rail.replaceChild(fresh, document.getElementById('bc-hi'));
    fresh.addEventListener('click', arguments.callee);
  });
})();
