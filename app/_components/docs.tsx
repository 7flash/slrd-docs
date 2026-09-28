export function DocsPage(props: {
  eyebrow: string;
  title: string;
  description: string;
  children: any;
}) {
  return (
    <article className="doc">
      <div className="eyebrow">{props.eyebrow}</div>
      <h1>{props.title}</h1>
      <p className="lede">{props.description}</p>
      {props.children}
    </article>
  );
}

export function CodeBlock(props: { language?: string; children: string }) {
  return (
    <div className="code-wrap">
      <div className="code-head">
        <span>{props.language ?? "code"}</span>
        <button className="copy-button" type="button" data-copy-code>
          Copy
        </button>
      </div>
      <pre>
        <code>{props.children}</code>
      </pre>
    </div>
  );
}

export function Callout(props: {
  title: string;
  tone?: "default" | "warn";
  children: any;
}) {
  return (
    <div className={`callout${props.tone === "warn" ? " warn" : ""}`}>
      <div className="callout-title">{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
}

export function Method(props: { name: string; children: any }) {
  return (
    <div className="method">
      <div className="method-name">{props.name}</div>
      <div>{props.children}</div>
    </div>
  );
}

export function Cards(props: { children: any }) {
  return <div className="card-grid">{props.children}</div>;
}

export function Card(props: {
  href: string;
  label: string;
  title: string;
  children: any;
}) {
  return (
    <a className="card" href={props.href}>
      <span className="card-label">{props.label}</span>
      <h3>{props.title}</h3>
      <p>{props.children}</p>
    </a>
  );
}
