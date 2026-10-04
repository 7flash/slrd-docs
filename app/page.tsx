import { CodeBlock, DocsPage } from "./_components/docs";
import { ReferenceIndex } from "./_components/reference";

export default function OverviewPage() {
  return (
    <DocsPage title="Solard" description="SDK and CLI for Solana applications.">
      <h2 id="start">Start</h2>
      <CodeBlock language="shell">{`bun add @solard/sdk
bun add -g solard-cli`}</CodeBlock>
      <CodeBlock language="ts">{`import { createSolard } from "@solard/sdk";

const slrd = createSolard({ rpcUrl, dbPath });
const wallets = slrd.listWallets();
slrd.close();`}</CodeBlock>
      <p>
        <a href="/getting-started">Quick start</a> ·{" "}
        <a href="/configuration">Configuration</a>
      </p>

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
            description: "Replay, coverage, market history, merged streams.",
          },
          {
            href: "/sdk/rewards",
            title: "Claims & payouts",
            description: "Creator fees and cumulative distributions.",
          },
          {
            href: "/sdk/types",
            title: "Types",
            description: "Refs, amounts, events, receipts, snapshots, state.",
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
            description: "Pools, positions, liquidity, claims, swaps.",
          },
          {
            href: "/cli/raydium",
            title: "Raydium",
            description: "Quotes, swaps, LaunchLab, CPMM.",
          },
        ]}
      />
    </DocsPage>
  );
}
