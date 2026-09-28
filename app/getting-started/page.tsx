import { Callout, CodeBlock, DocsPage } from "../_components/docs";

export default function GettingStartedPage() {
  return (
    <DocsPage
      eyebrow="Install and connect"
      title="Getting started"
      description="Set up Solard as a public SDK, a CLI, or both. Solard targets Bun, keeps shared local state in SQLite, and encrypts persisted signing wallets."
    >
      <h2 id="install-sdk">Install the SDK</h2>
      <CodeBlock language="shell">{`bun add @solard/sdk`}</CodeBlock>
      <p>
        The public package exposes a curated client, amount helpers,
        replay/history types, durable payout primitives, and shared price-feed
        helpers.
      </p>

      <h2 id="install-cli">Install the CLI</h2>
      <CodeBlock language="shell">{`bun add -g solard-cli
slrd --help`}</CodeBlock>
      <p>
        The executable is published as both <code>slrd</code> and{" "}
        <code>solard</code>.
      </p>

      <h2 id="rpc">Configure chain access</h2>
      <CodeBlock language="dotenv">{`RPC_ENDPOINT=https://your-solana-rpc.example`}</CodeBlock>
      <p>
        RPC is only required for commands and SDK methods that read or write
        chain state. Local registry/listing operations can work without it.
      </p>

      <h2 id="cli-wallet">Create the first CLI wallet</h2>
      <CodeBlock language="shell">{`slrd setup --status
slrd wallet create main
slrd balances --wallet main`}</CodeBlock>
      <p>
        Without <code>SLRD_MASTER_KEY</code>, signing commands use the CLI's
        ephemeral password prompt. The password is used for that process and is
        not stored. For non-interactive automation/CI, set a high-entropy{" "}
        <code>SLRD_MASTER_KEY</code> explicitly.
      </p>

      <h2 id="first-client">Create a public SDK client</h2>
      <CodeBlock language="ts">{`import { createSolard } from "@solard/sdk";

const slrd = createSolard({
  rpcUrl: process.env.RPC_ENDPOINT,
  dbPath: ".solard/app.sqlite",
});

try {
  const wallets = slrd.listWallets();
  console.log(wallets);
} finally {
  slrd.close();
}`}</CodeBlock>

      <h2 id="first-read">Register and inspect a token</h2>
      <CodeBlock language="ts">{`const token = await slrd.addToken("TOKEN_MINT", "example");
const price = await slrd.samplePrice(token.mint);
const holders = await slrd.snapshotHolders(token.mint, {
  commitment: "confirmed",
});

console.log(price.priceQuotePerToken);
console.log(holders.eligibleHolderCount);`}</CodeBlock>

      <h2 id="first-trade">Understand execution before trading</h2>
      <Callout title="SDK buy/sell execute" tone="warn">
        <p>
          <code>slrd.buy()</code> and <code>slrd.sell()</code> are execution
          methods. Their normal simulation is a pre-send check, not a dry-run
          mode. For CLI operations, some commands execute unless{" "}
          <code>--simulate-only</code> while other command families require{" "}
          <code>--live</code>. Read <a href="/safety">Execution & safety</a>{" "}
          before funding automation.
        </p>
      </Callout>
    </DocsPage>
  );
}
