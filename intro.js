// Intro: seqüència d'imatges del portàtil desmuntant-se, controlada per l'scroll.
(function () {
  var sec = document.getElementById('intro');
  if (!sec) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { sec.remove(); return; }

  var sticky = sec.querySelector('.intro-sticky');
  var canvas = document.getElementById('seq');
  var ctx = canvas.getContext('2d');
  var shot = sec.querySelector('.intro-screen');
  var hint = sec.querySelector('.intro-hint');
  var skip = sec.querySelector('.skip');

  var N = 120;
  var small = window.innerWidth < 900;
  var dir = small ? 'frames/m/' : 'frames/d/';
  var IW = 1280, IH = 720;               // proporció del vídeo
  var LAPTOP_W = 0.53;                   // amplada màxima del portàtil dins el fotograma
  var SCREEN = { x0: 0.298, x1: 0.702, y0: 0.19, y1: 0.6 }; // pantalla al fotograma 1

  var imgs = new Array(N), ok = new Array(N);
  function src(i) { return dir + ('00' + (i + 1)).slice(-3) + '.webp'; }
  function load(i) {
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { ok[i] = true; dirty = true; };
    im.src = src(i);
    imgs[i] = im;
  }
  load(0);
  imgs[0].addEventListener('load', function () { for (var i = 1; i < N; i++) load(i); });

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };

  var W = 0, H = 0, dpr = 1, box = { x: 0, y: 0, w: 0, h: 0 };
  function layout() {
    W = sticky.clientWidth; H = sticky.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    var cover = Math.max(W / IW, H / IH);
    var fitLaptop = (0.92 * W) / (LAPTOP_W * IW);
    var s = Math.min(cover, fitLaptop);
    box.w = IW * s; box.h = IH * s;
    box.x = (W - box.w) / 2;
    box.y = s < cover ? H * 0.46 - box.h / 2 : (H - box.h) / 2;
    shot.style.left = (box.x + SCREEN.x0 * box.w) + 'px';
    shot.style.top = (box.y + SCREEN.y0 * box.h) + 'px';
    shot.style.width = ((SCREEN.x1 - SCREEN.x0) * box.w) + 'px';
    shot.style.height = ((SCREEN.y1 - SCREEN.y0) * box.h) + 'px';
    shot.style.fontSize = ((SCREEN.x1 - SCREEN.x0) * box.w / 520 * 16) + 'px';
    dirty = true;
  }

  function nearest(i) {
    if (ok[i]) return i;
    for (var d = 1; d < N; d++) {
      if (i - d >= 0 && ok[i - d]) return i - d;
      if (i + d < N && ok[i + d]) return i + d;
    }
    return -1;
  }

  function draw(f) {
    var a = Math.floor(f), b = Math.min(N - 1, a + 1), t = f - a;
    var ia = nearest(a);
    if (ia < 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#020305';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.drawImage(imgs[ia], box.x, box.y, box.w, box.h);
    if (t > 0.02 && ok[b] && b !== ia) {
      ctx.globalAlpha = t;
      ctx.drawImage(imgs[b], box.x, box.y, box.w, box.h);
      ctx.globalAlpha = 1;
    }
    // fon les vores de la imatge amb el fons quan no omple tota la pantalla (mòbil)
    if (box.y > 1) {
      var e = box.h * 0.18, g;
      g = ctx.createLinearGradient(0, box.y, 0, box.y + e); g.addColorStop(0, '#020305'); g.addColorStop(1, 'rgba(2,3,5,0)');
      ctx.fillStyle = g; ctx.fillRect(0, box.y - 1, W, e + 1);
      g = ctx.createLinearGradient(0, box.y + box.h - e, 0, box.y + box.h); g.addColorStop(0, 'rgba(2,3,5,0)'); g.addColorStop(1, '#020305');
      ctx.fillStyle = g; ctx.fillRect(0, box.y + box.h - e, W, e + 1);
    }
  }

  function progress() {
    var r = sec.getBoundingClientRect();
    var stickTop = parseFloat(getComputedStyle(sticky).top) || 0;
    return clamp((stickTop - r.top) / Math.max(1, r.height - H), 0, 1);
  }

  var cur = 0, lastDrawn = -1, dirty = true;
  function tick() {
    requestAnimationFrame(tick);
    var r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = progress();
    var target = seg(p, 0.04, 0.86) * (N - 1);
    cur += (target - cur) * 0.2;
    if (Math.abs(target - cur) < 0.01) cur = target;
    if (dirty || Math.abs(cur - lastDrawn) > 0.005) { draw(cur); lastDrawn = cur; dirty = false; }

    var s = 1 - seg(p, 0.005, 0.045);
    shot.style.opacity = s.toFixed(3);
    if (hint) hint.style.opacity = s.toFixed(3);
    canvas.style.opacity = (1 - seg(p, 0.9, 1)).toFixed(3);
    if (skip) { var so = 1 - seg(p, 0.86, 0.96); skip.style.opacity = so.toFixed(3); skip.style.pointerEvents = so > 0.1 ? 'auto' : 'none'; }
  }

  if (skip) skip.addEventListener('click', function () {
    var h = document.getElementById('inici');
    if (h) h.scrollIntoView({ behavior: 'smooth' });
  });

  layout();
  window.addEventListener('resize', layout);
  requestAnimationFrame(tick);
})();
