import { CodeBlock, DocsPage } from "../_components/docs";

export default function SafetyPage() {
  return (
    <DocsPage
      title="Execution & safety"
      description="What can sign, simulate, or broadcast."
    >
      <h2 id="wallets">Wallets</h2>
      <p>
        Signing and secret export are different capabilities. Solard can sign
        with a stored wallet without exposing its private key or signer object.
      </p>
      <p>
        Interactive CLI signing can prompt for the wallet password. Automation
        can set <code>SLRD_MASTER_KEY</code>.
      </p>

      <h2 id="modes">Modes</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mode</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paper</td>
              <td>Simulated application fills; no funded transaction.</td>
            </tr>
            <tr>
              <td>Simulation</td>
              <td>Real transaction simulation; no broadcast.</td>
            </tr>
            <tr>
              <td>Live</td>
              <td>Sign and broadcast.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cli">CLI defaults</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Commands</th>
              <th>Default</th>
              <th>Override</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>buy</code>, <code>sell</code>, <code>transfer</code>,{" "}
                <code>unwrap-wsol</code>
              </td>
              <td>Execute</td>
              <td>
                <code>--simulate-only</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>swap</code>
              </td>
              <td>Quote</td>
              <td>
                <code>--live</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>sweep</code>, <code>liquidate</code>, <code>reclaim</code>
              </td>
              <td>Preview / inspect</td>
              <td>
                <code>--simulate</code> or <code>--live</code>
              </td>
            </tr>
            <tr>
              <td>Meteora and Raydium writes</td>
              <td>Prepare / simulate</td>
              <td>
                <code>--live</code> + master switch
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="live-gate">Live gate</h2>
      <CodeBlock language="dotenv">{`SOLARD_ENABLE_LIVE_TRADES=1`}</CodeBlock>
      <p>
        Required by guarded families such as Meteora and Raydium. It is not a
        universal gate for direct execution commands.
      </p>

      <h2 id="web">Web API</h2>
      <CodeBlock language="dotenv">{`SOLARD_WEB_TOKEN=your-local-api-token
SOLARD_ALLOW_OPEN_WEB=1`}</CodeBlock>
      <p>Token auth is required unless open-web mode is explicitly enabled.</p>
    </DocsPage>
  );
}
