import { groups, pages } from "./docs.js";

const $ = (selector) => document.querySelector(selector);
const navigation = $("#navigation");
const content = $("#content");
const toc = $("#toc");
const main = $("#main");
const searchDialog = $("#search-dialog");
const searchInput = $("#search-input");
const searchResults = $("#search-results");
const themeToggle = $("#theme-toggle");
const menuToggle = $("#menu-toggle");
let activeResult = 0;
let resultKeys = [];
let observer = null;

function routeKey() {
  const value = location.hash.replace(/^#\/?/, "").split(/[?#]/)[0];
  return pages[value] ? value : "overview";
}

function pageText(page) {
  const node = document.createElement("div");
  node.innerHTML = page.html;
  return `${page.title} ${page.nav} ${page.description} ${node.textContent ?? ""}`.toLowerCase();
}

function renderNavigation(active) {
  navigation.innerHTML = groups
    .map(
      (group) => `
        <section class="nav-group">
          <div class="nav-group-title">${group.title}</div>
          <div class="nav-group-links">
            ${group.pages
              .map(
                (key) => `<a class="nav-link${key === active ? " active" : ""}" href="#/${key}">${pages[key].nav}</a>`,
              )
              .join("")}
          </div>
        </section>`,
    )
    .join("");
}

function enhanceCodeBlocks() {
  content.querySelectorAll("pre[data-lang]").forEach((pre) => {
    if (pre.parentElement?.classList.contains("code-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "code-wrap";
    const head = document.createElement("div");
    head.className = "code-head";
    const label = document.createElement("span");
    label.textContent = pre.dataset.lang ?? "code";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(pre.textContent ?? "");
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = "Copy"), 1200);
    });
    head.append(label, button);
    pre.replaceWith(wrap);
    wrap.append(head, pre);
  });
}

function renderToc() {
  const headings = [...content.querySelectorAll("h2[id]")];
  toc.innerHTML = headings
    .map((heading) => `<a href="#${heading.id}" data-id="${heading.id}">${heading.textContent}</a>`)
    .join("");
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      toc.querySelectorAll("a").forEach((link) => link.classList.toggle("active", link.dataset.id === visible.target.id));
    },
    { rootMargin: "-90px 0px -72% 0px", threshold: 0 },
  );
  headings.forEach((heading) => observer.observe(heading));
}

function nextLinks(active) {
  const order = groups.flatMap((group) => group.pages);
  const index = order.indexOf(active);
  const previous = index > 0 ? order[index - 1] : null;
  const next = index < order.length - 1 ? order[index + 1] : null;
  if (!previous && !next) return "";
  return `<div class="next-links">
    ${previous ? `<a class="next-link" href="#/${previous}"><small>Previous</small><span>← ${pages[previous].nav}</span></a>` : "<span></span>"}
    ${next ? `<a class="next-link" href="#/${next}"><small>Next</small><span>${pages[next].nav} →</span></a>` : ""}
  </div>`;
}

function renderPage() {
  const key = routeKey();
  const page = pages[key];
  document.title = `${page.title} · Solard Docs`;
  renderNavigation(key);
  content.innerHTML = `
    <div class="eyebrow">${page.eyebrow}</div>
    <h1>${page.title}</h1>
    <p class="lede">${page.description}</p>
    ${page.html}
    ${nextLinks(key)}
  `;
  enhanceCodeBlocks();
  renderToc();
  document.body.classList.remove("menu-open");
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function search(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return Object.keys(pages).slice(0, 7);
  return Object.entries(pages)
    .map(([key, page]) => {
      const text = pageText(page);
      const score = terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
      return { key, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.key)
    .slice(0, 9);
}

function renderSearch() {
  resultKeys = search(searchInput.value);
  activeResult = Math.min(activeResult, Math.max(0, resultKeys.length - 1));
  searchResults.innerHTML = resultKeys.length
    ? resultKeys
        .map((key, index) => {
          const page = pages[key];
          return `<button class="search-result${index === activeResult ? " selected" : ""}" type="button" data-key="${key}">
            <span class="search-result-title">${page.title}</span>
            <span class="search-result-copy">${page.description}</span>
          </button>`;
        })
        .join("")
    : `<div class="search-empty">No documentation matched that search.</div>`;
  searchResults.querySelectorAll(".search-result").forEach((button) => {
    button.addEventListener("click", () => openSearchResult(button.dataset.key));
  });
}

function openSearch() {
  activeResult = 0;
  searchInput.value = "";
  renderSearch();
  searchDialog.showModal();
  requestAnimationFrame(() => searchInput.focus());
}

function openSearchResult(key) {
  if (!pages[key]) return;
  searchDialog.close();
  location.hash = `#/${key}`;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("solard-docs-theme", theme);
  const dark = theme !== "light";
  themeToggle.innerHTML = dark
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A7.8 7.8 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/></svg>`;
}

function initializeTheme() {
  const stored = localStorage.getItem("solard-docs-theme");
  const preferred = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  setTheme(stored ?? preferred);
}

function bindEvents() {
  $("#search-trigger").addEventListener("click", openSearch);
  searchInput.addEventListener("input", () => {
    activeResult = 0;
    renderSearch();
  });
  searchDialog.addEventListener("click", (event) => {
    if (event.target === searchDialog) searchDialog.close();
  });
  searchDialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") activeResult = Math.min(activeResult + 1, resultKeys.length - 1);
    else if (event.key === "ArrowUp") activeResult = Math.max(activeResult - 1, 0);
    else if (event.key === "Enter" && resultKeys[activeResult]) openSearchResult(resultKeys[activeResult]);
    else return;
    event.preventDefault();
    renderSearch();
  });
  themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
  menuToggle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
  menuToggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? "")) {
      event.preventDefault();
      openSearch();
    }
  });
  window.addEventListener("hashchange", renderPage);
}

initializeTheme();
bindEvents();
renderPage();
