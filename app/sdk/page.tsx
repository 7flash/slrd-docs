import { Callout, Cards, Card, CodeBlock, DocsPage } from "../_components/docs";

export default function SdkPage() {
  return (
    <DocsPage
      eyebrow="@solard/sdk"
      title="SDK overview"
      description="@solard/sdk is a deliberately curated application-facing membrane over core. It exposes the common wallet, token, market, history, reward, and shared-feed operations without exposing repositories, raw database handles, signers, or venue registries."
    >
      <h2 id="exports">Exact root exports</h2>
      <p>The supplied SDK root exports these runtime values:</p>
      <CodeBlock language="ts">{`createSolard
createTraderSolard
formatRaw
sol
tokenAmount
createPriceFeed
connectPriceFeed`}</CodeBlock>
      <p>
        <code>createTraderSolard</code> is an alias of <code>createSolard</code>{" "}
        in the public SDK client. The SDK also re-exports application-facing
        types for replay/history, holder snapshots, claims, cumulative
        distributions, amounts, receipts, wallet/token references, and the
        shared price feed.
      </p>
      <Callout title="The public SDK is intentionally smaller than @solard/core">
        <p>
          The SDK membrane test explicitly checks that the root client does not
          expose <code>db</code>, wallet/token repositories, execution stores,
          senders, venues, claim sources, launch registries,{" "}
          <code>connection()</code>, or <code>signer()</code>. Use{" "}
          <code>@solard/core</code> only when you intentionally need those
          lower-level surfaces.
        </p>
      </Callout>

      <h2 id="client-lifecycle">Create and close a client</h2>
      <CodeBlock language="ts">{`import { createSolard } from "@solard/sdk";

const slrd = createSolard({
  rpcUrl: process.env.RPC_ENDPOINT,
  dbPath: ".solard/app.sqlite",
  cacheTtlMs: 5_000,
});

try {
  const wallets = slrd.listWallets();
  console.log(wallets);
} finally {
  slrd.close();
}`}</CodeBlock>

      <h2 id="reference-sections">Reference sections</h2>
      <Cards>
        <Card href="/sdk/client" label="SDK" title="Client methods">
          Every root client method with exact signatures, options, behavior, and
          return shapes.
        </Card>
        <Card href="/sdk/history-events" label="SDK" title="History & events">
          Neutral replay, market history, replay subscriptions, coverage, and
          merged streams.
        </Card>
        <Card href="/sdk/rewards" label="SDK" title="Claims & distributions">
          Creator-fee claim reconciliation and cumulative entitlement
          distribution state.
        </Card>
        <Card href="/sdk/price-feed" label="SDK" title="Shared price feed">
          Low-level WebSocket client and higher-level shared listener API.
        </Card>
        <Card href="/sdk/types" label="SDK" title="Types & returns">
          Amounts, references, holder snapshots, receipts, prices, replay
          records, and distribution state.
        </Card>
        <Card href="/cli" label="CLI" title="CLI reference">
          Map the same primitives to operational slrd commands and their
          live/simulation semantics.
        </Card>
      </Cards>
    </DocsPage>
  );
}
