/* ============================================================
   soumya.dev — "Ask about Soumya" assistant.

   Retrieval only. A question is matched against window.SOUMYA_KB
   and the matching entry's `answer` is returned verbatim. There is
   no generation step, so the assistant cannot invent facts — its
   worst case is "I don't know that".

   Matching runs in two layers:
     1. exact phrase hit on one of an entry's `q` phrasings
     2. BM25 keyword ranking, gated on content-term coverage
   An optional sentence-embedding pass (Transformers.js, loaded
   lazily from a CDN) upgrades paraphrase matching. Everything works
   without it — it is an enhancement, never a dependency.
   ============================================================ */
(() => {
  'use strict';

  const KB = window.SOUMYA_KB;
  if (!KB || !Array.isArray(KB.entries) || !KB.entries.length) return;

  const CONFIG = {
    /* Set false for a strictly zero-download widget (keyword matching only). */
    useEmbeddings: true,
    embedLibrary: 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5',
    embedModel: 'Xenova/all-MiniLM-L6-v2',

    /* A keyword answer needs at least this share of the question's meaningful
       words to match, or a semantic score at least this high. */
    minCoverage: 0.5,
    minCosine: 0.45,

    /* If the top two entries are this close, offer both instead of guessing. */
    ambiguityMargin: 0.12,

    maxMessages: 30,
    maxInputLength: 300,
    replyDelay: 220,
  };

  /* ---------------------------------------------------------------
     Text handling
     --------------------------------------------------------------- */

  const STOPWORDS = new Set([
    'a', 'about', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'can', 'could', 'did',
    'do', 'does', 'for', 'from', 'get', 'give', 'has', 'have', 'he', 'her', 'his', 'how', 'i',
    'in', 'is', 'it', 'its', 'just', 'know', 'like', 'me', 'much', 'my', 'of', 'on', 'or',
    'our', 'out', 'please', 'she', 'should', 'so', 'some', 'tell', 'than', 'that', 'the',
    'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'to', 'up', 'us', 'was',
    'we', 'were', 'what', 'whats', 'when', 'where', 'which', 'who', 'why', 'will', 'with',
    'would', 'you', 'your', 'yours',
  ]);

  /* Lowercase, strip punctuation, collapse whitespace. Used for phrase matching. */
  const normalize = (text) =>
    String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  /* Keeps `+ # . -` inside words so c++, next.js and ci/cd survive tokenising. */
  function tokenize(text) {
    return normalize(String(text).replace(/\//g, ' '))
      .split(' ')
      .map((t) => t.replace(/^[.\-+#]+|[.\-+#]+$/g, ''))
      .filter((t) => t.length > 1 && !STOPWORDS.has(t));
  }

  /* "what do you do" -> "What do you do?" */
  function chipLabel(entry) {
    const phrase = (entry.q && entry.q[0]) || entry.id.replace(/-/g, ' ');
    const cleaned = phrase.replace(/\bi\b/g, 'I').replace(/\bsoumya\b/g, 'Soumya');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + '?';
  }

  /* ---------------------------------------------------------------
     Guardrails
     --------------------------------------------------------------- */

  /* Narrow: only clear prompt-injection / abuse attempts. Deliberately has no
     topical patterns, so genuine questions like "who is Soumya" still work —
     off-topic questions are rejected by the score gate instead. */
  const INJECTION = [
    /\bignore\s+(all\s+|any\s+)?(previous|prior|above|earlier)\s+(instruction|prompt|rule)/i,
    /\b(disregard|forget)\s+(your\s+)?(instruction|prompt|rule)/i,
    /\b(system|initial|hidden)\s+prompt\b/i,
    /\byou\s+are\s+now\b/i,
    /\bpretend\s+(to\s+be|you\s+are)\b/i,
    /\b(jailbreak|dan\s+mode)\b/i,
    /\bact\s+as\s+(a|an)\b/i,
  ];

  const isInjection = (text) => INJECTION.some((re) => re.test(text));

  /* ---------------------------------------------------------------
     Index + BM25
     --------------------------------------------------------------- */

  const docs = KB.entries.map((entry) => {
    const text = [...(entry.q || []), ...(entry.keywords || []), ...(entry.tags || [])].join(' ');
    const tokens = tokenize(text);
    const tf = Object.create(null);
    tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
    return { entry, tf, len: tokens.length || 1 };
  });

  const df = Object.create(null);
  docs.forEach((d) => Object.keys(d.tf).forEach((t) => { df[t] = (df[t] || 0) + 1; }));

  const N = docs.length;
  const avgLen = docs.reduce((sum, d) => sum + d.len, 0) / N || 1;
  const idf = (t) => Math.log(1 + (N - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5));

  const byId = new Map(KB.entries.map((e) => [e.id, e]));

  const PHRASES = docs.map((d) => ({
    doc: d,
    phrases: (d.entry.q || []).map(normalize).filter((p) => p.length > 3),
  }));

  function bm25(doc, terms) {
    const k1 = 1.2;
    const b = 0.75;
    let score = 0;
    const matched = new Set();
    terms.forEach((t) => {
      const f = doc.tf[t];
      if (!f) return;
      matched.add(t);
      score += idf(t) * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.len) / avgLen)));
    });
    return { score, matched };
  }

  /* ---------------------------------------------------------------
     Optional embeddings (progressive enhancement)
     --------------------------------------------------------------- */

  let embedder = null;
  let docVectors = null;

  const CACHE_KEY = `soumya_kb_embeddings_v${KB.version || 1}`;

  async function embed(texts) {
    const out = await embedder(texts, { pooling: 'mean', normalize: true });
    return out.tolist();
  }

  function cosine(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot; /* vectors are already normalised */
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length === docs.length ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(vectors) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(vectors)); } catch (e) { /* quota — fine */ }
  }

  async function loadEmbeddings() {
    if (!CONFIG.useEmbeddings || embedder) return;
    try {
      const mod = await import(CONFIG.embedLibrary);
      try {
        embedder = await mod.pipeline('feature-extraction', CONFIG.embedModel, { dtype: 'q8' });
      } catch (e) {
        embedder = await mod.pipeline('feature-extraction', CONFIG.embedModel);
      }

      const cached = readCache();
      if (cached) { docVectors = cached; return; }

      const texts = docs.map((d) =>
        [...(d.entry.q || []), ...(d.entry.keywords || [])].join(' '));
      docVectors = await embed(texts);
      writeCache(docVectors);
    } catch (e) {
      /* Offline, blocked, or unsupported — keyword matching carries on. */
      embedder = null;
      docVectors = null;
    }
  }

  /* ---------------------------------------------------------------
     Matching
     --------------------------------------------------------------- */

  function phraseHit(normalized) {
    const padded = ` ${normalized} `;
    for (const group of PHRASES) {
      for (const phrase of group.phrases) {
        if (padded.includes(` ${phrase} `)) return group.doc.entry;
      }
    }
    return null;
  }

  async function findAnswer(rawQuestion) {
    const question = normalize(rawQuestion).slice(0, CONFIG.maxInputLength);

    if (isInjection(question)) {
      return { kind: 'refused', reason: 'injection' };
    }

    /* 1 — exact phrasing */
    const exact = phraseHit(question);
    if (exact) return { kind: 'answer', entry: exact };

    /* 2 — keyword ranking */
    const terms = tokenize(question);
    if (!terms.length) return { kind: 'refused', reason: 'nokeywords' };

    const scored = docs
      .map((d) => {
        const { score, matched } = bm25(d, terms);
        return { doc: d, score, matched, coverage: matched.size / terms.length };
      })
      .sort((a, b) => b.score - a.score);

    const best = scored[0];

    /* 3 — optional semantic pass */
    let semantic = 0;
    if (embedder && docVectors) {
      try {
        const [qv] = await embed([question]);
        let bestIdx = -1;
        for (let i = 0; i < docVectors.length; i++) {
          const sim = cosine(qv, docVectors[i]);
          if (sim > semantic) { semantic = sim; bestIdx = i; }
        }
        if (bestIdx >= 0 && semantic > (best.coverage || 0)) {
          best.doc = docs[bestIdx];
          best.coverage = semantic;
          best.semantic = semantic;
        }
      } catch (e) { /* ignore — keyword result stands */ }
    }

    const accepted =
      (best && best.coverage >= CONFIG.minCoverage) ||
      (semantic && semantic >= CONFIG.minCosine);

    if (!accepted) return { kind: 'refused', reason: 'outofscope' };

    /* ambiguous between two entries -> ask which one */
    const second = scored[1];
    if (
      second &&
      best.coverage < CONFIG.minCosine &&
      second.score > 0 &&
      best.score - second.score < best.score * CONFIG.ambiguityMargin
    ) {
      return { kind: 'ambiguous', a: best.doc.entry, b: second.doc.entry };
    }

    return { kind: 'answer', entry: best.doc.entry };
  }

  /* ---------------------------------------------------------------
     Widget
     --------------------------------------------------------------- */

  const EMAIL = 'soumyadeeppal4211@gmail.com';
  const REFUSAL =
    `I only answer questions about Soumya's work — that one is outside what I know. ` +
    `Try one of these, or email ${EMAIL}.`;
  const CAP_REPLY = `That's about as much as I can help with in one session. Email ${EMAIL} and I'll take it from there.`;

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const launcher = el('button', 'assist-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'assistPanel');
  launcher.setAttribute('aria-label', 'Ask about Soumya');
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.9 8.9 0 0 1-3.4-.7L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5Z"/>' +
    '<circle cx="8.5" cy="11.5" r=".9" fill="currentColor" stroke="none"/>' +
    '<circle cx="12.5" cy="11.5" r=".9" fill="currentColor" stroke="none"/>' +
    '<circle cx="16.5" cy="11.5" r=".9" fill="currentColor" stroke="none"/></svg>';

  const panel = el('div', 'assist-panel');
  panel.id = 'assistPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Ask about Soumya');
  panel.setAttribute('aria-modal', 'false');

  const head = el('div', 'assist-head');
  const headText = el('div', 'assist-head-text');
  headText.appendChild(el('div', 'assist-title', 'Ask about Soumya'));
  headText.appendChild(el('div', 'assist-sub', 'Answers come from this site — nothing invented'));
  const closeBtn = el('button', 'assist-close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
    '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
  head.append(headText, closeBtn);

  const log = el('div', 'assist-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-relevant', 'additions');

  const chips = el('div', 'assist-chips');

  const form = el('form', 'assist-form');
  const input = el('input', 'assist-input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.placeholder = 'Ask about my work…';
  input.setAttribute('aria-label', 'Your question');
  input.maxLength = CONFIG.maxInputLength;
  const send = el('button', 'assist-send', '→');
  send.type = 'submit';
  send.setAttribute('aria-label', 'Send');
  form.append(input, send);

  panel.append(head, log, chips, form);
  document.body.append(launcher, panel);

  /* ---- rendering ---- */

  function addMessage(who, text) {
    const row = el('div', `assist-msg assist-msg-${who}`);
    row.appendChild(el('div', 'assist-bubble', text));
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function renderChips(ids) {
    chips.textContent = '';
    (ids || [])
      .map((id) => byId.get(id))
      .filter(Boolean)
      .slice(0, 5)
      .forEach((entry) => {
        const chip = el('button', 'assist-chip', chipLabel(entry));
        chip.type = 'button';
        chip.addEventListener('click', () => ask(chipLabel(entry)));
        chips.appendChild(chip);
      });
  }

  /* ---- conversation ---- */

  let sent = 0;
  let busy = false;

  async function ask(question) {
    const text = String(question).trim().slice(0, CONFIG.maxInputLength);
    if (!text || busy) return;

    if (sent >= CONFIG.maxMessages) {
      addMessage('bot', CAP_REPLY);
      input.disabled = true;
      send.disabled = true;
      renderChips(['contact']);
      return;
    }
    sent++;
    busy = true;

    addMessage('user', text);
    input.value = '';
    chips.textContent = '';

    const thinking = addMessage('bot', '…');

    const result = await findAnswer(text);

    await new Promise((r) => setTimeout(r, CONFIG.replyDelay));
    thinking.remove();

    busy = false;

    if (result.kind === 'answer') {
      addMessage('bot', result.entry.answer);
      renderChips(result.entry.related);
      return;
    }

    if (result.kind === 'ambiguous') {
      addMessage('bot', `Did you mean ${result.a.q[0]} or ${result.b.q[0]}?`);
      renderChips([result.a.id, result.b.id]);
      return;
    }

    addMessage('bot', REFUSAL);
    renderChips(KB.starters);
  }

  /* ---- open / close ---- */

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    panel.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!log.childElementCount) {
      addMessage(
        'bot',
        `Hi — I answer questions about Soumya's work, projects and stack. Pick one below or type your own.`
      );
      renderChips(KB.starters);
    }
    input.focus();
    if (CONFIG.useEmbeddings) loadEmbeddings();
  }

  function close() {
    panel.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    else launcher.focus();
  }

  launcher.addEventListener('click', () =>
    panel.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', close);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      e.preventDefault();
      close();
    }
  });

  /* keep Tab inside the panel while it is open */
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = panel.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
