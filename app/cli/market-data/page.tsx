import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { marketDataCommands } from "../../_data/cli";

export default function CliMarketDataPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Market data & history"
      description="Shared WebSocket feed, launch discovery, Pump discovery, price sampling, durable history backtests, transaction streams, and persisted execution history."
    >
      <h2 id="shared-feed">Shared feed and launch discovery</h2>
      {marketDataCommands.slice(0, 4).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="quotes-prices">Quotes and prices</h2>
      {marketDataCommands.slice(4, 8).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="backtests-history">Backtesting and transaction history</h2>
      {marketDataCommands.slice(8).map((command) => (
        <CommandRef {...command} />
      ))}
    </DocsPage>
  );
}
