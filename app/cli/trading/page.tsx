import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { tradingCommands } from "../../_data/cli";

export default function CliTradingPage() {
  return (
    <DocsPage
      title="Trading"
      description="Transfers, swaps, buys, sells, consolidation, claims, and rewards."
    >
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
