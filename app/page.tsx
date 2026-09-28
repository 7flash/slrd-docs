import { Card, Cards, Callout, DocsPage } from "./_components/docs";

export default function OverviewPage() {
  return (
    <DocsPage
      eyebrow="Solana execution toolkit"
      title="Solard documentation"
      description="Reference-grade documentation for the curated SDK, the full operational CLI, encrypted wallets, token history, trading routes, launch tooling, durable payouts, and Meteora/Raydium workflows."
    >
      <div className="hero-grid">
        <section className="hero-card">
          <small>Public SDK</small>
          <h3>A deliberately small application surface</h3>
          <p>
            <code>@solard/sdk</code> exposes wallet/token operations, holders,
            prices, execution, replay, claims, distributions, and shared feeds
            without handing applications raw repositories or signers.
          </p>
          <div className="metric">7 root exports</div>
        </section>
        <section className="hero-card">
          <small>CLI</small>
          <h3>Operational reference, not just examples</h3>
          <p>
            <code>slrd</code> covers wallets, market feeds, history, launches,
            trading, consolidation, rewards, strategies, Meteora, Raydium, and
            lower-level operational tooling.
          </p>
          <div className="metric">full CLI surface</div>
        </section>
      </div>

      <h2 id="what-is-solard">What is Solard?</h2>
      <p>
        Solard is a Bun-first Solana toolkit organized as a monorepo. Core owns
        encrypted wallet persistence, transaction assembly/submission, venue
        integrations, token/event history, backtesting, payout state, and
        runtime automation. The public SDK exposes a curated subset for
        application code; the CLI exposes a much wider operational surface.
      </p>
      <div className="pill-row">
        <span className="pill">encrypted wallets</span>
        <span className="pill">Pump / PumpSwap</span>
        <span className="pill">Jupiter routing</span>
        <span className="pill">Raydium</span>
        <span className="pill">Meteora DLMM</span>
        <span className="pill">neutral replay</span>
        <span className="pill">durable payouts</span>
        <span className="pill">strategies + agents</span>
      </div>

      <h2 id="choose-a-surface">Choose a surface</h2>
      <Cards>
        <Card
          href="/getting-started"
          label="01 · setup"
          title="Getting started"
        >
          Install the SDK or CLI, configure chain access, and understand
          wallet-password behavior.
        </Card>
        <Card href="/sdk/client" label="02 · code" title="SDK client reference">
          Exact method signatures, parameters, return values, and execution
          behavior.
        </Card>
        <Card href="/cli" label="03 · terminal" title="CLI reference">
          Every documented command family split into focused operational pages.
        </Card>
        <Card href="/safety" label="04 · execution" title="Execution & safety">
          Know which surfaces execute directly, which simulate, and which
          require --live.
        </Card>
      </Cards>

      <h2 id="documentation-scope">Documentation scope</h2>
      <p>
        These pages are generated from the supplied project scan rather than
        from generic Solana conventions. The SDK pages follow{" "}
        <code>packages/sdk/src/client.ts</code> and its exact export membrane.
        The CLI pages follow the top-level help plus the dedicated Meteora,
        Raydium, accounting, transfer, buy, and sell command implementations.
      </p>
      <Callout title="Core is larger than the public SDK">
        <p>
          If a method exists in <code>@solard/core</code> but is not exported
          through <code>@solard/sdk</code>, it is not presented as a public SDK
          method here. Venue and CLI pages document those broader operational
          features separately.
        </p>
      </Callout>
    </DocsPage>
  );
}
