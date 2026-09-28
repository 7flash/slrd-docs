import { Callout, Cards, Card, CodeBlock, DocsPage } from "../_components/docs";

export default function CliPage() {
  return (
    <DocsPage
      eyebrow="slrd"
      title="CLI overview"
      description="The CLI is the operational surface for wallet management, token history, market feeds, trading, launches, durable payouts, strategies, and venue-specific tools. The most important rule is that not every write command uses the same live/simulation switch."
    >
      <h2 id="help-version">Help and version</h2>
      <CodeBlock language="shell">{`slrd help
slrd --help
slrd version
slrd --version
slrd -v`}</CodeBlock>
      <p>
        The top-level help groups the command surface by operational domain.
        This documentation expands those terse usage lines into command
        behavior, defaults, and execution semantics.
      </p>

      <h2 id="execution-model">Execution model</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Command family</th>
              <th>Default behavior</th>
              <th>How to avoid / enable broadcast</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>buy</code>, <code>sell</code>, <code>transfer</code>
              </td>
              <td>Live execution</td>
              <td>
                Use <code>--simulate-only</code> to prevent broadcast.
              </td>
            </tr>
            <tr>
              <td>
                <code>unwrap-wsol</code>, <code>claim</code>,{" "}
                <code>rewards claim</code>
              </td>
              <td>Live execution</td>
              <td>
                Use command-specific simulation options where available; creator
                claim supports skip-simulation/preflight controls but is
                fundamentally an execution command.
              </td>
            </tr>
            <tr>
              <td>
                <code>swap</code>
              </td>
              <td>Quote-only</td>
              <td>
                Add <code>--live</code> to execute.
              </td>
            </tr>
            <tr>
              <td>
                <code>sweep</code>, <code>liquidate</code>, <code>reclaim</code>
              </td>
              <td>Preview / inspect</td>
              <td>
                Use <code>--simulate</code> or <code>--live</code>; program
                reclaim also requires explicit program-close confirmation.
              </td>
            </tr>
            <tr>
              <td>Meteora / Raydium writes</td>
              <td>Prepare / simulation</td>
              <td>
                Add <code>--live</code>; live venue writes also require the
                process-level live-trading gate.
              </td>
            </tr>
            <tr>
              <td>Launch / deploy / strategy / spam flows</td>
              <td>Plan/watch unless live is requested</td>
              <td>
                Use <code>--live</code> on the commands that expose it.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout title="Do not assume --live is a global CLI rule" tone="warn">
        <p>
          The direct buy/sell/transfer paths are intentionally different from
          the guarded venue/automation families. When scripting the CLI, treat
          each command's documented mode as part of its API contract.
        </p>
      </Callout>

      <h2 id="wallet-password">Signing vault behavior</h2>
      <p>
        Signing commands initialize the ephemeral wallet-password vault before
        execution. The interactive password is not persisted;{" "}
        <code>SLRD_MASTER_KEY</code> is the explicit environment override for
        automation/CI. Read-only commands do not need the signing vault.
      </p>
      <CodeBlock language="shell">{`slrd setup --status
slrd wallet create main
slrd balances --wallet main`}</CodeBlock>

      <h2 id="diagnostics">Diagnostics and RPC policy</h2>
      <p>
        The CLI collects measure-fn telemetry without streaming every span by
        default.
      </p>
      <CodeBlock language="shell">{`slrd price TOKEN --measure
slrd price TOKEN --measure-stream`}</CodeBlock>
      <ul>
        <li>
          <code>--measure</code> prints aggregate timing summaries after normal
          command output.
        </li>
        <li>
          <code>--measure-stream</code> restores raw live measure-fn output for
          low-level debugging.
        </li>
        <li>
          Solard JSON-RPC traffic is globally limited to 5 requests/second by
          default; <code>SLRD_RPC_MAX_RPS</code> overrides it.
        </li>
        <li>
          Fetch-level network failures retry four times by default;{" "}
          <code>SLRD_RPC_NETWORK_RETRIES</code> overrides the retry count.
        </li>
        <li>
          Jupiter fallback is rate-limited separately;{" "}
          <code>SLRD_JUPITER_MAX_RPS</code> controls its maximum request rate.
        </li>
      </ul>

      <h2 id="reference">Command reference</h2>
      <Cards>
        <Card href="/cli/wallets-tokens" label="CLI" title="Wallets & tokens">
          Wallet vault, import/export, contacts, balances, token registry,
          backfill, holders, events, and vanity mints.
        </Card>
        <Card href="/cli/market-data" label="CLI" title="Market data & history">
          Shared feed, launch/Pump discovery, quotes, prices, backtests, and
          transaction streams.
        </Card>
        <Card href="/cli/trading" label="CLI" title="Trading & operations">
          Transfers, swaps, buy/sell, sweep, liquidation, WSOL, reclaim, claims,
          durable batches, and rewards.
        </Card>
        <Card href="/cli/launching" label="CLI" title="Launching & metadata">
          Pump launch/prepare/deploy, metadata upload, vamp, and pooled vanity
          mints.
        </Card>
        <Card href="/cli/automation" label="CLI" title="Automation & agents">
          Scripts, strategy files, groups, agents, watches, Jito helpers, and
          ALTs.
        </Card>
        <Card href="/cli/meteora" label="CLI" title="Meteora DLMM">
          Every documented pool, position, claim, migration, quote, and swap
          command.
        </Card>
        <Card href="/cli/raydium" label="CLI" title="Raydium">
          Exact-input swaps, LaunchLab, and CPMM pool creation.
        </Card>
      </Cards>

      <h2 id="compatibility-aliases">Compatibility aliases</h2>
      <p>
        The implementation retains several compatibility forms, including{" "}
        <code>solard</code> and <code>slrd</code> as the same binary,{" "}
        <code>pump watch</code> as the Pump-only launch watcher,{" "}
        <code>sweep sol</code>, positional SOL→token <code>swap</code>,{" "}
        <code>send-sol</code> through the transfer handler,{" "}
        <code>buy-spam</code>, and <code>unwrap wsol</code>.
      </p>
    </DocsPage>
  );
}
