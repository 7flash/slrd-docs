export function DocsPage(props: {
  title: string;
  description?: string;
  children: any;
}) {
  return (
    <article className="doc">
      <h1>{props.title}</h1>
      {props.description ? <p className="lede">{props.description}</p> : null}
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

export function Method(props: { name: string; children: any }) {
  return (
    <div className="method">
      <code className="method-name">{props.name}</code>
      <div>{props.children}</div>
    </div>
  );
}
