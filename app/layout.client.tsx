import { docEntries, type DocEntry } from "./docs-data";

let activeResult = 0;
let currentResults: DocEntry[] = [];
let headingObserver: IntersectionObserver | null = null;

function searchDocs(query: string): DocEntry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return docEntries.slice(0, 7);
  return docEntries
    .map((entry) => {
      const haystack = [
        entry.title,
        entry.section,
        entry.description,
        ...entry.keywords,
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 1 : 0),
        0,
      );
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry)
    .slice(0, 9);
}

function renderSearch(query: string) {
  const root = document.getElementById("search-results");
  if (!root) return;
  currentResults = searchDocs(query);
  activeResult = Math.min(activeResult, Math.max(0, currentResults.length - 1));
  root.replaceChildren();

  if (!currentResults.length) {
    const empty = document.createElement("div");
    empty.className = "search-empty";
    empty.textContent = "No documentation matched that search.";
    root.append(empty);
    return;
  }

  currentResults.forEach((entry, index) => {
    const link = document.createElement("a");
    link.className = `search-result${index === activeResult ? " selected" : ""}`;
    link.href = entry.href;

    const meta = document.createElement("span");
    meta.className = "search-result-meta";
    meta.textContent = entry.section;

    const title = document.createElement("span");
    title.className = "search-result-title";
    title.textContent = entry.title;

    const copy = document.createElement("span");
    copy.className = "search-result-copy";
    copy.textContent = entry.description;

    link.append(meta, title, copy);
    root.append(link);
  });
}

function openActiveSearchResult(dialog: HTMLDialogElement | null) {
  const entry = currentResults[activeResult];
  if (!entry) return;
  dialog?.close();
  window.location.assign(entry.href);
}

function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("solard-docs-theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) button.textContent = theme === "light" ? "☾" : "☀";
}

function buildToc() {
  const root = document.getElementById("toc");
  const article = document.querySelector(".doc");
  if (!root || !article) return;
  const headings = [...article.querySelectorAll<HTMLHeadingElement>("h2[id]")];
  root.replaceChildren();

  headings.forEach((heading) => {
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.dataset.id = heading.id;
    link.textContent = heading.textContent ?? "";
    root.append(link);
  });

  headingObserver?.disconnect();
  headingObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      root.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        link.classList.toggle("active", link.dataset.id === visible.target.id);
      });
    },
    { rootMargin: "-90px 0px -72% 0px", threshold: 0 },
  );
  headings.forEach((heading) => headingObserver?.observe(heading));
}

function markActiveNavigation() {
  const current = location.pathname.replace(/\/$/, "") || "/";
  document
    .querySelectorAll<HTMLAnchorElement>("[data-doc-link]")
    .forEach((link) => {
      const href = (link.dataset.docLink ?? "/").replace(/\/$/, "") || "/";
      link.classList.toggle("active", href === current);
    });
}

function bindCopyButtons() {
  document
    .querySelectorAll<HTMLButtonElement>("[data-copy-code]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const code =
          button.closest(".code-wrap")?.querySelector("code")?.textContent ??
          "";
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      });
    });
}

export default function mount() {
  const searchDialog = document.getElementById(
    "search-dialog",
  ) as HTMLDialogElement | null;
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement | null;
  const searchTrigger = document.getElementById("search-trigger");
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const pageTitle = document.querySelector(".doc h1")?.textContent;
  if (pageTitle) document.title = `${pageTitle} · Solard Docs`;

  const stored = localStorage.getItem("solard-docs-theme");
  const preferred = matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  setTheme(stored === "light" || stored === "dark" ? stored : preferred);
  markActiveNavigation();
  buildToc();
  bindCopyButtons();
  if (menuToggle) menuToggle.textContent = "☰";

  const openSearch = () => {
    if (!searchDialog || !searchInput) return;
    activeResult = 0;
    searchInput.value = "";
    renderSearch("");
    searchDialog.showModal();
    requestAnimationFrame(() => searchInput.focus());
  };

  const onSearchInput = () => {
    activeResult = 0;
    renderSearch(searchInput?.value ?? "");
  };

  const onDialogClick = (event: Event) => {
    if (event.target === searchDialog) searchDialog?.close();
  };

  const onDialogKeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      activeResult = Math.min(
        activeResult + 1,
        Math.max(0, currentResults.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      activeResult = Math.max(activeResult - 1, 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      openActiveSearchResult(searchDialog);
      return;
    } else {
      return;
    }
    event.preventDefault();
    renderSearch(searchInput?.value ?? "");
  };

  const onThemeClick = () => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "dark" : "light",
    );
  };

  const onMenuClick = () => {
    document.body.classList.toggle("menu-open");
  };

  const onGlobalKeydown = (event: KeyboardEvent) => {
    const tag = document.activeElement?.tagName ?? "";
    if (
      event.key === "/" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !/INPUT|TEXTAREA/.test(tag)
    ) {
      event.preventDefault();
      openSearch();
    }
  };

  searchTrigger?.addEventListener("click", openSearch);
  searchInput?.addEventListener("input", onSearchInput);
  searchDialog?.addEventListener("click", onDialogClick);
  searchDialog?.addEventListener("keydown", onDialogKeydown);
  themeToggle?.addEventListener("click", onThemeClick);
  menuToggle?.addEventListener("click", onMenuClick);
  document.addEventListener("keydown", onGlobalKeydown);

  return () => {
    headingObserver?.disconnect();
    headingObserver = null;
    searchTrigger?.removeEventListener("click", openSearch);
    searchInput?.removeEventListener("input", onSearchInput);
    searchDialog?.removeEventListener("click", onDialogClick);
    searchDialog?.removeEventListener("keydown", onDialogKeydown);
    themeToggle?.removeEventListener("click", onThemeClick);
    menuToggle?.removeEventListener("click", onMenuClick);
    document.removeEventListener("keydown", onGlobalKeydown);
  };
}
