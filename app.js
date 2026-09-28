const root = document.documentElement;
const storedTheme = localStorage.getItem("solard-docs-theme");
if (storedTheme) root.dataset.theme = storedTheme;

const toast = document.getElementById("toast");
let toastTimer;
function showToast(message = "Copied") {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  showToast();
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy || ""));
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (target) copyText(target.innerText);
  });
});

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("solard-docs-theme", next);
});

document.querySelectorAll(".terminal-tabs .tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".terminal-tabs .tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".terminal-card .tab-panel").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab)?.classList.add("active");
  });
});

document.querySelectorAll("[data-install]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-install]").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".install-panel").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(`install-${button.dataset.install}`)?.classList.add("active");
  });
});

const search = document.getElementById("commandSearch");
const groups = [...document.querySelectorAll(".command-group")];
const empty = document.getElementById("emptySearch");
search?.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  let visibleRows = 0;
  groups.forEach((group) => {
    let groupVisible = 0;
    group.querySelectorAll(".command-row").forEach((row) => {
      const text = `${row.dataset.search || ""} ${row.innerText}`.toLowerCase();
      const show = !query || text.includes(query);
      row.classList.toggle("hidden", !show);
      if (show) { groupVisible++; visibleRows++; }
    });
    group.classList.toggle("hidden", groupVisible === 0);
  });
  empty?.classList.toggle("visible", visibleRows === 0);
});

const sections = [...document.querySelectorAll(".docs-content [id]")]
  .filter((el) => ["quickstart","principles","sdk","cli","architecture","environment"].includes(el.id));
const sideLinks = [...document.querySelectorAll(".side-link")];
const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  sideLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
}, { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] });
sections.forEach((section) => observer.observe(section));
