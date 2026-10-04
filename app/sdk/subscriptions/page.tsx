import { CodeBlock, DocsPage } from "../../_components/docs";

const example = `#!/usr/bin/env bun
import { Connection } from "@solana/web3.js";
import { configure, createMeasure } from "measure-fn";
import {
  subscribeLaunches,
  subscribeMigrations,
  subscribeTrades,
  type TradeEvent,
} from "@solard/sdk";

configure({ silent: false });
const m = createMeasure("slrd:subscriptions-example", {
  maxResultLength: 2400,
});

function rpcUrl(): string {
  const value =
    process.env.RPC_ENDPOINT?.trim() ??
    process.env.SOLANA_RPC_URL?.trim() ??
    process.env.HELIUS_RPC_URL?.trim();
  if (!value) {
    throw new Error(
      "Set RPC_ENDPOINT, SOLANA_RPC_URL, or HELIUS_RPC_URL before running this example.",
    );
  }
  return value;
}

function printableTrade(event: TradeEvent) {
  return {
    ...event,
    baseRaw: event.baseRaw?.toString() ?? null,
    quoteRaw: event.quoteRaw?.toString() ?? null,
    virtualBaseRaw: event.virtualBaseRaw?.toString() ?? null,
    virtualQuoteRaw: event.virtualQuoteRaw?.toString() ?? null,
  };
}

const wsEndpoint =
  process.env.SOLANA_WS_URL?.trim() ?? process.env.HELIUS_WS_URL?.trim();
const connection = new Connection(
  rpcUrl(),
  wsEndpoint ? { commitment: "confirmed", wsEndpoint } : "confirmed",
);
const controller = new AbortController();

const trades = await subscribeTrades({
  connection,
  tokens: [],
  metadata: false,
  signal: controller.signal,
  onTrade(event) {
    const value = printableTrade(event);
    m.sync(
      { start: () => "trade", end: (result: typeof value) => result },
      () => value,
    );
  },
});

const migrations = await subscribeMigrations({
  connection,
  tokens: [],
  metadata: "chain",
  signal: controller.signal,
  async onMigration(event) {
    m.sync(
      { start: () => "migration", end: (result: typeof event) => result },
      () => event,
    );
    await trades.addTokens(event.mint);
  },
});

const launches = await subscribeLaunches({
  connection,
  metadata: "chain",
  signal: controller.signal,
  async onLaunch(event) {
    if (event.isMayhemMode === true) return;
    m.sync(
      { start: () => "launch", end: (result: typeof event) => result },
      () => event,
    );
    await migrations.addTokens(event.mint);
  },
});

m.sync(
  {
    start: () => "listening",
    end: (value: Record<string, unknown>) => value,
  },
  () => ({
    flow: "launch -> migration -> trades",
    mayhem: "ignored",
    launchMetadata: "chain",
    migrationMetadata: "chain",
    tradeMetadata: false,
  }),
);

const stop = () => controller.abort();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);

try {
  await Promise.all([launches.closed, migrations.closed, trades.closed]);
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
  await Promise.allSettled([
    launches.close(),
    migrations.close(),
    trades.close(),
  ]);
}`;

export default function SdkSubscriptionsPage() {
  return (
    <DocsPage
      title="Subscriptions"
      description="Live launch, migration, and trade events."
    >
      <h2 id="apis">APIs</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>API</th>
              <th>Scope</th>
              <th>
                <code>addTokens()</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>subscribeLaunches()</code>
              </td>
              <td>Global</td>
              <td>Not needed</td>
            </tr>
            <tr>
              <td>
                <code>subscribeMigrations()</code>
              </td>
              <td>Global</td>
              <td>Updates the local interest set</td>
            </tr>
            <tr>
              <td>
                <code>subscribeTrades()</code>
              </td>
              <td>Per token</td>
              <td>Adds logical Solana log subscriptions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        One Solana <code>Connection</code> can carry many logical subscriptions.
        Watching more trade mints increases subscription count even when the
        transport stays the same.
      </p>

      <h2 id="example">Launch → migration → trades</h2>
      <CodeBlock language="ts">{example}</CodeBlock>

      <h2 id="flow">Flow</h2>
      <CodeBlock language="text">{`launch
  └─ accepted → migrations.addTokens(mint)
migration
  └─ observed → trades.addTokens(mint)
trade
  └─ onTrade(event)`}</CodeBlock>
      <p>
        The handles are created in the opposite order—trades, migrations,
        launches—because each upstream callback needs the downstream handle.
      </p>

      <h2 id="lifecycle">Lifecycle</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>Connection</code>
              </td>
              <td>Application-owned RPC and WebSocket transport.</td>
            </tr>
            <tr>
              <td>
                <code>AbortController</code>
              </td>
              <td>One cancellation signal for all streams.</td>
            </tr>
            <tr>
              <td>
                <code>closed</code>
              </td>
              <td>Promise that resolves when a stream ends.</td>
            </tr>
            <tr>
              <td>
                <code>close()</code>
              </td>
              <td>Stops a stream and releases its subscriptions.</td>
            </tr>
            <tr>
              <td>
                <code>Promise.allSettled()</code>
              </td>
              <td>Attempts every cleanup even if one close fails.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="metadata">Metadata</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Value</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>false</code>
              </td>
              <td>Decoded event only.</td>
            </tr>
            <tr>
              <td>
                <code>"chain"</code>
              </td>
              <td>Add on-chain metadata.</td>
            </tr>
            <tr>
              <td>
                <code>"full"</code>
              </td>
              <td>Add external metadata when available.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The example keeps trades unenriched because they are high-frequency,
        while launch and migration events use chain metadata.
      </p>

      <h2 id="policy">Policy</h2>
      <p>
        <code>isMayhemMode</code> is event data. The line{" "}
        <code>if (event.isMayhemMode === true) return</code> is application
        policy. <code>printableTrade()</code> is presentation code: it converts{" "}
        <code>bigint</code> values only when logging them.
      </p>

      <h2 id="servers">Servers</h2>
      <p>
        HTTP routes, WebSocket client protocols, auth, fan-out, persistence,
        backpressure, and health checks belong above these subscriptions.
      </p>
    </DocsPage>
  );
}
