/* ============================================================
   soumya.dev PORTFOLIO — main.js
   Sections: Custom Cursor · Marquee Builder · Scroll Reveal
             Active Nav Highlight · Contact Parallax
   ============================================================ */

/* ----- CUSTOM CURSOR ----- */
const cur  = document.getElementById('cur');
const ring = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .card-arrow').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width  = '6px';
    cur.style.height = '6px';
    ring.style.width  = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'rgba(255,95,21,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width  = '10px';
    cur.style.height = '10px';
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(255,95,21,0.5)';
  });
});

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
const items = [...techs, ...techs].map(t => {
  const d = document.createElement('div');
  d.className = 'tech-item';
  const iconHTML = t.icon
    ? `<i class="${t.icon} tech-icon"></i>`
    : `<div class="tech-dot"></div>`;
  d.innerHTML = `${iconHTML}<span class="tech-name">${t.name}</span>`;
  return d;
});
items.forEach(i => track.appendChild(i));

/* ----- SCROLL REVEAL ----- */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(r => obs.observe(r));

/* ----- NAV CONTACT BUTTON ----- */
const navCta = document.querySelector('.nav-cta');
navCta && navCta.addEventListener('click', () => {
  const contact = document.getElementById('contact');
  contact && contact.scrollIntoView({ behavior: 'smooth' });
});

/* ----- ACTIVE NAV HIGHLIGHT ----- */
const sections  = document.querySelectorAll('section[id]');
const sideLinks = document.querySelectorAll('.side-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  sideLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

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

contactSection && contactSection.addEventListener('mousemove', e => {
  const rect = contactSection.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  - 0.5;
  const y = (e.clientY - rect.top)  / rect.height - 0.5;
  ch.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
});

contactSection && contactSection.addEventListener('mouseleave', () => {
  ch.style.transform = 'translate(0, 0)';
});

/* ----- HERO NEURAL NETWORK CANVAS ----- */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const ORANGE      = '#FF5F15';
  const LAYERS      = [3, 5, 5, 2];
  const LAYER_LABELS = ['INPUT', 'HIDDEN', 'HIDDEN', 'OUTPUT'];
  let nodes = [], conns = [], W, H;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
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
          alpha:    0.05 + Math.random() * 0.07
        });
      }));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* connections */
    conns.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.from.x, c.from.y);
      ctx.lineTo(c.to.x,   c.to.y);
      ctx.strokeStyle = `rgba(255,95,21,${c.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (c.active) {
        c.progress += c.speed;
        if (c.progress > 1) {
          c.to.pulse = 1;
          c.progress = -0.05;
          c.active   = Math.random() > 0.15;
        }
        if (c.progress >= 0) {
          const px = c.from.x + (c.to.x - c.from.x) * c.progress;
          const py = c.from.y + (c.to.y - c.from.y) * c.progress;
          const g  = ctx.createRadialGradient(px, py, 0, px, py, 12);
          g.addColorStop(0, 'rgba(255,95,21,0.7)');
          g.addColorStop(1, 'rgba(255,95,21,0)');
          ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = ORANGE; ctx.fill();
        }
      } else if (Math.random() > 0.997) { c.active = true; }
    });

    /* nodes */
    nodes.forEach(n => {
      n.glow += 0.022;
      const g   = (Math.sin(n.glow) + 1) / 2;
      const edge = n.layer === 0 || n.layer === LAYERS.length - 1;
      const r    = edge ? 6 : 5;

      /* pulse ring */
      if (n.pulse > 0) {
        const pr = (1 - n.pulse) * 28;
        ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,95,21,${n.pulse * 0.55})`;
        ctx.lineWidth = 1.2; ctx.stroke();
        n.pulse -= 0.035;
        if (n.pulse < 0) n.pulse = 0;
      }

      /* ambient glow */
      const ag = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 24);
      ag.addColorStop(0, `rgba(255,95,21,${(edge ? 0.28 : 0.12) * g})`);
      ag.addColorStop(1, 'rgba(255,95,21,0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = ag; ctx.fill();

      /* fill */
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = edge ? ORANGE : `rgba(255,255,255,${0.25 + g * 0.55})`;
      ctx.fill();

      /* border */
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,95,21,${0.4 + g * 0.6})`;
      ctx.lineWidth = 1; ctx.stroke();
    });

    /* layer labels */
    ctx.font = '700 10px "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    const padX = W * 0.12, uw = W - padX * 2;
    LAYER_LABELS.forEach((lbl, li) => {
      const x = padX + (li / (LAYERS.length - 1)) * uw;
      ctx.fillStyle = (li === 0 || li === LAYERS.length - 1)
        ? 'rgba(255,95,21,0.65)'
        : 'rgba(255,255,255,0.2)';
      ctx.fillText(lbl, x, H - 18);
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
