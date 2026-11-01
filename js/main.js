/* ============================================================
   soumya.dev PORTFOLIO — main.js
   Cool-minimal monochrome reskin.
   Sections: Loading Screen · Touch Detection · Viewport Fix
             Hamburger Nav · Marquee Builder · Scroll Reveal
             Nav Contact · Contact Parallax · Hero Neural Canvas
   ============================================================ */

/* ----- LOADING SCREEN ----- */
(function () {
  const overlay   = document.getElementById('loadingScreen');
  const counterEl = document.getElementById('loadingCounter');
  const barEl     = document.getElementById('loadingBar');
  const wordEl    = document.getElementById('loadingWord');
  if (!overlay || !counterEl || !barEl || !wordEl) return;

  document.body.style.overflow = 'hidden';

  const WORDS    = ['Design', 'Create', 'Inspire'];
  const DURATION = 2200;
  const WORD_MS  = 900;
  let count      = 0;
  let wordIdx    = 0;
  let started    = false;
  let startTime  = null;
  let lastWordCycle = 0;
  let animatingWord = false;

  function cycleWord() {
    if (animatingWord) return;
    animatingWord = true;
    wordEl.classList.add('word-exit');
    wordEl.addEventListener('animationend', function handler() {
      wordEl.removeEventListener('animationend', handler);
      wordIdx = (wordIdx + 1) % WORDS.length;
      wordEl.textContent = WORDS[wordIdx];
      wordEl.classList.remove('word-exit');
      void wordEl.offsetWidth;
      animatingWord = false;
    }, { once: true });
  }

  function tick(ts) {
    if (!started) {
      started = true;
      startTime = ts;
    }

    const elapsed = ts - startTime;
    const raw = Math.min(elapsed / DURATION, 1);
    count = Math.floor(raw * 100);

    counterEl.textContent = String(count).padStart(3, '0');
    barEl.style.transform = 'scaleX(' + (count / 100) + ')';

    if (Math.floor(elapsed / WORD_MS) > lastWordCycle) {
      lastWordCycle = Math.floor(elapsed / WORD_MS);
      if (lastWordCycle < 4) cycleWord();
    }

    if (count >= 100) {
      counterEl.textContent = '100';
      barEl.style.transform = 'scaleX(1)';

      setTimeout(function () {
        overlay.classList.add('loading-exit');

        let finished = false;
        function finish() {
          if (finished) return;
          finished = true;
          overlay.removeEventListener('animationend', finish);
          overlay.style.display = 'none';
          document.body.style.overflow = '';
          if (typeof window.onPortfolioLoaded === 'function') {
            window.onPortfolioLoaded();
          }
        }

        /* The exit animation is disabled under prefers-reduced-motion, so
           animationend never fires — the timeout guarantees the overlay lifts. */
        overlay.addEventListener('animationend', finish);
        setTimeout(finish, 1000);
      }, 400);

      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

/* ----- TOUCH DEVICE DETECTION ----- */
const isTouchDevice = ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0);

if (isTouchDevice) {
  document.documentElement.classList.add('touch');
}

/* ----- REDUCED MOTION PREF ----- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- HAMBURGER MOBILE NAV ----- */
(function () {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  if (!nav || !navLinks) return;

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(hamburger);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();

/* ----- TECH STACK MARQUEE ----- */
const techs = [
  /* ML / AI */
  { name: 'Python',       icon: 'devicon-python-plain'       },
  { name: 'Pandas',       icon: 'devicon-pandas-plain'       },
  { name: 'NumPy',        icon: 'devicon-numpy-plain'        },
  { name: 'TensorFlow',   icon: 'devicon-tensorflow-plain'   },
  { name: 'Scikit-Learn', icon: 'devicon-scikitlearn-plain'  },
  { name: 'Matplotlib',   icon: null                         },
  { name: 'Plotly',       icon: null                         },
  { name: 'LangChain',    icon: null                         },
  { name: 'GenAI',        icon: null                         },
  { name: 'NLP',          icon: null                         },
  /* Web Stack */
  { name: 'HTML',         icon: 'devicon-html5-plain'        },
  { name: 'CSS',          icon: 'devicon-css3-plain'         },
  { name: 'JavaScript',   icon: 'devicon-javascript-plain'   },
  { name: 'Tailwind',     icon: 'devicon-tailwindcss-plain'  },
  { name: 'FastAPI',      icon: 'devicon-fastapi-plain'      },
  { name: 'Firebase',     icon: 'devicon-firebase-plain'     },
  { name: 'Supabase',     icon: 'devicon-supabase-plain'     },
  { name: 'PostgreSQL',   icon: 'devicon-postgresql-plain'   },
  { name: 'MongoDB',      icon: 'devicon-mongodb-plain'      },
  { name: 'Render',       icon: null                         },
  { name: 'Git',          icon: 'devicon-git-plain'          },
];

const track = document.getElementById('marquee');
if (track) {
  const frag = document.createDocumentFragment();
  [...techs, ...techs].forEach(t => {
    const item = document.createElement('div');
    item.className = 'tech-item';
    const iconHTML = t.icon
      ? `<i class="${t.icon} tech-icon"></i>`
      : `<div class="tech-dot"></div>`;
    item.innerHTML = `${iconHTML}<span class="tech-name">${t.name}</span>`;
    frag.appendChild(item);

    const sep = document.createElement('span');
    sep.className = 'tech-sep';
    sep.textContent = '—';
    frag.appendChild(sep);
  });
  track.appendChild(frag);
}

/* ----- SCROLL REVEAL ----- */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(r => obs.observe(r));

/* ----- SOCIAL LINKS — prevent page jump from # ----- */
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', e => {
    if (link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

/* ----- CONTACT HEADING PARALLAX ----- */
const ch             = document.querySelector('.contact-heading');
const contactSection = document.getElementById('contact');

if (!reduceMotion && ch && contactSection) {
  contactSection.addEventListener('mousemove', e => {
    const rect = contactSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    ch.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
  });

  contactSection.addEventListener('mouseleave', () => {
    ch.style.transform = 'translate(0, 0)';
  });
}

/* ----- HERO NEURAL NETWORK CANVAS ----- */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ink is read from CSS so the diagram inverts with the theme */
  let INK_RGB        = '10,10,11';
  const LAYERS      = [3, 5, 5, 2];
  const LAYER_LABELS = ['INPUT', 'HIDDEN', 'HIDDEN', 'OUTPUT'];
  let nodes = [], conns = [], W, H;

  function readInk() {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--hero-ink-rgb').trim();
    if (v) INK_RGB = v;
  }

  function ink(a) {
    return a === undefined ? 'rgb(' + INK_RGB + ')' : 'rgba(' + INK_RGB + ',' + a + ')';
  }

  function resize() {
    readInk();
    const dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNetwork();
    buildConns();
  }

  function buildNetwork() {
    nodes = [];
    const padX = W * 0.12, padY = H * 0.18;
    const uw = W - padX * 2, uh = H - padY * 2;
    LAYERS.forEach((count, li) => {
      const x = padX + (li / (LAYERS.length - 1)) * uw;
      for (let ni = 0; ni < count; ni++) {
        const y = padY + ((ni + 1) / (count + 1)) * uh;
        nodes.push({ x, y, layer: li, glow: Math.random() * Math.PI * 2, pulse: 0 });
      }
    });
  }

  function buildConns() {
    conns = [];
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const from = nodes.filter(n => n.layer === li);
      const to   = nodes.filter(n => n.layer === li + 1);
      from.forEach(f => to.forEach(t => {
        conns.push({
          from: f, to: t,
          progress: -Math.random(),
          speed:    0.004 + Math.random() * 0.004,
          active:   Math.random() > 0.45,
          alpha:    0.45
        });
      }));
    }
  }

  let heroVisible = true;

  function draw() {
    /* keep the loop alive but skip the work while the hero is off-screen */
    if (!reduceMotion) requestAnimationFrame(draw);
    if (!heroVisible) return;

    ctx.clearRect(0, 0, W, H);

    /* connections */
    conns.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.from.x, c.from.y);
      ctx.lineTo(c.to.x,   c.to.y);
      ctx.strokeStyle = ink(c.alpha);
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reduceMotion && c.active) {
        c.progress += c.speed;
        if (c.progress > 1) {
          c.to.pulse = 1;
          c.progress = -0.05;
          c.active   = Math.random() > 0.15;
        }
        if (c.progress >= 0) {
          const px = c.from.x + (c.to.x - c.from.x) * c.progress;
          const py = c.from.y + (c.to.y - c.from.y) * c.progress;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = ink(0.9); ctx.fill();
        }
      } else if (!reduceMotion && Math.random() > 0.997) { c.active = true; }
    });

    /* nodes */
    nodes.forEach(n => {
      if (!reduceMotion) n.glow += 0.022;
      const g    = (Math.sin(n.glow) + 1) / 2;
      const edge = n.layer === 0 || n.layer === LAYERS.length - 1;
      const r    = edge ? 6 : 5.5;

      /* pulse ring */
      if (n.pulse > 0) {
        const pr = (1 - n.pulse) * 28;
        ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = ink(n.pulse * 0.35);
        ctx.lineWidth = 1; ctx.stroke();
        n.pulse -= 0.035;
        if (n.pulse < 0) n.pulse = 0;
      }

      /* fill — edge layers solid ink, hidden layers open circles */
      if (edge) {
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = ink(); ctx.fill();
      }

      /* border */
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = ink(reduceMotion ? 1 : 0.85 + g * 0.15);
      ctx.lineWidth = 1.2; ctx.stroke();
    });

    /* layer labels */
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const padX = W * 0.12, uw = W - padX * 2;
    /* the layer labels only fit on a wide canvas */
    if (W >= 640) {
      LAYER_LABELS.forEach((lbl, li) => {
        const x = padX + (li / (LAYERS.length - 1)) * uw;
        ctx.fillStyle = ink((li === 0 || li === LAYERS.length - 1) ? 0.65 : 0.45);
        ctx.fillText(lbl, x, H - 18);
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  /* stop redrawing once the hero scrolls out of view */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[entries.length - 1].isIntersecting;
    }, { threshold: 0 }).observe(canvas);
  }

  /* re-read ink when the theme toggles (the rAF loop picks it up otherwise) */
  document.addEventListener('themechange', function () {
    readInk();
    if (reduceMotion) draw();
  });
})();

/* ----- NAV SCROLLSPY SLIDER ----- */
(function () {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const indicator = navLinks.querySelector('.nav-indicator');
  const links = Array.from(navLinks.querySelectorAll('a[data-section]'));
  if (!indicator || !links.length) return;

  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
  ) || 64;

  const targets = links.map(link => ({
    link,
    section: document.getElementById(link.getAttribute('data-section'))
  }));

  let current = null;
  let queued  = false;

  function place(link) {
    const pad = 14;
    indicator.style.width     = (link.offsetWidth + pad * 2) + 'px';
    indicator.style.transform = 'translate(' + (link.offsetLeft - pad) + 'px, -50%)';
    indicator.style.opacity   = '1';
  }

  function setActive(link) {
    if (link === current) return;
    current = link;
    links.forEach(l => l.classList.toggle('active', l === link));
    place(link);
  }

  function update() {
    queued = false;
    const probe = window.scrollY + navH + 12;
    const atEnd = window.innerHeight + window.scrollY >=
                  document.documentElement.scrollHeight - 2;

    let active = targets[0].link;
    if (atEnd) {
      active = targets[targets.length - 1].link;
    } else {
      targets.forEach(t => {
        if (t.section && t.section.offsetTop <= probe) active = t.link;
      });
    }
    setActive(active);
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { current = null; update(); });
  window.addEventListener('load', () => setTimeout(() => { current = null; update(); }, 80));

  links.forEach(link => link.addEventListener('click', () => setActive(link)));

  update();
})();

/* ----- THEME TOGGLE ----- */
(function () {
  const root = document.documentElement;
  const btn  = document.querySelector('.theme-toggle');
  if (!btn) return;

  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function store(t) {
    try { localStorage.setItem('theme', t); } catch (e) { }
  }

  function apply(theme, animate) {
    if (animate) {
      root.classList.add('theme-anim');
      window.setTimeout(function () { root.classList.remove('theme-anim'); }, 340);
    }

    root.setAttribute('data-theme', theme);

    const dark  = theme === 'dark';
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A0A0B' : '#FFFFFF');

    document.dispatchEvent(new CustomEvent('themechange'));
  }

  btn.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store(next);
    apply(next, true);
  });

  /* follow the OS only while the visitor has not chosen a theme themselves */
  function onSchemeChange(e) {
    if (!stored()) apply(e.matches ? 'dark' : 'light', true);
  }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
    else if (mq.addListener) mq.addListener(onSchemeChange);
  }

  /* sync the button with whatever the head script already applied */
  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
})();
