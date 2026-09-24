const rnd = (a, b) => a + Math.random() * (b - a);
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';

function ensureMeltFilter() {
  if (document.getElementById('melt')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = `<filter id="melt">
    <feTurbulence id="meltNoise" type="fractalNoise" baseFrequency="0.002 0.35" numOctaves="1" seed="2" result="n"/>
    <feDisplacementMap id="meltMap" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/>
  </filter>`;
  document.body.append(svg);
}

export function createGlitches({ phone, thread, sleep }) {
  async function frames(cls, pattern) {
    try {
      for (const [on, ms] of pattern) {
        phone.classList.toggle(cls, on);
        await sleep(ms);
      }
    } finally {
      phone.classList.remove(cls);
    }
  }

  function overlay(className) {
    const el = document.createElement('div');
    el.className = className;
    phone.append(el);
    return el;
  }

  async function flicker() {
    const scan = overlay('glitch-scan');
    try {
      await frames('glitch-flash', [[true, 60], [false, 50], [true, 90], [false, 40], [true, 50], [false, 0]]);
    } finally {
      scan.remove();
    }
  }

  async function slices(ms = 900) {
    const n = 7;
    const top = thread.offsetTop;
    const height = thread.clientHeight;
    const layers = [];
    for (let i = 0; i < n; i++) {
      const s = overlay('glitch-slice');
      s.style.top = `${top}px`;
      s.style.height = `${height}px`;
      const clone = thread.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('aria-live');
      clone.setAttribute('aria-hidden', 'true');
      s.append(clone);
      clone.scrollTop = thread.scrollTop;
      layers.push(s);
    }
    thread.style.visibility = 'hidden';
    try {
      const end = performance.now() + ms;
      while (performance.now() < end) {
        let y = 0;
        layers.forEach((s, i) => {
          const h = i === n - 1 ? 100 - y : rnd(4, 26);
          s.style.clipPath = `inset(${y}% 0 ${Math.max(0, 100 - y - h)}% 0)`;
          s.style.transform = Math.random() < 0.55 ? `translateX(${rnd(-40, 40)}px)` : 'none';
          s.style.filter = Math.random() < 0.25 ? 'hue-rotate(120deg) saturate(2)' : 'none';
          y += h;
        });
        await sleep(rnd(50, 110));
      }
    } finally {
      layers.forEach((s) => s.remove());
      thread.style.visibility = '';
    }
  }

  function rgb() {
    return frames('glitch-rgb', [[true, 80], [false, 40], [true, 140], [false, 60], [true, 60], [false, 30], [true, 200], [false, 0]]);
  }

  function startNoise() {
    const c = document.createElement('canvas');
    c.className = 'glitch-noise';
    c.width = 120;
    c.height = 220;
    phone.append(c);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(c.width, c.height);
    let running = true;
    (function draw() {
      if (!running) return;
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(draw);
    })();
    return () => { running = false; c.remove(); };
  }

  async function blackout(onDark) {
    const black = overlay('glitch-blackout');
    const label = document.createElement('div');
    label.className = 'glitch-label glass';
    label.textContent = 'NO SIGNAL';
    let stop = startNoise();
    try {
      await sleep(220);
      stop();
      onDark?.();
      phone.append(label);
      await sleep(500);
      label.remove();
      stop = startNoise();
      await sleep(120);
    } finally {
      stop();
      label.remove();
      black.remove();
    }
    await flicker();
  }

  async function melt(ms = 370) {
    ensureMeltFilter();
    const map = document.getElementById('meltMap');
    const noise = document.getElementById('meltNoise');
    phone.classList.add('glitch-melt');
    try {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        const p = (performance.now() - t0) / ms;
        map.setAttribute('scale', String(Math.sin(p * Math.PI) * 120));
        noise.setAttribute('seed', String(Math.floor(rnd(1, 99))));
        await sleep(30);
      }
    } finally {
      map.setAttribute('scale', '0');
      phone.classList.remove('glitch-melt');
    }
  }

  async function scramble(el, to, ms = 700) {
    const t0 = performance.now();
    try {
      while (performance.now() - t0 < ms) {
        const p = (performance.now() - t0) / ms;
        el.textContent = [...to].map((ch, i) => (i / to.length < p ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])).join('');
        await sleep(40);
      }
    } finally {
      el.textContent = to;
    }
  }

  async function hack(onDark) {
    await flicker();
    await slices(600);
    await blackout(onDark);
  }

  return { flicker, slices, rgb, blackout, melt, scramble, hack };
}
