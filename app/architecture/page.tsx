import { CodeBlock, DocsPage } from "../_components/docs";

export default function ArchitecturePage() {
  return (
    <DocsPage
      title="Architecture"
      description="Where Solard stops and application code begins."
    >
      <h2 id="layers">Layers</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Owns</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Application</td>
              <td>Policy, strategy, UI, servers, process topology.</td>
            </tr>
            <tr>
              <td>
                <code>@solard/sdk</code>
              </td>
              <td>Wallet, market, execution, history, payout capabilities.</td>
            </tr>
            <tr>
              <td>
                <code>@solard/core</code>
              </td>
              <td>Protocol decoding, persistence, transaction machinery.</td>
            </tr>
            <tr>
              <td>Solana</td>
              <td>Accounts, programs, RPC, WebSocket transport.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="surface">Public surface</h2>
      <p>
        SDK methods describe intent: <code>buy()</code>,{" "}
        <code>subscribeTrades()</code>, <code>snapshotHolders()</code>. Signers,
        repositories, raw layouts, and transport details stay below that
        boundary.
      </p>
      <CodeBlock language="text">{`application:  buy this token
sdk:          route · build · sign · simulate · submit · confirm
core:         protocol and persistence details`}</CodeBlock>

      <h2 id="subscriptions">Subscriptions</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>API</th>
              <th>Scope</th>
              <th>Cost of adding a token</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>subscribeLaunches()</code>
              </td>
              <td>Global</td>
              <td>None</td>
            </tr>
            <tr>
              <td>
                <code>subscribeMigrations()</code>
              </td>
              <td>Global + local filter</td>
              <td>Filter update</td>
            </tr>
            <tr>
              <td>
                <code>subscribeTrades()</code>
              </td>
              <td>Token-specific</td>
              <td>Logical Solana log subscription</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A single Solana <code>Connection</code> can carry many logical
        subscriptions. Transport count and subscription count are different
        resource limits.
      </p>

      <h2 id="enrichment">Enrichment</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Metadata</th>
              <th>Work</th>
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
              <td>Add on-chain identity data.</td>
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
        Detection stays on the fast path. Metadata, transaction enrichment,
        pricing, and USD conversion are separate work.
      </p>

      <h2 id="events">Event semantics</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Consequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Protocol truth</td>
              <td>
                A migration event means an observed migration, not a
                post-migration heuristic.
              </td>
            </tr>
            <tr>
              <td>Facts, not policy</td>
              <td>
                The SDK reports <code>isMayhemMode</code>; the application
                decides whether to ignore it.
              </td>
            </tr>
            <tr>
              <td>Cache by lifetime</td>
              <td>
                Reuse identity metadata; do not treat high-frequency trades as
                identity cache data.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="security">Security</h2>
      <p>
        Signing authority and secret export are separate capabilities. Solard
        can sign through a stored wallet without exposing the wallet secret.
        Application code should not widen the SDK surface by casting to internal
        signer types.
      </p>

      <h2 id="execution">Execution</h2>
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
              <td>Application-side simulated fills.</td>
            </tr>
            <tr>
              <td>Simulation</td>
              <td>
                Build a real transaction and simulate it; do not broadcast.
              </td>
            </tr>
            <tr>
              <td>Live</td>
              <td>Sign and broadcast.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Paper and live execution should be explicit application states, not
        interchangeable implementations behind the same hidden switch.
      </p>

      <h2 id="providers">Providers</h2>
      <p>
        Discovery, runtime market data, and execution may use different
        providers. A search UI can use an external index while live trades and
        execution stay on Solard.
      </p>

      <h2 id="configuration">Configuration</h2>
      <CodeBlock language="text">{`UI → validation → stored state → worker → strategy → execution`}</CodeBlock>
      <p>
        A setting only exists operationally if it reaches the component that
        uses it.
      </p>

      <h2 id="servers">Servers and examples</h2>
      <p>
        Ports, HTTP routes, auth, client protocols, backpressure, and process
        topology belong to applications. Examples compose SDK primitives to show
        connection ownership, dynamic token sets, and shutdown.
      </p>
    </DocsPage>
  );
}
