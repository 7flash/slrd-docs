import { CodeBlock, DocsPage } from "../_components/docs";

export default function GettingStartedPage() {
  return (
    <DocsPage
      title="Quick start"
      description="Install Solard, set RPC, then use the SDK or CLI."
    >
      <h2 id="install">Install</h2>
      <CodeBlock language="shell">{`bun add @solard/sdk
bun add -g solard-cli`}</CodeBlock>

      <h2 id="rpc">RPC</h2>
      <CodeBlock language="dotenv">{`RPC_ENDPOINT=https://your-rpc.example
SOLANA_WS_URL=wss://your-ws.example`}</CodeBlock>
      <p>
        <code>RPC_ENDPOINT</code> handles reads and transactions.{" "}
        <code>SOLANA_WS_URL</code> is optional and used by long-lived
        subscriptions.
      </p>

      <h2 id="sdk">SDK</h2>
      <CodeBlock language="ts">{`import { createSolard } from "@solard/sdk";

const slrd = createSolard({
  rpcUrl: process.env.RPC_ENDPOINT,
  dbPath: ".solard/app.sqlite",
});

try {
  const wallet = slrd.createWallet("main");
  const token = await slrd.addToken("TOKEN_MINT", "token");
  const price = await slrd.samplePrice(token.mint);
  console.log(wallet, price);
} finally {
  slrd.close();
}`}</CodeBlock>
      <p>
        Use <a href="/sdk/client">Client</a> for durable operations and{" "}
        <a href="/sdk/subscriptions">Subscriptions</a> for live launches,
        migrations, and trades.
      </p>

      <h2 id="cli">CLI</h2>
      <CodeBlock language="shell">{`slrd setup --status
slrd wallet create main
slrd balances --wallet main
slrd --help`}</CodeBlock>

      <h2 id="signing">Signing</h2>
      <p>
        Interactive CLI commands can prompt for the wallet password. Automation
        can set <code>SLRD_MASTER_KEY</code>. Public APIs sign through wallet
        operations; they do not expose raw private keys.
      </p>

      <h2 id="writes">Live writes</h2>
      <p>
        Execution rules differ by command. <code>buy</code>, <code>sell</code>,
        and <code>transfer</code> execute unless simulation is requested.
        Guarded command families such as Meteora and Raydium require{" "}
        <code>--live</code>, and their live paths also require{" "}
        <code>SOLARD_ENABLE_LIVE_TRADES=1</code>.
      </p>
      <p>
        See <a href="/safety">Execution & safety</a>.
      </p>
    </DocsPage>
  );
}
