// Intro 3D: portàtil obert que es desmunta peça a peça amb l'scroll.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const section = document.getElementById('intro');
const canvas = document.getElementById('laptop');
const sticky = section ? section.querySelector('.intro-sticky') : null;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function gone() {
  if (section) section.remove();
  window.dispatchEvent(new Event('intro:gone'));
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer = null;
if (section && !reduce) {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { renderer = null; }
}
if (!renderer) gone(); else build();

function build() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9a8cf0, 2.4); rim.position.set(-5, 2.5, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x6fd3c4, 0.7); fill.position.set(5, 1, -3); scene.add(fill);

  // ---------- materials ----------
  const M = {
    alu: new THREE.MeshStandardMaterial({ color: 0x3a3e4a, metalness: 0.9, roughness: 0.32 }),
    key: new THREE.MeshStandardMaterial({ color: 0x16171d, metalness: 0.2, roughness: 0.55 }),
    black: new THREE.MeshStandardMaterial({ color: 0x0c0d11, metalness: 0.3, roughness: 0.5 }),
    silver: new THREE.MeshStandardMaterial({ color: 0xd5d9e2, metalness: 1, roughness: 0.22 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xc27a45, metalness: 1, roughness: 0.28 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x101114, metalness: 0.4, roughness: 0.45 }),
    green: new THREE.MeshStandardMaterial({ color: 0x14402c, metalness: 0.3, roughness: 0.6 }),
    pad: new THREE.MeshStandardMaterial({ color: 0x2c303a, metalness: 0.6, roughness: 0.25 }),
    battery: new THREE.MeshStandardMaterial({ color: 0x1b1d24, metalness: 0.5, roughness: 0.45 }),
    sticker: new THREE.MeshStandardMaterial({ color: 0x9a8cf0, metalness: 0.1, roughness: 0.6 }),
    glow: new THREE.MeshBasicMaterial({ color: 0x5546c4 })
  };

  // ---------- textures ----------
  function pcbTexture() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 356;
    const g = c.getContext('2d');
    g.fillStyle = '#0d3a2a'; g.fillRect(0, 0, c.width, c.height);
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.lineWidth = 2;
    for (let i = 0; i < 150; i++) {
      let x = rnd() * c.width, y = rnd() * c.height;
      g.strokeStyle = 'rgba(210,180,100,.5)';
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 3; k++) { if (rnd() < 0.5) x += (rnd() - 0.5) * 260; else y += (rnd() - 0.5) * 160; g.lineTo(x, y); }
      g.stroke();
      g.fillStyle = 'rgba(225,195,115,.85)'; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill();
    }
    for (let i = 0; i < 40; i++) { g.fillStyle = '#0a0b0e'; g.fillRect(rnd() * c.width, rnd() * c.height, 10 + rnd() * 30, 6 + rnd() * 16); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }

  const sc = document.createElement('canvas'); sc.width = 800; sc.height = 500;
  const sg = sc.getContext('2d');
  const screenTex = new THREE.CanvasTexture(sc); screenTex.colorSpace = THREE.SRGBColorSpace;
  function drawScreen(time) {
    const w = sc.width, h = sc.height;
    const gr = sg.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#0b0d14'); gr.addColorStop(1, '#1d1450');
    sg.fillStyle = gr; sg.fillRect(0, 0, w, h);
    sg.fillStyle = 'rgba(255,255,255,.06)'; sg.fillRect(0, 0, w, 34);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { sg.fillStyle = c; sg.beginPath(); sg.arc(22 + i * 20, 17, 6, 0, 7); sg.fill(); });
    sg.textAlign = 'left';
    sg.fillStyle = '#9aa1ba'; sg.font = '500 15px "JetBrains Mono", ui-monospace, monospace'; sg.fillText('eidan@smx: ~/portfolio', 90, 22);
    const cmd = '$ ./portfolio --start';
    sg.fillStyle = '#6fd3c4'; sg.font = '500 22px "JetBrains Mono", ui-monospace, monospace'; sg.fillText(cmd, 30, 84);
    if (Math.floor(time * 2) % 2 === 0) sg.fillRect(36 + sg.measureText(cmd).width, 66, 12, 22);
    sg.textAlign = 'center';
    sg.fillStyle = '#eef0f8'; sg.font = '800 118px "Plus Jakarta Sans", system-ui, sans-serif';
    sg.fillText('SCROLL', w / 2, h / 2 + 34);
    const y = h / 2 + 82 + Math.sin(time * 3.2) * 12;
    sg.strokeStyle = '#9a8cf0'; sg.lineWidth = 10; sg.lineCap = 'round'; sg.lineJoin = 'round';
    for (let k = 0; k < 2; k++) {
      const yy = y + k * 32; sg.globalAlpha = k ? 0.4 : 1;
      sg.beginPath(); sg.moveTo(w / 2 - 32, yy); sg.lineTo(w / 2, yy + 28); sg.lineTo(w / 2 + 32, yy); sg.stroke();
    }
    sg.globalAlpha = 1;
    screenTex.needsUpdate = true;
  }

  // ---------- helpers ----------
  const rbox = (w, h, d, r, m, s = 3) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, s, r), m);
  const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const root = new THREE.Group(); scene.add(root);
  const parts = [];
  function part(o, parent, rest, exp, a, b, rr = null, er = null) {
    o.position.set(...rest);
    if (rr) o.rotation.set(...rr);
    parent.add(o);
    parts.push({
      o, parent, a, b, ph: parts.length * 1.7,
      rest: new THREE.Vector3(...rest), exp: new THREE.Vector3(...exp),
      rr: rr ? rr.slice() : null, er: er ? er.slice() : null
    });
    return o;
  }

  // ---------- carcassa inferior ----------
  const bottom = new THREE.Group();
  bottom.add(rbox(3.2, 0.07, 2.2, 0.03, M.alu));
  for (const [x, z] of [[-1.4, -0.9], [1.4, -0.9], [-1.4, 0.9], [1.4, 0.9]]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 20), M.black); f.position.set(x, -0.04, z); bottom.add(f);
  }
  part(bottom, root, [0, 0.035, 0], [0, -1.85, 0], 0.12, 0.5);

  // ---------- bateria ----------
  const battery = new THREE.Group();
  battery.add(rbox(2.3, 0.045, 0.78, 0.015, M.battery));
  const st = box(0.8, 0.004, 0.36, M.sticker); st.position.y = 0.024; battery.add(st);
  part(battery, root, [0, 0.095, 0.55], [0, -1.18, 0.55], 0.14, 0.52);

  // ---------- placa base ----------
  const board = new THREE.Group();
  board.add(new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.016, 1.0), new THREE.MeshStandardMaterial({ map: pcbTexture(), metalness: 0.3, roughness: 0.6 })));
  part(board, root, [0, 0.087, -0.45], [0, -0.48, -0.45], 0.16, 0.54);

  const cpu = new THREE.Group();
  cpu.add(box(0.46, 0.012, 0.46, M.green));
  const ihs = box(0.34, 0.03, 0.34, M.silver); ihs.position.y = 0.02; cpu.add(ihs);
  part(cpu, board, [-0.15, 0.014, 0], [-0.15, 0.6, 0.05], 0.3, 0.62);

  function ramStick() {
    const g = new THREE.Group();
    g.add(box(0.72, 0.01, 0.3, M.green));
    for (let i = 0; i < 4; i++) { const c = box(0.12, 0.012, 0.09, M.chip); c.position.set(-0.24 + i * 0.16, 0.011, 0); g.add(c); }
    return g;
  }
  const ram1 = ramStick(), ram2 = ramStick();
  part(ram1, board, [0.92, 0.02, -0.12], [1.3, 0.62, -0.12], 0.32, 0.64, [0, 0, 0], [0, 0, 0.22]);
  part(ram2, board, [0.92, 0.05, -0.12], [1.42, 0.92, -0.12], 0.34, 0.66, [0, 0, 0], [0, 0, 0.22]);

  const ssd = new THREE.Group();
  ssd.add(box(0.8, 0.008, 0.22, M.chip));
  const s1 = box(0.22, 0.01, 0.16, M.silver); s1.position.set(-0.15, 0.008, 0); ssd.add(s1);
  const s2 = box(0.18, 0.01, 0.16, M.chip); s2.position.set(0.18, 0.008, 0); ssd.add(s2);
  part(ssd, board, [0.35, 0.014, 0.33], [0.5, 0.42, 0.62], 0.33, 0.64);

  const fan = new THREE.Group();
  fan.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 40, 1, true), M.black));
  const fb = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), M.black); fb.rotation.x = -Math.PI / 2; fb.position.y = -0.03; fan.add(fb);
  const blades = new THREE.Group();
  blades.add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 24), M.silver));
  for (let i = 0; i < 9; i++) {
    const b = box(0.2, 0.008, 0.06, M.alu); b.position.x = 0.15; const piv = new THREE.Group(); piv.rotation.y = (i / 9) * Math.PI * 2; b.rotation.x = 0.35; piv.add(b); blades.add(piv);
  }
  fan.add(blades);
  part(fan, board, [-1.05, 0.04, -0.05], [-1.3, 0.62, -0.05], 0.31, 0.63);

  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.045, 0), new THREE.Vector3(-0.45, 0.06, -0.08), new THREE.Vector3(-0.8, 0.06, -0.08), new THREE.Vector3(-1.05, 0.08, -0.05)
  ]);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 40, 0.025, 10, false), M.copper);
  part(pipe, board, [0, 0, 0], [0, 0.98, 0], 0.34, 0.66);

  // ---------- carcassa superior + teclat ----------
  const top = new THREE.Group();
  top.add(rbox(3.2, 0.05, 2.2, 0.02, M.alu));
  const pad = box(1.1, 0.004, 0.7, M.pad); pad.position.set(0, 0.026, 0.62); top.add(pad);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.95, 1.22), M.glow); glow.rotation.x = -Math.PI / 2; glow.position.set(0, 0.0265, -0.47); top.add(glow);
  part(top, root, [0, 0.165, 0], [0, 1.05, 0], 0.18, 0.54);

  const K = [];
  const pitch = 2.9 / 14;
  let rs = 11; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
  for (let r = 0; r < 6; r++) {
    const z = -1.0 + r * 0.19;
    const d = r === 0 ? 0.11 : 0.16;
    const addKey = (x, w) => {
      const a = 0.2 + ((x + 1.5) / 3) * 0.12 + rnd() * 0.04;
      K.push({ x, z, w, d, a, b: a + 0.2, up: 0.42 + rnd() * 0.45, rx: (rnd() - 0.5) * 0.9, rz: (rnd() - 0.5) * 0.9 });
    };
    for (let c = 0; c < 14; c++) {
      if (r === 5 && c >= 4 && c <= 9) { if (c === 4) addKey(-1.45 + pitch * 7, pitch * 6 - 0.035); continue; }
      addKey(-1.45 + pitch * (c + 0.5), pitch - 0.035);
    }
  }
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.028, 1), M.key, K.length);
  top.add(keys);
  const dummy = new THREE.Object3D();

  // ---------- pantalla (tapa) ----------
  const lid = new THREE.Group();
  const shell = rbox(3.2, 0.045, 2.15, 0.02, M.alu); shell.position.set(0, 0.0225, 1.075); lid.add(shell);
  part(lid, root, [0, 0.19, -1.1], [0, 1.45, -1.6], 0.15, 0.52, [-1.78, 0, 0], [-1.62, 0, 0]);

  const panel = new THREE.Group();
  const bezel = box(3.1, 0.012, 2.08, M.black); bezel.position.set(0, -0.006, 1.075); panel.add(bezel);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(2.86, 1.79), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  display.rotation.x = Math.PI / 2; display.position.set(0, -0.0125, 1.06); panel.add(display);
  part(panel, lid, [0, 0, 0], [0, -0.55, 0], 0.2, 0.56);

  // ---------- etiquetes ----------
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const labelDefs = {
    screen: [panel, V(1.45, -0.02, 1.75)],
    keys: [top, V(1.6, 0.06, -0.55)],
    cpu: [cpu, V(0, 0.05, 0)],
    ram: [ram2, V(0.36, 0.01, 0)],
    ssd: [ssd, V(0.4, 0, 0)],
    fan: [fan, V(-0.42, 0.04, 0.1)],
    board: [board, V(1.45, 0, 0.5)],
    bat: [battery, V(1.15, 0, 0)],
    bottom: [bottom, V(1.6, 0, 0.6)]
  };
  const labels = [...section.querySelectorAll('.lbl')].map(el => ({ el, def: labelDefs[el.dataset.part] })).filter(l => l.def);
  const chapters = [...section.querySelectorAll('.chap')].map(el => ({ el, a: +el.dataset.a, b: +el.dataset.b }));
  const hint = section.querySelector('.intro-hint');
  const skip = section.querySelector('.skip');

  // ---------- mida ----------
  let W = 1, H = 1;
  function resize() {
    W = sticky.clientWidth; H = sticky.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---------- bucle ----------
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3(), camPos = new THREE.Vector3(), look = new THREE.Vector3(), dir = new THREE.Vector3();
  let p = 0, lastDraw = -1, raf = 0, running = false;

  function progress() {
    const r = section.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    const target = progress();
    p += (target - p) * 0.14; if (Math.abs(target - p) < 1e-4) p = target;

    const ex = ease(seg(p, 0.1, 0.56));
    const out = ease(seg(p, 0.82, 1));

    for (const q of parts) {
      const k = ease(seg(p, q.a, q.b));
      q.o.position.lerpVectors(q.rest, q.exp, k);
      if (q.parent === root && out > 0) q.o.position.multiplyScalar(1 + out * 0.6);
      if (q.rr) q.o.rotation.set(lerp(q.rr[0], q.er[0], k), lerp(q.rr[1], q.er[1], k), lerp(q.rr[2], q.er[2], k));
      q.o.position.y += Math.sin(t * 1.3 + q.ph) * 0.025 * ex;
    }
    for (let i = 0; i < K.length; i++) {
      const c = K[i]; const k = ease(seg(p, c.a, c.b));
      dummy.position.set(c.x, 0.039 + c.up * k, c.z);
      dummy.rotation.set(c.rx * k, 0, c.rz * k);
      dummy.scale.set(c.w, 1, c.d);
      dummy.updateMatrix(); keys.setMatrixAt(i, dummy.matrix);
    }
    keys.instanceMatrix.needsUpdate = true;
    blades.rotation.y = t * 5;

    root.rotation.y = -0.3 * ex + Math.sin(t * 0.4) * 0.035 + out * 0.45;
    root.position.y = Math.sin(t * 0.9) * 0.03 * (1 - ex);

    const aspect = W / H;
    const fit = Math.pow(Math.max(1, 1.1 / aspect), 0.9);
    look.set(0, lerp(0.8, 0.95, ex), 0);
    camPos.set(lerp(0.0, 4.2, ex), lerp(1.75, 3.3, ex), lerp(7.2, 11.6, ex));
    dir.subVectors(camPos, look).multiplyScalar(fit * (1 - out * 0.35));
    camera.position.copy(look).add(dir);
    camera.lookAt(look);
    // aparta el portàtil del text dels capítols (dreta en pantalles amples, amunt en mòbil)
    const sh = ease(seg(p, 0.08, 0.2)) * (1 - ease(seg(p, 0.86, 0.96)));
    if (aspect > 1.1) camera.setViewOffset(W, H, -0.17 * W * sh, 0, W, H);
    else camera.setViewOffset(W, H, 0, 0.13 * H * sh, W, H);

    if (p < 0.4 && t - lastDraw > 1 / 30) { drawScreen(t); lastDraw = t; }

    canvas.style.opacity = String(1 - seg(p, 0.86, 0.97));

    const la = seg(p, 0.44, 0.52) * (1 - seg(p, 0.8, 0.86));
    for (const l of labels) {
      if (la <= 0.001) { l.el.style.opacity = '0'; continue; }
      const [obj, off] = l.def;
      tmp.copy(off); obj.localToWorld(tmp); tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H;
      l.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      l.el.style.opacity = tmp.z < 1 ? la.toFixed(3) : '0';
    }
    for (const c of chapters) {
      const o = seg(p, c.a, c.a + 0.04) * (1 - seg(p, c.b - 0.04, c.b));
      c.el.style.opacity = o.toFixed(3);
      c.el.style.transform = `translateY(${((1 - o) * 24).toFixed(1)}px)`;
    }
    if (hint) hint.style.opacity = String(1 - seg(p, 0.015, 0.06));
    if (skip) { const so = 1 - seg(p, 0.85, 0.95); skip.style.opacity = String(so); skip.style.pointerEvents = so > 0.1 ? 'auto' : 'none'; }

    renderer.render(scene, camera);
  }

  function start() { if (!running) { running = true; clock.start(); frame(); } }
  function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }
  new IntersectionObserver(es => { es.forEach(e => (e.isIntersecting ? start() : stop())); }).observe(section);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (section.getBoundingClientRect().bottom > 0) start(); });

  drawScreen(0);
  section.classList.add('ready');
}
