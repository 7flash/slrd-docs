import { docGroups } from "./docs-data";

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Solard documentation for the SDK, CLI, trading engine, event history, and Meteora automation."
        />
        <meta name="theme-color" content="#0a0d12" />
        <title>Solard Docs</title>
      </head>
      <body>
        <div className="noise" />
        <header className="topbar">
          <a className="brand" href="/" aria-label="Solard docs home">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span className="brand-text">Solard</span>
            <span className="brand-tag">docs</span>
          </a>
          <div className="topbar-actions">
            <button
              className="search-trigger"
              id="search-trigger"
              type="button"
              aria-label="Search documentation"
            >
              <span>Search docs</span>
              <kbd>/</kbd>
            </button>
            <button
              className="icon-button"
              id="theme-toggle"
              type="button"
              aria-label="Toggle color theme"
            />
            <button
              className="icon-button mobile-only"
              id="menu-toggle"
              type="button"
              aria-label="Open navigation"
            />
          </div>
        </header>
        <div className="app-shell">
          <aside
            className="sidebar"
            id="sidebar"
            aria-label="Documentation navigation"
          >
            <nav>
              {docGroups.map((group) => (
                <section className="nav-group">
                  <div className="nav-group-title">{group.title}</div>
                  <div className="nav-group-links">
                    {group.pages.map(([href, label]) => (
                      <a className="nav-link" href={href} data-doc-link={href}>
                        {label}
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </nav>
            <div className="sidebar-footer">
              <span className="status-dot" />
              <span>SDK · CLI · Core</span>
            </div>
          </aside>
          <main className="main" id="main" tabIndex={-1}>
            {children}
          </main>
          <aside className="toc" aria-label="On this page">
            <div className="toc-label">On this page</div>
            <nav id="toc" />
          </aside>
        </div>
        <dialog className="search-dialog" id="search-dialog">
          <div className="search-box">
            <div className="search-input-wrap">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                id="search-input"
                type="search"
                autoComplete="off"
                placeholder="Search Solard docs…"
              />
              <kbd>Esc</kbd>
            </div>
            <div className="search-results" id="search-results" />
            <div className="search-hint">
              Use ↑ ↓ to navigate · Enter to open
            </div>
          </div>
        </dialog>
      </body>
    </html>
  );
}
