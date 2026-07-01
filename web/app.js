/* Awesome MCP Servers — client-side browser. Vanilla JS, no framework. */
(() => {
  "use strict";
  const SITE = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, p = {}) => Object.assign(document.createElement(t), p);

  // Apply site config to the shell.
  document.documentElement.style.setProperty("--accent", SITE.accent || "#c96442");
  document.title = `${SITE.title} — searchable catalog`;
  for (const node of document.querySelectorAll('[data-site="title"]')) node.textContent = SITE.title;
  for (const node of document.querySelectorAll('[data-site="tagline"]')) node.textContent = SITE.tagline || "";
  for (const node of document.querySelectorAll('[data-site="repo"]')) node.href = SITE.repo;
  const sib = $('[data-site="sibling"]');
  if (sib && SITE.sibling) { sib.href = SITE.sibling.href; sib.innerHTML = `${SITE.sibling.prompt} <b>&nbsp;→</b>`; sib.title = SITE.sibling.label; }

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#theme-btn").addEventListener("click", () => {
    const order = ["auto", "light", "dark"];
    const cur = root.getAttribute("data-theme") || "auto";
    // From auto, jump to the opposite of the system preference for an obvious change.
    let next;
    if (cur === "auto") {
      const sysDark = matchMedia("(prefers-color-scheme: dark)").matches;
      next = sysDark ? "light" : "dark";
    } else {
      next = cur === "dark" ? "light" : "dark";
    }
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- State ---------- */
  const state = { q: "", category: "", sources: new Set(), runs: new Set(), langs: new Set(), sort: "category" };
  let SERVERS = [], CATEGORIES = [], fuse = null;

  const RUNS_OPTS = ["local", "remote", "local/remote"];
  const SOURCE_OPTS = ["official", "reference", "community", "archived"];

  /* ---------- URL <-> state ---------- */
  function readURL() {
    const p = new URLSearchParams(location.hash.slice(1));
    state.q = p.get("q") || "";
    state.category = p.get("cat") || "";
    state.sort = p.get("sort") || "category";
    state.sources = new Set((p.get("src") || "").split(",").filter(Boolean));
    state.runs = new Set((p.get("runs") || "").split(",").filter(Boolean));
    state.langs = new Set((p.get("lang") || "").split(",").filter(Boolean));
  }
  function writeURL() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.category) p.set("cat", state.category);
    if (state.sort !== "category") p.set("sort", state.sort);
    if (state.sources.size) p.set("src", [...state.sources].join(","));
    if (state.runs.size) p.set("runs", [...state.runs].join(","));
    if (state.langs.size) p.set("lang", [...state.langs].join(","));
    const h = p.toString();
    history.replaceState(null, "", h ? "#" + h : location.pathname + location.search);
  }

  /* ---------- Filtering ---------- */
  function base() {
    // Fuzzy search first (ordered), else all servers.
    return state.q ? fuse.search(state.q).map((r) => r.item) : SERVERS.slice();
  }
  function matches(s) {
    if (state.category && s.category !== state.category) return false;
    if (state.sources.size && !state.sources.has(s.source)) return false;
    if (state.runs.size && !(s.runs || "").split("/").some((r) => state.runs.has(r))) return false;
    if (state.langs.size && !s.languages.some((l) => state.langs.has(l))) return false;
    return true;
  }
  function current() {
    let list = base().filter(matches);
    if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
    else if (state.sort === "category" && !state.q) {
      const order = new Map(CATEGORIES.map((c, i) => [c, i]));
      list.sort((a, b) => (order.get(a.category) - order.get(b.category)) || a.name.localeCompare(b.name));
    }
    // "relevance" keeps fuse order; if no query, relevance falls back to source order already.
    return list;
  }

  /* ---------- Rendering ---------- */
  const badgeLabel = { official: "official", reference: "reference", archived: "archived" };
  function card(s) {
    const c = el("article", { className: "card" });
    const top = el("div", { className: "card-top" });
    const name = el("a", { className: "card-name", href: s.url, target: "_blank", rel: "noopener" });
    name.innerHTML = `${escapeHTML(s.name)}<span class="ext">↗</span>`;
    top.append(name);
    if (badgeLabel[s.source]) top.append(el("span", { className: `badge ${s.source}`, textContent: badgeLabel[s.source] }));
    c.append(top);
    c.append(el("p", { className: "card-desc", textContent: s.description }));

    const meta = el("div", { className: "card-meta" });
    const cat = el("span", { className: "card-cat", textContent: s.category });
    cat.title = "Filter by " + s.category;
    cat.addEventListener("click", () => { setCategory(s.category); });
    meta.append(cat);
    for (const l of s.languages) meta.append(tagPill(l, () => toggle(state.langs, l)));
    for (const r of s.runs ? s.runs.split("/") : []) meta.append(tagPill(r, () => toggle(state.runs, r)));

    const actions = el("div", { className: "card-actions" });
    actions.append(iconBtn("Copy setup snippet", copyIcon(), () => openSetup(s)));
    meta.append(actions);
    c.append(meta);
    return c;
  }
  function tagPill(text, onClick) {
    const b = el("button", { className: "tag-pill", textContent: text });
    b.addEventListener("click", onClick);
    return b;
  }
  function iconBtn(title, svg, onClick) {
    const b = el("button", { className: "icon-act", title, innerHTML: svg });
    b.addEventListener("click", onClick);
    return b;
  }
  const copyIcon = () => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>`;

  function render() {
    const grid = $("#grid");
    grid.innerHTML = "";
    const list = current();
    $("#empty").hidden = list.length > 0;

    const grouped = !state.q && state.sort === "category";
    if (grouped) {
      let last = null;
      for (const s of list) {
        if (s.category !== last) {
          last = s.category;
          const h = el("div", { className: "cat-header" });
          h.append(el("h3", { textContent: s.category }));
          const n = list.filter((x) => x.category === s.category).length;
          h.append(el("span", { className: "n", textContent: n + (n === 1 ? " server" : " servers") }));
          grid.append(h);
        }
        grid.append(card(s));
      }
    } else {
      for (const s of list) grid.append(card(s));
    }

    $("#count").textContent = `${list.length} of ${SERVERS.length} servers`;
    renderActiveFilters();
    for (const b of document.querySelectorAll("#cat-list button")) b.setAttribute("aria-current", String(b.dataset.cat === state.category));
    $("#clear-cat").hidden = !state.category;
    syncChips("#filter-source", state.sources);
    syncChips("#filter-runs", state.runs);
    syncChips("#filter-lang", state.langs);
    if ($("#search").value !== state.q) $("#search").value = state.q;
    if ($("#sort").value !== state.sort) $("#sort").value = state.sort;
    writeURL();
  }
  function syncChips(sel, set) {
    for (const c of document.querySelectorAll(`${sel} .chip`)) c.setAttribute("aria-pressed", String(set.has(c.dataset.val)));
  }
  function renderActiveFilters() {
    const wrap = $("#active-filters");
    wrap.innerHTML = "";
    const add = (label, onClear) => {
      const t = el("span", { className: "tag" });
      t.append(document.createTextNode(label));
      const x = el("button", { textContent: "×", title: "Remove" });
      x.addEventListener("click", onClear);
      t.append(x);
      wrap.append(t);
    };
    for (const v of state.sources) add(v, () => { state.sources.delete(v); render(); });
    for (const v of state.runs) add(v, () => { state.runs.delete(v); render(); });
    for (const v of state.langs) add(v, () => { state.langs.delete(v); render(); });
  }

  /* ---------- Sidebar build ---------- */
  function buildSidebar() {
    const catList = $("#cat-list");
    const counts = countBy(SERVERS, "category");
    const allBtn = catBtn("All servers", "", SERVERS.length);
    catList.append(allBtn);
    for (const c of CATEGORIES) catList.append(catBtn(c, c, counts[c] || 0));

    const langCounts = {};
    for (const s of SERVERS) for (const l of s.languages) langCounts[l] = (langCounts[l] || 0) + 1;
    const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).map(([l]) => l);

    buildChips("#filter-source", SOURCE_OPTS.filter((o) => SERVERS.some((s) => s.source === o)), state.sources);
    buildChips("#filter-runs", ["local", "remote"].filter((o) => SERVERS.some((s) => (s.runs || "").split("/").includes(o))), state.runs);
    buildChips("#filter-lang", topLangs, state.langs);
  }
  function catBtn(label, value, n) {
    const li = el("li");
    const b = el("button");
    b.dataset.cat = value;
    b.innerHTML = `<span>${escapeHTML(label)}</span><span class="n">${n}</span>`;
    b.addEventListener("click", () => setCategory(value === state.category ? "" : value));
    li.append(b);
    return li;
  }
  function buildChips(sel, opts, set) {
    const wrap = $(sel);
    wrap.innerHTML = "";
    for (const o of opts) {
      const c = el("button", { className: "chip", textContent: o });
      c.dataset.val = o;
      c.setAttribute("aria-pressed", String(set.has(o)));
      c.addEventListener("click", () => toggle(set, o));
      wrap.append(c);
    }
  }

  /* ---------- Actions ---------- */
  function setCategory(c) { state.category = c; render(); document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" }); }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); render(); }

  let searchTimer;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const v = e.target.value;
    searchTimer = setTimeout(() => { state.q = v.trim(); if (state.q && state.sort === "category") state.sort = "relevance"; render(); }, 90);
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#clear-cat").addEventListener("click", () => setCategory(""));
  $("#reset-empty").addEventListener("click", resetAll);
  $("#random-btn").addEventListener("click", () => {
    const list = current(); if (!list.length) return;
    const s = list[Math.floor(Math.random() * list.length)];
    openSetup(s);
  });
  $("#filter-toggle").addEventListener("click", (e) => {
    const open = $("#sidebar").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
  });
  $("#install-btn").addEventListener("click", openInstallGuide);
  $("#embed-btn").addEventListener("click", openEmbed);

  function resetAll() {
    state.q = ""; state.category = ""; state.sources.clear(); state.runs.clear(); state.langs.clear(); state.sort = "category";
    $("#search").value = "";
    render();
  }

  // Keyboard: "/" focuses search, Esc clears/closes.
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); $("#search").focus(); }
    else if (e.key === "Escape") {
      if ($(".modal-backdrop")) closeModal();
      else if (document.activeElement === $("#search") && state.q) { state.q = ""; $("#search").value = ""; render(); }
    }
  });

  /* ---------- Modals ---------- */
  function openModal(html) {
    closeModal();
    const back = el("div", { className: "modal-backdrop" });
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    back.addEventListener("click", (e) => { if (e.target === back) closeModal(); });
    $("#modal-root").append(back);
    const x = back.querySelector(".x"); if (x) x.addEventListener("click", closeModal);
    back.querySelectorAll(".copy").forEach((btn) => btn.addEventListener("click", () => copy(btn.dataset.copy, btn)));
  }
  function closeModal() { const b = $(".modal-backdrop"); if (b) b.remove(); }

  function codeBlock(code, title) {
    return `${title ? `<h3>${title}</h3>` : ""}<div class="code"><button class="copy" data-copy="${escapeAttr(code)}">Copy</button><pre>${escapeHTML(code)}</pre></div>`;
  }
  function openSetup(s) {
    const snippet = SITE.snippet ? SITE.snippet(s) : `# see ${s.url}`;
    openModal(`
      <div class="modal-head"><div><h2>${escapeHTML(s.name)}</h2><p class="sub">${escapeHTML(s.category)} · ${s.languages.join(", ") || "—"}${s.runs ? " · " + s.runs : ""}</p></div><button class="x" aria-label="Close">×</button></div>
      <p class="sub">${escapeHTML(s.description)}</p>
      ${codeBlock(snippet, `Add to ${SITE.client}`)}
      <p class="note">Placeholders (<code>&lt;command&gt;</code> / <code>&lt;server-url&gt;</code>) come from the server's own README.</p>
      <p style="margin-top:14px"><a class="btn primary" href="${s.url}" target="_blank" rel="noopener">Open repository ↗</a></p>
    `);
  }
  function openInstallGuide() {
    const isCodex = SITE.client === "Codex";
    const body = isCodex ? `
      ${codeBlock(`# ~/.codex/config.toml — local (stdio)\n[mcp_servers.NAME]\ncommand = "npx"\nargs = ["-y", "<package>"]`, "Codex CLI / IDE")}
      ${codeBlock(`# ~/.codex/config.toml — remote (streamable HTTP)\n[mcp_servers.NAME]\nurl = "<server-url>"\nbearer_token_env_var = "TOKEN_ENV"`, "Remote servers")}
      <p class="note">Slow first launch? Raise <code>startup_timeout_sec</code>. Remote not connecting? Enable <code>[features] rmcp_client = true</code>.</p>`
      : `
      ${codeBlock(`# Claude Code — local (stdio)\nclaude mcp add NAME -- npx -y <package>`, "Claude Code (CLI)")}
      ${codeBlock(`# Claude Code — remote (HTTP)\nclaude mcp add --transport http NAME <server-url>`, "Remote servers")}
      ${codeBlock(`{\n  "mcpServers": {\n    "NAME": { "command": "npx", "args": ["-y", "<package>"] }\n  }\n}`, "Claude Desktop (claude_desktop_config.json)")}`;
    openModal(`
      <div class="modal-head"><div><h2>How to install</h2><p class="sub">Adding MCP servers to ${escapeHTML(SITE.client)}</p></div><button class="x" aria-label="Close">×</button></div>
      ${body}
      <p style="margin-top:14px"><a class="btn primary" data-site="repo" href="${SITE.repo}#getting-started-with-${isCodex ? "codex" : "claude"}" target="_blank" rel="noopener">Full guide in the README ↗</a></p>
    `);
  }
  function openEmbed() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.category) p.set("cat", state.category);
    if (state.sources.size) p.set("src", [...state.sources].join(","));
    if (state.runs.size) p.set("runs", [...state.runs].join(","));
    if (state.langs.size) p.set("lang", [...state.langs].join(","));
    const url = new URL("embed.html", location.href);
    url.search = p.toString();
    const iframe = `<iframe src="${url.href}" width="100%" height="520" style="border:1px solid #e5e5e5;border-radius:12px" loading="lazy" title="${escapeAttr(SITE.title)}"></iframe>`;
    const badge = `[![${SITE.title}](${SITE.badge})](${SITE.repo})`;
    openModal(`
      <div class="modal-head"><div><h2>Embed &amp; share</h2><p class="sub">This reflects your current search and filters</p></div><button class="x" aria-label="Close">×</button></div>
      ${codeBlock(iframe, "Embeddable widget (iframe)")}
      ${codeBlock(location.href, "Shareable link to this view")}
      ${codeBlock(badge, "Badge (Markdown)")}
    `);
  }

  /* ---------- Utils ---------- */
  function countBy(arr, key) { const o = {}; for (const x of arr) o[x[key]] = (o[x[key]] || 0) + 1; return o; }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function escapeAttr(s) { return escapeHTML(s).replace(/\n/g, "&#10;"); }
  function copy(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) { const t = btn.textContent; btn.textContent = "Copied"; setTimeout(() => (btn.textContent = t), 1200); }
      toast("Copied to clipboard");
    });
  }
  let toastTimer;
  function toast(msg) {
    let t = $(".toast"); if (!t) { t = el("div", { className: "toast" }); document.body.append(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }

  /* ---------- Boot ---------- */
  fetch("servers.json")
    .then((r) => r.json())
    .then((data) => {
      SERVERS = data.servers;
      CATEGORIES = data.categories;
      fuse = new Fuse(SERVERS, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "description", weight: 0.3 },
          { name: "category", weight: 0.12 },
          { name: "languages", weight: 0.04 },
          { name: "source", weight: 0.04 },
        ],
        threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2,
      });
      readURL();
      if (state.q && state.sort === "category") state.sort = "relevance";
      buildSidebar();
      $("#stats").innerHTML = `<b>${SERVERS.length}</b> servers · <b>${CATEGORIES.length}</b> categories · ${SERVERS.filter((s) => s.source === "official").length} official`;
      render();
    })
    .catch((err) => { $("#grid").innerHTML = `<p class="empty">Could not load the catalog. ${escapeHTML(String(err))}</p>`; });
})();
