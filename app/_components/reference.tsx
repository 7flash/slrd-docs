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
            <th>Option</th>
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

type ExecutionMode =
  | "read"
  | "local-write"
  | "external-write"
  | "live-default"
  | "live-flag"
  | "plan"
  | "mixed";

function executionMeaning(mode: ExecutionMode | undefined): string | null {
  if (mode === "read") return "Read-only.";
  if (mode === "local-write") return "Local state only; no Solana transaction.";
  if (mode === "external-write")
    return "External side effect; no Solana transaction.";
  if (mode === "live-default")
    return "Executes unless simulation is requested.";
  if (mode === "live-flag") return "No broadcast without --live.";
  if (mode === "plan") return "Plans or simulates by default.";
  if (mode === "mixed") return "Execution depends on the subcommand.";
  return null;
}

type CommandRefProps = {
  id: string;
  title: string;
  syntax: string | string[];
  summary: string;
  behavior?: string[];
  options?: ReferenceOption[];
  notes?: string[];
  example?: string;
  mode?: ExecutionMode;
};

export function CommandRef(props: CommandRefProps) {
  const syntaxes = Array.isArray(props.syntax) ? props.syntax : [props.syntax];
  const execution = executionMeaning(props.mode);
  return (
    <section className="reference-entry" id={props.id}>
      <h3>{props.title}</h3>
      <p className="reference-summary">{props.summary}</p>
      <CodeBlock language="shell">{syntaxes.join("\n")}</CodeBlock>
      {execution ? <p className="reference-meta">{execution}</p> : null}
      {props.behavior?.length ? (
        <ul className="compact-list">
          {props.behavior.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      ) : null}
      {props.options?.length ? <OptionTable rows={props.options} /> : null}
      {props.notes?.length ? (
        <ul className="compact-list reference-notes">
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
      <p className="reference-summary">{props.summary}</p>
      <CodeBlock language="ts">{props.signature}</CodeBlock>
      {props.behavior?.length ? (
        <ul className="compact-list">
          {props.behavior.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      ) : null}
      {props.parameters?.length ? (
        <OptionTable rows={props.parameters} />
      ) : null}
      {props.returns ? (
        <p className="reference-meta">
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
        <a className="reference-index-item" href={item.href}>
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <span className="reference-arrow">→</span>
        </a>
      ))}
    </div>
  );
}
