import { Cards, Card, DocsPage } from "../_components/docs";
import { ReferenceIndex } from "../_components/reference";

export default function ApiReferencePage() {
  return (
    <DocsPage
      eyebrow="Reference"
      title="Reference index"
      description="Jump directly to the precise SDK or CLI surface you need. The detailed pages are organized around the actual exported client and the commands present in the supplied CLI source."
    >
      <h2 id="sdk-reference">SDK reference</h2>
      <ReferenceIndex
        items={[
          {
            href: "/sdk/client",
            title: "Client methods",
            description:
              "createSolard, wallet/token methods, balances, holders, market price, buy, and sell.",
          },
          {
            href: "/sdk/history-events",
            title: "History & events",
            description:
              "ReplayOptions, ReplayHistory, MarketHistoryOptions, events(), and merged streams.",
          },
          {
            href: "/sdk/rewards",
            title: "Claims & distributions",
            description:
              "CreatorRewardClaimResult and durable cumulative distribution planning/execution.",
          },
          {
            href: "/sdk/price-feed",
            title: "Shared price feed",
            description:
              "connectPriceFeed, createPriceFeed, commands, messages, listeners, and reconnect behavior.",
          },
          {
            href: "/sdk/types",
            title: "Types & returns",
            description:
              "Amounts, refs, WalletInfo, MarketPrice, holder snapshots, SendReceipt, SimulationResult, and replay state.",
          },
        ]}
      />

      <h2 id="cli-reference">CLI reference</h2>
      <ReferenceIndex
        items={[
          {
            href: "/cli/wallets-tokens",
            title: "Wallets & tokens",
            description:
              "Vault setup, wallet create/import/export, contacts, balances, token history, holders, events, vanity.",
          },
          {
            href: "/cli/market-data",
            title: "Market data & history",
            description:
              "Feed server, launch/Pump watch, quote/price commands, backtest, tx stream, execution history.",
          },
          {
            href: "/cli/trading",
            title: "Trading & operations",
            description:
              "Transfer, swap, buy/sell, spam-buy, sweep, liquidation, WSOL, reclaim, claims, rewards, transfer-many.",
          },
          {
            href: "/cli/launching",
            title: "Launching & metadata",
            description:
              "Pump launch/prepare/deploy, metadata upload, vamp, and pooled vanity mint use.",
          },
          {
            href: "/cli/automation",
            title: "Automation & agents",
            description:
              "Scripts, strategies, groups, agents, watches, ALTs, and Jito helpers.",
          },
          {
            href: "/cli/meteora",
            title: "Meteora DLMM",
            description:
              "Complete read, position, migration, claim, close, quote, and swap reference.",
          },
          {
            href: "/cli/raydium",
            title: "Raydium",
            description: "Quotes/swaps, LaunchLab, and CPMM pool creation.",
          },
        ]}
      />

      <h2 id="concepts">Execution concepts</h2>
      <Cards>
        <Card href="/safety" label="Concept" title="Execution & safety">
          Understand which methods/commands execute, simulate, quote, or require
          --live.
        </Card>
        <Card href="/venues" label="Concept" title="Venues & routing">
          Understand native Pump/PumpSwap routes, Jupiter fallback, Raydium
          services, and Meteora DLMM.
        </Card>
        <Card href="/configuration" label="Concept" title="Configuration">
          Environment and rate-limit settings referenced throughout the API/CLI
          docs.
        </Card>
        <Card
          href="/meteora-autopilot"
          label="Concept"
          title="Meteora autopilot"
        >
          Deterministic screening and guarded model-assisted LP management.
        </Card>
      </Cards>
    </DocsPage>
  );
}
