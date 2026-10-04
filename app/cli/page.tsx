import { CodeBlock, DocsPage } from "../_components/docs";
import { ReferenceIndex } from "../_components/reference";

export default function CliPage() {
  return (
    <DocsPage
      title="CLI"
      description="Terminal access to Solard wallets, data, execution, launches, and liquidity tools."
    >
      <h2 id="usage">Usage</h2>
      <CodeBlock language="shell">{`slrd <command> [options]
slrd --help`}</CodeBlock>

      <h2 id="execution">Execution</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Command type</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Read</td>
              <td>No write or broadcast.</td>
            </tr>
            <tr>
              <td>Local state</td>
              <td>Updates Solard's database only.</td>
            </tr>
            <tr>
              <td>Direct execution</td>
              <td>
                Commands such as <code>buy</code>, <code>sell</code>, and{" "}
                <code>transfer</code> execute unless simulation is requested.
              </td>
            </tr>
            <tr>
              <td>Guarded execution</td>
              <td>
                Commands such as Raydium and Meteora do not broadcast without{" "}
                <code>--live</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Each command reference states its exact behavior.</p>

      <h2 id="commands">Commands</h2>
      <ReferenceIndex
        items={[
          {
            href: "/cli/wallets-tokens",
            title: "Wallets & tokens",
            description:
              "Wallets, contacts, balances, tokens, holders, events, vanity mints.",
          },
          {
            href: "/cli/market-data",
            title: "Market data",
            description:
              "Feeds, launches, prices, backtests, transaction streams.",
          },
          {
            href: "/cli/trading",
            title: "Trading",
            description:
              "Transfer, swap, buy, sell, sweep, liquidation, claims, rewards.",
          },
          {
            href: "/cli/launching",
            title: "Launching",
            description: "Pump launch, prepare, metadata, deploy, vamp.",
          },
          {
            href: "/cli/automation",
            title: "Automation",
            description:
              "Scripts, strategies, groups, agents, watches, ALTs, Jito.",
          },
          {
            href: "/cli/meteora",
            title: "Meteora",
            description: "Discovery, positions, liquidity, claims, swaps.",
          },
          {
            href: "/cli/raydium",
            title: "Raydium",
            description: "Quotes, swaps, LaunchLab, CPMM.",
          },
        ]}
      />

      <h2 id="diagnostics">Diagnostics</h2>
      <CodeBlock language="shell">{`slrd <command> --measure
slrd <command> --measure-stream`}</CodeBlock>
      <p>
        <code>--measure</code> prints aggregate timing after the command.{" "}
        <code>--measure-stream</code> restores live <code>measure-fn</code>{" "}
        output.
      </p>
    </DocsPage>
  );
}
