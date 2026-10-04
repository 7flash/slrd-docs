import { DocsPage } from "../_components/docs";
import { ReferenceIndex } from "../_components/reference";

export default function ApiReferencePage() {
  return (
    <DocsPage
      title="All reference"
      description="SDK, CLI, configuration, and concepts."
    >
      <h2 id="sdk">SDK</h2>
      <ReferenceIndex
        items={[
          {
            href: "/sdk/client",
            title: "Client",
            description:
              "Wallets, tokens, balances, holders, prices, buy, sell.",
          },
          {
            href: "/sdk/subscriptions",
            title: "Subscriptions",
            description: "Launches, migrations, trades, metadata, lifecycle.",
          },
          {
            href: "/sdk/history-events",
            title: "History",
            description: "Replay, market history, coverage, merged streams.",
          },
          {
            href: "/sdk/rewards",
            title: "Claims & payouts",
            description: "Creator claims and cumulative payouts.",
          },
          {
            href: "/sdk/types",
            title: "Types",
            description: "Amounts, refs, events, receipts, snapshots, state.",
          },
        ]}
      />

      <h2 id="cli">CLI</h2>
      <ReferenceIndex
        items={[
          {
            href: "/cli/wallets-tokens",
            title: "Wallets & tokens",
            description:
              "Wallets, contacts, balances, tokens, holders, events, vanity.",
          },
          {
            href: "/cli/market-data",
            title: "Market data",
            description:
              "Feed, launch watch, prices, history, backtests, tx streams.",
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

      <h2 id="concepts">Other</h2>
      <ReferenceIndex
        items={[
          {
            href: "/configuration",
            title: "Configuration",
            description: "Environment variables and defaults.",
          },
          {
            href: "/architecture",
            title: "Architecture",
            description:
              "Ownership, subscriptions, enrichment, security, execution.",
          },
          {
            href: "/safety",
            title: "Execution & safety",
            description: "Signing, secrets, simulation, paper/live, CLI gates.",
          },
          {
            href: "/venues",
            title: "Venues",
            description: "Pump, PumpSwap, Jupiter, Raydium, Meteora.",
          },
          {
            href: "/meteora-autopilot",
            title: "Meteora autopilot",
            description: "Screening, planning, memory, guarded execution.",
          },
        ]}
      />
    </DocsPage>
  );
}
