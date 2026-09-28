import { Callout, CodeBlock, DocsPage } from "../_components/docs";

export default function SafetyPage() {
  return (
    <DocsPage
      eyebrow="Operational boundaries"
      title="Execution & safety"
      description="Solard has several transaction surfaces with different execution contracts. The safe way to automate it is to know which APIs execute immediately, which commands default to simulation or quote mode, and which guarded venue flows additionally require the process-level live switch."
    >
      <h2 id="wallet-password">Wallet encryption and the CLI password</h2>
      <p>
        Persisted signing keypairs are encrypted with AES-256-GCM. The
        encryption key is derived from <code>SLRD_MASTER_KEY</code> when that
        environment override is present. In the CLI, the normal interactive path
        instead asks for a wallet password for the current process and does not
        persist that password.
      </p>
      <CodeBlock language="shell">{`slrd setup --status

# Explicit automation/CI override:
SLRD_MASTER_KEY=your-long-random-secret`}</CodeBlock>
      <p>
        The key derivation in the supplied source hashes the configured string
        with SHA-256, so an environment override should be a high-entropy random
        secret rather than a memorable password.
      </p>

      <h2 id="sdk-execution">Public SDK execution semantics</h2>
      <p>
        The public <code>slrd.buy()</code>, <code>slrd.sell()</code>, and{" "}
        <code>claims.creatorFees.claim()</code> methods are execution methods.
        They do not have an SDK-level <code>live: false</code> default. Solard
        builds the transaction, performs its explicit simulation unless{" "}
        <code>skipSimulation</code> is set, sends it, and confirms it.
      </p>
      <Callout title="Simulation is not the same as dry-run">
        <p>
          On the direct SDK buy/sell path, simulation is a pre-send safety
          check, not a switch that prevents the subsequent send. If you want a
          non-broadcast workflow, build/quote through the appropriate
          lower-level core surface or use a CLI command's documented
          simulation/quote mode.
        </p>
      </Callout>

      <h2 id="cli-modes">CLI execution modes</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Family</th>
              <th>Default</th>
              <th>Broadcast control</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>buy</code>, <code>sell</code>, <code>transfer</code>
              </td>
              <td>Execute</td>
              <td>
                <code>--simulate-only</code> prevents broadcast.
              </td>
            </tr>
            <tr>
              <td>
                <code>unwrap-wsol</code>
              </td>
              <td>Execute</td>
              <td>
                <code>--simulate-only</code> simulates each account close.
              </td>
            </tr>
            <tr>
              <td>
                <code>rewards claim</code> / <code>claim</code>
              </td>
              <td>Execute</td>
              <td>
                Creator claim is a signing/broadcast operation; simulation is
                pre-send unless skipped.
              </td>
            </tr>
            <tr>
              <td>
                <code>swap</code>
              </td>
              <td>Quote-only</td>
              <td>
                <code>--live</code> executes Jupiter swap.
              </td>
            </tr>
            <tr>
              <td>
                <code>sweep</code>, <code>liquidate</code>
              </td>
              <td>Preview</td>
              <td>
                <code>--simulate</code> or <code>--live</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>reclaim</code>
              </td>
              <td>Inspect</td>
              <td>
                <code>--simulate</code> or <code>--live</code>; program closure
                needs <code>--confirm-program-close</code>.
              </td>
            </tr>
            <tr>
              <td>Meteora / Raydium writes</td>
              <td>Prepare/simulate</td>
              <td>
                <code>--live</code> plus{" "}
                <code>SOLARD_ENABLE_LIVE_TRADES=1</code>.
              </td>
            </tr>
            <tr>
              <td>Spam-buy, selected launch/strategy flows</td>
              <td>Watch/plan</td>
              <td>
                <code>--live</code> on the commands that expose it.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="live-gate">Process-level live gate</h2>
      <CodeBlock language="dotenv">{`SOLARD_ENABLE_LIVE_TRADES=1`}</CodeBlock>
      <p>
        This is an additional guard used by specific high-risk runtime/venue
        flows, including Meteora writes and Raydium writes. It is not a
        universal switch checked by every direct SDK or CLI transaction path, so
        do not rely on it as the only safety boundary.
      </p>

      <h2 id="simulation-preflight">Simulation and preflight</h2>
      <p>
        Core transaction submission explicitly simulates before sending unless{" "}
        <code>skipSimulation</code> is true. Sender submission then receives{" "}
        <code>skipPreflight</code>, which core defaults to true for its sender
        call when no value is provided. Several CLI paths intentionally keep
        preflight enabled or derive <code>skipPreflight</code> from{" "}
        <code>--skip-simulation</code>; consult each command reference rather
        than assuming uniform behavior.
      </p>

      <h2 id="web-auth">Web control surfaces</h2>
      <CodeBlock language="dotenv">{`SOLARD_WEB_TOKEN=your-local-api-token
# SOLARD_ALLOW_OPEN_WEB=1`}</CodeBlock>
      <p>
        The provided environment file describes web-console API authentication
        as required unless open-web mode is explicitly enabled. A
        signing/trading HTTP surface should remain authenticated even when
        deployed on a local or private network.
      </p>

      <Callout
        title="Use separate runtimes for read and write duties"
        tone="warn"
      >
        <p>
          A process with wallet decryption capability, funded wallets, RPC
          access, and an executing command/API can move assets. Keep indexing,
          docs, feeds, and analysis processes separate from the smallest runtime
          that actually needs signing authority.
        </p>
      </Callout>
    </DocsPage>
  );
}
