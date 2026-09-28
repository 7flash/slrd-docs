import { CodeBlock } from "./docs";

export type ReferenceOption = {
  name: string;
  type?: string;
  defaultValue?: string;
  description: string;
};

export function OptionTable(props: { rows: ReferenceOption[] }) {
  return (
    <div className="table-wrap reference-table">
      <table>
        <thead>
          <tr>
            <th>Option / parameter</th>
            <th>Type</th>
            <th>Default</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr>
              <td>
                <code>{row.name}</code>
              </td>
              <td>{row.type ? <code>{row.type}</code> : "—"}</td>
              <td>
                {row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CommandRef(props: {
  id: string;
  title: string;
  syntax: string | string[];
  summary: string;
  behavior?: string[];
  options?: ReferenceOption[];
  notes?: string[];
  example?: string;
  mode?:
    | "read"
    | "local-write"
    | "external-write"
    | "live-default"
    | "live-flag"
    | "plan"
    | "mixed";
}) {
  const syntaxes = Array.isArray(props.syntax) ? props.syntax : [props.syntax];
  const modeLabel =
    props.mode === "read"
      ? "read-only / no chain write"
      : props.mode === "local-write"
        ? "local state change / no chain write"
        : props.mode === "external-write"
          ? "external side effect / no chain write"
          : props.mode === "live-default"
            ? "broadcasts unless simulated"
            : props.mode === "live-flag"
              ? "requires --live to broadcast"
              : props.mode === "plan"
                ? "plan / simulation by default"
                : props.mode === "mixed"
                  ? "subcommand-dependent"
                  : null;
  return (
    <section className="reference-entry" id={props.id}>
      <div className="reference-heading">
        <h3>{props.title}</h3>
        {modeLabel ? (
          <span className={`mode-badge mode-${props.mode}`}>{modeLabel}</span>
        ) : null}
      </div>
      <p>{props.summary}</p>
      <CodeBlock language="shell">{syntaxes.join("\n")}</CodeBlock>
      {props.behavior?.map((item) => (
        <p>{item}</p>
      ))}
      {props.options?.length ? <OptionTable rows={props.options} /> : null}
      {props.notes?.length ? (
        <ul className="reference-notes">
          {props.notes.map((note) => (
            <li>{note}</li>
          ))}
        </ul>
      ) : null}
      {props.example ? (
        <CodeBlock language="shell">{props.example}</CodeBlock>
      ) : null}
    </section>
  );
}

export function ApiRef(props: {
  id: string;
  name: string;
  signature: string;
  summary: string;
  behavior?: string[];
  parameters?: ReferenceOption[];
  returns?: string;
  example?: string;
}) {
  return (
    <section className="reference-entry api-entry" id={props.id}>
      <h3>
        <code>{props.name}</code>
      </h3>
      <p>{props.summary}</p>
      <CodeBlock language="ts">{props.signature}</CodeBlock>
      {props.behavior?.map((item) => (
        <p>{item}</p>
      ))}
      {props.parameters?.length ? (
        <OptionTable rows={props.parameters} />
      ) : null}
      {props.returns ? (
        <p>
          <strong>Returns:</strong> {props.returns}
        </p>
      ) : null}
      {props.example ? (
        <CodeBlock language="ts">{props.example}</CodeBlock>
      ) : null}
    </section>
  );
}

export function ReferenceIndex(props: {
  items: Array<{ href: string; title: string; description: string }>;
}) {
  return (
    <div className="reference-index">
      {props.items.map((item) => (
        <a href={item.href} className="reference-index-item">
          <strong>{item.title}</strong>
          <span>{item.description}</span>
        </a>
      ))}
    </div>
  );
}
