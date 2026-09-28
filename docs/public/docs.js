export const groups = [
  {
    title: "Start",
    pages: ["overview", "getting-started", "configuration"],
  },
  {
    title: "Develop",
    pages: ["sdk", "wallets-tokens", "trading", "history-events"],
  },
  {
    title: "Operate",
    pages: ["cli", "venues", "meteora-autopilot", "safety"],
  },
  {
    title: "Reference",
    pages: ["api-surface"],
  },
];

export const pages = {
  overview: {
    title: "Solard documentation",
    nav: "Overview",
    eyebrow: "Solana execution toolkit",
    description:
      "A practical guide to Solard: encrypted wallets, transaction execution, trading routes, token history, launch tooling, and autonomous Meteora liquidity workflows.",
    html: `
      <div class="hero-grid">
        <section class="hero-card">
          <small>Public SDK</small>
          <h3>One client for wallet, token, market, and history workflows</h3>
          <p>The curated <code>@solard/sdk</code> surface exposes the common application APIs without handing callers direct database repositories or secret-bearing internals.</p>
          <div class="metric">@solard/sdk</div>
        </section>
        <section class="hero-card">
          <small>CLI</small>
          <h3>Multi-wallet operations from the terminal</h3>
          <p>Use <code>slrd</code> to create wallets, inspect balances, transfer assets, trade, replay history, run strategies, and operate venue-specific tooling.</p>
          <div class="metric">slrd</div>
        </section>
      </div>

      <h2 id="what-is-solard">What is Solard?</h2>
      <p>Solard is a Bun-first Solana toolkit organized as a monorepo. The core package owns wallets, transaction construction, persistence, venue integrations, event history, backtesting, and runtime agents. The public SDK deliberately exposes a smaller application-facing membrane, while the CLI turns common workflows into operational commands.</p>
      <div class="pill-row">
        <span class="pill">encrypted wallets</span>
        <span class="pill">Pump / PumpSwap</span>
        <span class="pill">Raydium</span>
        <span class="pill">Meteora DLMM</span>
        <span class="pill">history + replay</span>
        <span class="pill">backtesting</span>
        <span class="pill">agents</span>
      </div>

      <h2 id="choose-a-surface">Choose a surface</h2>
      <div class="card-grid">
        <a class="card" href="#/getting-started">
          <span class="card-label">01 · setup</span>
          <h3>Getting started</h3>
          <p>Install the SDK or CLI, configure an RPC endpoint, and create your first Solard client.</p>
        </a>
        <a class="card" href="#/sdk">
          <span class="card-label">02 · code</span>
          <h3>Public SDK</h3>
          <p>Use the curated client for wallets, tokens, holders, prices, buys, sells, replay, and distributions.</p>
        </a>
        <a class="card" href="#/cli">
          <span class="card-label">03 · terminal</span>
          <h3>CLI</h3>
          <p>Operate multi-wallet workflows with <code>slrd</code> and keep live execution explicitly gated.</p>
        </a>
        <a class="card" href="#/meteora-autopilot">
          <span class="card-label">04 · automation</span>
          <h3>Meteora autopilot</h3>
          <p>Screen pools, build management plans, persist lessons, and run guarded autonomous LP cycles.</p>
        </a>
      </div>

      <h2 id="execution-model">Execution model</h2>
      <p>Solard separates planning from broadcasting in several high-risk flows. Simulation or read-only planning is the normal starting point, while live execution is protected by explicit call options and the <code>SOLARD_ENABLE_LIVE_TRADES</code> master switch.</p>
      <div class="callout">
        <div class="callout-title">Designed for explicit execution</div>
        <p>Treat simulation, planning, and inspection as separate phases. Turn on the live-trading switch only in the process that should be allowed to broadcast transactions.</p>
      </div>
    `,
  },

  "getting-started": {
    title: "Getting started",
    nav: "Getting started",
    eyebrow: "Install and connect",
    description:
      "Set up Solard as a public SDK, a command-line tool, or both. The project targets Bun and uses a local SQLite-backed state layer for persisted application data.",
    html: `
      <h2 id="install-sdk">Install the SDK</h2>
      <pre data-lang="shell"><code>bun add @solard/sdk</code></pre>
      <p>The public package exports <code>createSolard</code>, <code>createTraderSolard</code>, amount helpers, price-feed helpers, and the curated public types used by application code.</p>

      <h2 id="install-cli">Install the CLI</h2>
      <pre data-lang="shell"><code>bun add -g solard-cli
slrd --help</code></pre>
      <p>The executable is available as both <code>slrd</code> and <code>solard</code>.</p>

      <h2 id="first-client">Create a client</h2>
      <pre data-lang="ts"><code>import { createSolard } from "@solard/sdk";

const slrd = createSolard({
  rpcUrl: process.env.RPC_ENDPOINT,
});

try {
  const wallets = slrd.listWallets();
  console.log(wallets);
} finally {
  slrd.close();
}</code></pre>
      <p><code>createSolard()</code> accepts an optional RPC URL, database path, and cache TTL. Always close a long-lived client when the process is done with it.</p>

      <h2 id="first-wallet">Create an encrypted wallet</h2>
      <div class="steps">
        <section class="step">
          <h3>Set a master key</h3>
          <p>Persisted signing wallets require <code>SLRD_MASTER_KEY</code>. Use a long, random secret rather than a human password.</p>
          <pre data-lang="shell"><code>export SLRD_MASTER_KEY="your-long-random-secret"</code></pre>
        </section>
        <section class="step">
          <h3>Create the wallet</h3>
          <pre data-lang="ts"><code>const wallet = slrd.createWallet("primary");
console.log(wallet.address);</code></pre>
        </section>
        <section class="step">
          <h3>Add a token before token-specific calls</h3>
          <pre data-lang="ts"><code>const token = await slrd.addToken("TOKEN_MINT");
const price = await slrd.samplePrice(token.mint);</code></pre>
        </section>
      </div>

      <div class="callout warn">
        <div class="callout-title">Signing state is local</div>
        <p>The public wallet objects do not expose encrypted secret-key fields. The master key must still be protected because it is used to decrypt persisted signing wallets.</p>
      </div>
    `,
  },

  configuration: {
    title: "Configuration",
    nav: "Configuration",
    eyebrow: "Environment",
    description:
      "The most important runtime switches for RPC access, wallet encryption, live trading, sender lanes, lifecycle workers, Meteora, and optional data services.",
    html: `
      <h2 id="minimum-configuration">Minimum configuration</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Variable</th><th>Purpose</th><th>When needed</th></tr></thead>
        <tbody>
          <tr><td><code>RPC_ENDPOINT</code> or <code>HELIUS_RPC_URL</code></td><td>Solana chain access.</td><td>Most chain operations.</td></tr>
          <tr><td><code>SLRD_MASTER_KEY</code></td><td>Encrypts and decrypts persisted signing wallets.</td><td>Wallet import and signing.</td></tr>
          <tr><td><code>SOLARD_ENABLE_LIVE_TRADES=1</code></td><td>Process-level master switch for live trading flows.</td><td>Broadcasting from guarded live workflows.</td></tr>
          <tr><td><code>SOLARD_WEB_TOKEN</code></td><td>Bearer token for the web console API unless open-web mode is enabled.</td><td>Web console.</td></tr>
        </tbody>
      </table></div>

      <h2 id="senders">Optional send lanes</h2>
      <pre data-lang="dotenv"><code>HELIUS_SENDER_URL=...
HELIUS_TIP_ACCOUNT=...
JITO_BLOCK_ENGINE_URL=https://mainnet.block-engine.jito.wtf</code></pre>
      <p>Transaction calls can select a sender such as <code>rpc</code>, <code>helius</code>, or <code>jito</code> where the relevant execution path supports it.</p>

      <h2 id="pump-lifecycle">Pump lifecycle workers</h2>
      <pre data-lang="dotenv"><code>SOLARD_PUMP_WS_CONNECTIONS=5
SOLARD_PUMP_SUBSCRIPTIONS_PER_CONNECTION=1000
SOLARD_PUMP_MAX_TRACKED_TOKENS=5000
SOLARD_PUMP_LIFECYCLE_REFRESH_MS=2000
SOLARD_PUMP_ACTIVE_WINDOW_MS=3600000
SOLARD_PUMP_CURVE_POLL_MS=5000</code></pre>

      <h2 id="pumpswap-lifecycle">PumpSwap lifecycle workers</h2>
      <pre data-lang="dotenv"><code>SOLARD_PUMPSWAP_WS_CONNECTIONS=5
SOLARD_PUMPSWAP_SUBSCRIPTIONS_PER_CONNECTION=1000
SOLARD_PUMPSWAP_MAX_TRACKED_TOKENS=5000
SOLARD_PUMPSWAP_LIFECYCLE_REFRESH_MS=2000
SOLARD_PUMPSWAP_ACTIVE_WINDOW_MS=86400000</code></pre>

      <h2 id="external-data">Meteora and GMGN</h2>
      <p>Meteora read-only endpoints can be overridden for proxied or self-hosted deployments. GMGN integration is intentionally read-only for token, security, holders, traders, kline, trending, signals, and gas data; Solard does not use it for signed swap/order execution.</p>
    `,
  },

  sdk: {
    title: "Public SDK",
    nav: "SDK",
    eyebrow: "@solard/sdk",
    description:
      "The public SDK is a curated membrane over core. It provides common application operations while keeping repositories, signers, and other secret-bearing internals out of the root client surface.",
    html: `
      <h2 id="create-solard">createSolard</h2>
      <pre data-lang="ts"><code>import { createSolard } from "@solard/sdk";

const slrd = createSolard({
  rpcUrl: "https://...",
  dbPath: ".solard/app.sqlite",
  cacheTtlMs: 5_000,
});</code></pre>

      <h2 id="client-surface">Client surface</h2>
      <div class="method"><div class="method-name">createWallet()</div><p>Generate and persist an encrypted signing wallet.</p></div>
      <div class="method"><div class="method-name">createVanityWallet()</div><p>Generate a wallet whose public key matches a requested suffix, then persist it.</p></div>
      <div class="method"><div class="method-name">importWallet()</div><p>Import a Solana private key into the encrypted wallet store.</p></div>
      <div class="method"><div class="method-name">listWallets()</div><p>Return the public wallet registry without exposing encrypted secret-key fields.</p></div>
      <div class="method"><div class="method-name">addToken()</div><p>Inspect a mint, resolve venue metadata, and persist the token.</p></div>
      <div class="method"><div class="method-name">resolveToken()</div><p>Resolve a stored token by supported reference.</p></div>
      <div class="method"><div class="method-name">tokenAccounts()</div><p>List token accounts owned by a stored wallet.</p></div>
      <div class="method"><div class="method-name">snapshotHolders()</div><p>Build a holder snapshot for a token.</p></div>
      <div class="method"><div class="method-name">walletBalances()</div><p>Read SOL and selected token balances for a wallet.</p></div>
      <div class="method"><div class="method-name">samplePrice()</div><p>Resolve a venue and record a current market price sample.</p></div>
      <div class="method"><div class="method-name">buy()</div><p>Build and send a routed buy transaction for a token and wallet.</p></div>
      <div class="method"><div class="method-name">sell()</div><p>Build and send a routed sell transaction, optionally using a balance percentage in basis points.</p></div>
      <div class="method"><div class="method-name">close()</div><p>Close the underlying Solard resources when finished.</p></div>

      <h2 id="amounts">Amount helpers</h2>
      <pre data-lang="ts"><code>import { sol, tokenAmount, formatRaw } from "@solard/sdk";

const spend = sol(0.25);
const display = formatRaw(1250000n, 6);</code></pre>
      <p><code>sol()</code> converts a human SOL value into the raw amount representation used by the trading APIs. <code>tokenAmount()</code> does the same for an SPL token when you provide its mint and decimals.</p>

      <h2 id="history-api">Nested history and events APIs</h2>
      <pre data-lang="ts"><code>const replay = await slrd.history.replay(token);
const market = await slrd.history.market(token);
const stream = await slrd.events(token);

stream.close?.();</code></pre>
      <p>The SDK also exposes creator-fee claims and cumulative distributions under <code>claims.creatorFees</code> and <code>distributions</code>.</p>
    `,
  },

  "wallets-tokens": {
    title: "Wallets and tokens",
    nav: "Wallets & tokens",
    eyebrow: "State and identity",
    description:
      "Persist encrypted signing wallets, keep public contacts separate, register tokens, and inspect balances without leaking signing material through public SDK objects.",
    html: `
      <h2 id="wallet-lifecycle">Wallet lifecycle</h2>
      <pre data-lang="ts"><code>const primary = slrd.createWallet("primary");
const imported = slrd.importWallet(process.env.PRIVATE_KEY, "maker");
const wallets = slrd.listWallets();</code></pre>
      <p>The canonical wallet store validates that the active master key can decrypt persisted signing wallets. The repository tests also verify rollback behavior if a newly stored encrypted wallet fails the integrity invariant.</p>

      <h2 id="contacts">Contacts are not wallets</h2>
      <p>The CLI has a separate external-contact address book. Contacts are public addresses only; they are not signing wallets and are not group members.</p>
      <pre data-lang="shell"><code>slrd contact add treasury ADDRESS
slrd contact list
slrd contact show treasury
slrd contact remove treasury</code></pre>

      <h2 id="token-registry">Token registry</h2>
      <pre data-lang="ts"><code>const token = await slrd.addToken("TOKEN_MINT", "alias");
const resolved = slrd.resolveToken("alias");
const holders = await slrd.snapshotHolders(resolved.mint);</code></pre>
      <p>Adding a token reads the mint state and asks registered venues to inspect it before persisting the resulting token row.</p>

      <h2 id="balances">Balances</h2>
      <pre data-lang="ts"><code>const balances = await slrd.walletBalances("primary", [token.mint]);

console.log(balances.solLamports);
console.log(balances.tokenBalances);</code></pre>
      <p>The CLI keeps broad token scans opt-in. <code>slrd wallets</code> shows SOL by default, while <code>slrd balances --wallet &lt;wallet&gt;</code> can show SOL plus SPL holdings for one wallet.</p>
    `,
  },

  trading: {
    title: "Trading",
    nav: "Trading",
    eyebrow: "Route, simulate, send",
    description:
      "Trade through the registered venue layer using typed amounts, configurable slippage, and selectable transaction senders.",
    html: `
      <h2 id="buy">Buy</h2>
      <pre data-lang="ts"><code>import { createSolard, sol } from "@solard/sdk";

const slrd = createSolard();
await slrd.addToken("TOKEN_MINT");

const receipt = await slrd.buy(
  "TOKEN_MINT",
  "primary",
  sol(0.1),
  {
    slippageBps: 500,
    via: "rpc",
  },
);</code></pre>
      <p>A buy resolves the token route and sends a transaction. For a PumpSwap simulation error identified by the implementation as stale fee/pool state, Solard rebuilds the buy once with a fresh quote while preserving the requested slippage.</p>

      <h2 id="sell">Sell</h2>
      <pre data-lang="ts"><code>await slrd.sell("TOKEN_MINT", "primary", {
  bps: 5_000,
  slippageBps: 500,
  via: "rpc",
});</code></pre>
      <p><code>bps: 5_000</code> represents 50% where the selected sell path interprets the balance percentage in basis points.</p>

      <h2 id="sender-lanes">Sender lanes</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Sender</th><th>Use</th></tr></thead>
        <tbody>
          <tr><td><code>rpc</code></td><td>Normal RPC submission through Solana chain access.</td></tr>
          <tr><td><code>helius</code></td><td>Optional Helius sender lane when configured.</td></tr>
          <tr><td><code>jito</code></td><td>Optional Jito sender lane with block-engine configuration.</td></tr>
        </tbody>
      </table></div>

      <h2 id="simulation">Simulation behavior</h2>
      <p>Core transaction builders expose simulation before send, and several operational CLI commands offer <code>--simulate</code> before <code>--live</code>. Avoid <code>skipSimulation</code> and <code>skipPreflight</code> unless the calling workflow has a specific reason to bypass those checks.</p>
      <div class="callout danger">
        <div class="callout-title">Live execution moves assets</div>
        <p>Do not use documentation examples with production signing wallets until the token, wallet, route, amount, and sender configuration have been independently verified.</p>
      </div>
    `,
  },

  "history-events": {
    title: "History and events",
    nav: "History & events",
    eyebrow: "Replay and analysis",
    description:
      "Reconstruct canonical token activity, merge replay streams, inspect coverage, materialize trade history, and feed deterministic backtests from durable historical data.",
    html: `
      <h2 id="replay">Replay history</h2>
      <pre data-lang="ts"><code>const history = await slrd.history.replay("TOKEN_MINT", {
  provider: "auto",
});

if (!history.coverage.complete) {
  console.warn(history.coverage.warnings);
}</code></pre>
      <p>Replay results carry coverage metadata. Workflows that require complete attribution should check coverage explicitly rather than assuming an indexed provider returned the full history.</p>

      <h2 id="market-history">Market history</h2>
      <pre data-lang="ts"><code>const market = await slrd.history.market("TOKEN_MINT", {
  fromSlot: 0,
});</code></pre>
      <p>The core package also exports exact token-history analysis, forensic analysis, sparse one-second candle construction, historical backfill, and Pump/Raydium history support.</p>

      <h2 id="events">Event subscriptions</h2>
      <pre data-lang="ts"><code>const subscription = await slrd.events("TOKEN_MINT");

for await (const event of subscription) {
}</code></pre>
      <p>Multiple replay subscriptions or histories can be merged using the SDK's <code>events.merge()</code> and <code>history.merge()</code> helpers.</p>

      <h2 id="backtesting">Backtesting</h2>
      <p>Core includes deterministic strategy simulation over durable token-history tapes. The repository contains examples for ATH-dip profit ladders, target-weight policies, and batch historical research.</p>
      <pre data-lang="ts"><code>import { backtestTokenTrades } from "@solard/core";

const result = backtestTokenTrades(mint, strategy, {
  startingSol: 5,
  requireFromCreation: true,
  includeProcessed: false,
});</code></pre>
    `,
  },

  cli: {
    title: "CLI",
    nav: "CLI",
    eyebrow: "slrd / solard",
    description:
      "The CLI is the operational surface for wallets, contacts, token inspection, history, transfers, trading, launches, cleanup, strategies, and venue-specific workflows.",
    html: `
      <h2 id="wallets">Wallet and token commands</h2>
      <pre data-lang="shell"><code>slrd setup --status
slrd wallet create primary
slrd import --stdin maker
slrd wallets
slrd balances --wallet primary
slrd token TOKEN_MINT my-token
slrd token refresh my-token
slrd holders my-token</code></pre>

      <h2 id="history">History commands</h2>
      <pre data-lang="shell"><code>slrd token backfill TOKEN_MINT --materialize
slrd token trades TOKEN_MINT --from-start --limit 100
slrd token analyze TOKEN_MINT --top 20</code></pre>
      <p>Exact history materialization and analysis are separate from simple registry operations, which lets operators control when a potentially expensive history scan is performed.</p>

      <h2 id="transfer">Transfers</h2>
      <pre data-lang="shell"><code>slrd transfer treasury --wallet primary --sol 0.25
slrd transfer treasury --wallet primary --token USDC --amount 50</code></pre>
      <p>The transfer command requires exactly one SOL amount or token amount and supports <code>rpc</code>, <code>helius</code>, and <code>jito</code> sender selection.</p>

      <h2 id="safe-workflow">Recommended operational workflow</h2>
      <div class="steps">
        <section class="step"><h3>Inspect</h3><p>Resolve wallets, token metadata, balances, venue state, and history before constructing an execution plan.</p></section>
        <section class="step"><h3>Simulate</h3><p>Where a command supports simulation, run it and inspect the transaction-level result.</p></section>
        <section class="step"><h3>Enable live execution</h3><p>Only the process that is allowed to broadcast should have the live-trading environment switch enabled.</p></section>
        <section class="step"><h3>Execute and reconcile</h3><p>Capture signatures and verify resulting balances or durable state rather than treating request submission as final settlement.</p></section>
      </div>
    `,
  },

  venues: {
    title: "Venues",
    nav: "Venues",
    eyebrow: "Routing and integrations",
    description:
      "Core models execution venues, launch sources, launchpads, and claim sources as separate plugin categories so market routing and token creation remain distinct concepts.",
    html: `
      <h2 id="execution-venues">Execution venues</h2>
      <div class="card-grid">
        <div class="card"><span class="card-label">Pump</span><h3>Pump curve</h3><p>Bonding-curve market inspection, quoting, price sampling, buys, sells, launches, cleanup, and creator-fee tooling.</p></div>
        <div class="card"><span class="card-label">PumpSwap</span><h3>PumpSwap</h3><p>Post-curve trading support with venue-specific instruction construction and state handling.</p></div>
        <div class="card"><span class="card-label">Raydium</span><h3>Raydium</h3><p>Raydium service integration for quotes and execution paths, plus historical backfill support.</p></div>
        <div class="card"><span class="card-label">Meteora</span><h3>Meteora DLMM</h3><p>Pool discovery, positions, liquidity management, swaps, balances, and higher-level autonomous LP workflows.</p></div>
      </div>

      <h2 id="plugin-separation">Plugin separation</h2>
      <p><strong>Trade venues</strong> route and execute against existing markets. <strong>Launch sources</strong> discover token deployments. <strong>Launchpads</strong> prepare deployments and optionally pending buys before a market lands. <strong>Claim sources</strong> describe claimable payout flows.</p>

      <h2 id="route-resolution">Route resolution</h2>
      <p>The core package exposes a <code>VenueRegistry</code> and higher-level trade-route helpers. SDK users normally rely on <code>buy()</code>, <code>sell()</code>, and <code>samplePrice()</code> rather than manually selecting venue implementations.</p>
    `,
  },

  "meteora-autopilot": {
    title: "Meteora autopilot",
    nav: "Meteora autopilot",
    eyebrow: "Guarded LP automation",
    description:
      "A persistent autonomous Meteora DLMM workflow built around deterministic screening, explicit risk configuration, planning-first cycles, persistent lessons, and separately gated execution.",
    html: `
      <h2 id="cycle">Cycle model</h2>
      <p>The autopilot can inspect open positions, screen candidate pools, build management and deployment plans, retain structured decision history, and execute a full cycle. The read-only plan cycle never broadcasts transactions.</p>
      <div class="card-grid">
        <div class="card"><span class="card-label">screen</span><h3>Deterministic filters</h3><p>Hard filters and balanced scoring run before any model judgment.</p></div>
        <div class="card"><span class="card-label">manage</span><h3>Position plan</h3><p>Inspect PnL, fees, range state, health, and persistent position instructions.</p></div>
        <div class="card"><span class="card-label">remember</span><h3>Lessons and memory</h3><p>Persist actionable lessons, decisions, blacklists, and pool-memory summaries across cycles.</p></div>
        <div class="card"><span class="card-label">execute</span><h3>Explicit live gates</h3><p>Broadcasting requires an execution request, a live request, and the server-level live-trading switch.</p></div>
      </div>

      <h2 id="tools">Autopilot tool surface</h2>
      <div class="method"><div class="method-name">status</div><p>Read risk configuration, SOL balance, position count, memory counts, and last-cycle state.</p></div>
      <div class="method"><div class="method-name">configure</div><p>Persist partial screening, risk, strategy, management, and loop configuration.</p></div>
      <div class="method"><div class="method-name">context</div><p>Read policy context, lessons, recent decisions, position instructions, blacklist state, and pool memory.</p></div>
      <div class="method"><div class="method-name">screen</div><p>Run deterministic DLMM filters and candidate scoring.</p></div>
      <div class="method"><div class="method-name">management_plan</div><p>Build deterministic actions for all tracked open positions.</p></div>
      <div class="method"><div class="method-name">plan_cycle</div><p>Build a complete read-only management and deployment plan.</p></div>
      <div class="method"><div class="method-name">run_cycle</div><p>Run one autonomous cycle; execution is separately gated.</p></div>

      <h2 id="live-gates">Live gates</h2>
      <pre data-lang="text"><code>run_cycle({
  execute: true,
  live: true
})

SOLARD_ENABLE_LIVE_TRADES=1</code></pre>
      <div class="callout warn">
        <div class="callout-title">Keep deterministic risk outside model discretion</div>
        <p>Use model judgment only inside the boundaries established by hard screening and risk configuration. Planning and execution should remain auditable as separate stages.</p>
      </div>
    `,
  },

  safety: {
    title: "Safety model",
    nav: "Safety",
    eyebrow: "Keys, simulation, live gates",
    description:
      "The project includes several deliberate guardrails. This page collects the ones that matter most when moving from local development to live asset execution.",
    html: `
      <h2 id="wallet-encryption">Wallet encryption</h2>
      <p>Persisted keypairs are encrypted with AES-256-GCM using a random 12-byte nonce. The key material is derived from <code>SLRD_MASTER_KEY</code>. Wallet integrity tests verify that a different master key cannot mutate the existing signing-wallet database.</p>
      <div class="callout warn">
        <div class="callout-title">Use a high-entropy master key</div>
        <p>The current implementation hashes the configured master-key string with SHA-256. Treat the environment value as a generated random secret, not a memorable password.</p>
      </div>

      <h2 id="live-master-switch">Live-trading master switch</h2>
      <p>The environment defaults do not enable live trading. Guarded live workflows require <code>SOLARD_ENABLE_LIVE_TRADES=1</code> in addition to the command or API-level live intent.</p>

      <h2 id="web-auth">Web API authentication</h2>
      <p>The web console API expects <code>SOLARD_WEB_TOKEN</code> unless explicitly configured for open-web mode. For any control surface capable of moving funds, keep authentication enabled even when binding to loopback.</p>

      <h2 id="transaction-checks">Transaction checks</h2>
      <p>Simulation and preflight are first-class transaction options. Skipping them is possible in selected execution APIs, but should be treated as an advanced optimization rather than a default.</p>

      <h2 id="operational-checklist">Operational checklist</h2>
      <ul>
        <li>Keep signing wallets and external contacts conceptually separate.</li>
        <li>Use a dedicated high-entropy <code>SLRD_MASTER_KEY</code>.</li>
        <li>Keep the live-trading environment switch out of read-only processes.</li>
        <li>Prefer simulation and normal preflight before broadcasting.</li>
        <li>Protect local HTTP control planes with bearer authentication.</li>
        <li>Verify settlement from balances or durable state, not only from submission success.</li>
      </ul>
    `,
  },

  "api-surface": {
    title: "API surface",
    nav: "API surface",
    eyebrow: "Curated exports",
    description:
      "A compact reference for the public SDK exports and the broader core areas that application authors may choose when they need lower-level control.",
    html: `
      <h2 id="sdk-values">@solard/sdk value exports</h2>
      <div class="pill-row">
        <span class="pill">createSolard</span>
        <span class="pill">createTraderSolard</span>
        <span class="pill">formatRaw</span>
        <span class="pill">sol</span>
        <span class="pill">tokenAmount</span>
        <span class="pill">createPriceFeed</span>
        <span class="pill">connectPriceFeed</span>
      </div>

      <h2 id="sdk-types">Selected public types</h2>
      <div class="pill-row">
        <span class="pill">Solard</span><span class="pill">SolardOptions</span><span class="pill">WalletInfo</span><span class="pill">WalletRef</span><span class="pill">TokenRef</span><span class="pill">TokenRow</span><span class="pill">MarketPrice</span><span class="pill">MarketHistory</span><span class="pill">ReplayHistory</span><span class="pill">ReplayItem</span><span class="pill">TokenHolderSnapshot</span><span class="pill">SendReceipt</span><span class="pill">SenderId</span><span class="pill">SimulationResult</span><span class="pill">PriceFeedClient</span>
      </div>

      <h2 id="core-domains">@solard/core domains</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Domain</th><th>Representative exports</th></tr></thead>
        <tbody>
          <tr><td>Transactions</td><td><code>TransactionBuilder</code>, <code>TransactionComposer</code>, senders, simulation, transfer batching.</td></tr>
          <tr><td>History</td><td>Token-history backfill, replay merge, event history, forensic analysis, candle materialization.</td></tr>
          <tr><td>Trading</td><td>Trade-route resolution, Pump/PumpSwap, Raydium, Meteora DLMM.</td></tr>
          <tr><td>Launches</td><td>Launch sources, launchpads, Pump deployment, supported pairs, armed buyers, vanity mints.</td></tr>
          <tr><td>Accounting</td><td>Holder snapshots, portfolios, registry transfers, claims, cumulative distributions.</td></tr>
          <tr><td>Research</td><td>Strategy simulation, token backtests, target-weight backtests, historical research batches.</td></tr>
          <tr><td>Agents</td><td>Solard agent, GMGN facade, Meteora agent, intelligence layer, autopilot.</td></tr>
        </tbody>
      </table></div>

      <h2 id="which-package">Which package should I use?</h2>
      <p>Start with <code>@solard/sdk</code> for application code. Reach into <code>@solard/core</code> when you intentionally need transaction construction, venue services, launch tooling, repositories, backtesting internals, or agent/runtime APIs that are not part of the curated SDK membrane.</p>
    `,
  },
};
