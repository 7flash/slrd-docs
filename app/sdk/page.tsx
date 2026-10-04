import { CodeBlock, DocsPage } from "../_components/docs";
import { ReferenceIndex } from "../_components/reference";

export default function SdkPage() {
  return (
    <DocsPage
      title="SDK"
      description="Application API for wallets, market data, execution, history, and payouts."
    >
      <h2 id="client">Client</h2>
      <CodeBlock language="ts">{`import { createSolard } from "@solard/sdk";

const slrd = createSolard({ rpcUrl, dbPath });
try {
  const wallets = slrd.listWallets();
  const price = await slrd.samplePrice(token);
  const receipt = await slrd.buy(token, wallet, amount);
} finally {
  slrd.close();
}`}</CodeBlock>
      <p>
        The client owns durable Solard state. Create one per process or service
        boundary and close it when that owner stops.
      </p>

      <h2 id="subscriptions">Subscriptions</h2>
      <CodeBlock language="ts">{`import {
  subscribeLaunches,
  subscribeMigrations,
  subscribeTrades,
} from "@solard/sdk";`}</CodeBlock>
      <p>
        Live subscriptions use an application-owned Solana{" "}
        <code>Connection</code>. Solard decodes protocol events; the application
        chooses what to watch and what to do with them.
      </p>

      <h2 id="reference">Reference</h2>
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
            description: "Creator-fee claims and cumulative distributions.",
          },
          {
            href: "/sdk/types",
            title: "Types",
            description:
              "Public refs, amounts, events, receipts, snapshots, state.",
          },
        ]}
      />
    </DocsPage>
  );
}
