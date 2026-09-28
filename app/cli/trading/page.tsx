import { Callout, DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { tradingCommands } from "../../_data/cli";

export default function CliTradingPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Trading & operations"
      description="Exact execution semantics for transfer, swap, buy, sell, consolidation, liquidation, WSOL cleanup, program reclaim, creator claims, batch transfers, and reward distribution commands."
    >
      <Callout title="There are two execution models" tone="warn">
        <p>
          <code>buy</code>, <code>sell</code>, <code>transfer</code>,{" "}
          <code>unwrap-wsol</code>, and creator-fee claims execute unless you
          explicitly request simulation. Generic <code>swap</code>,
          sweep/liquidation, spam-buy, Meteora, Raydium, and several
          launch/strategy commands use an explicit <code>--live</code> gate.
          Read each command entry before running it against funded wallets.
        </p>
      </Callout>
      <h2 id="direct-trading">Direct transfers and trading</h2>
      {tradingCommands.slice(0, 5).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="consolidation">Consolidation and cleanup</h2>
      {tradingCommands.slice(5, 9).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="claims-batches">Claims and durable batches</h2>
      {tradingCommands.slice(9).map((command) => (
        <CommandRef {...command} />
      ))}
    </DocsPage>
  );
}
