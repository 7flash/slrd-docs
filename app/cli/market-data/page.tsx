import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { marketDataCommands } from "../../_data/cli";

export default function CliMarketDataPage() {
  return (
    <DocsPage
      title="Market data"
      description="Feeds, launch discovery, prices, history, backtests, and transaction streams."
    >
      <h2 id="shared-feed">Feed service and launch discovery</h2>
      <p>
        <code>slrd feed serve</code> wraps live subscriptions in a shared
        WebSocket service. SDK apps can use the subscriptions directly.
      </p>
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
