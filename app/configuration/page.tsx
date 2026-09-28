import { Callout, CodeBlock, DocsPage } from "../_components/docs";

export default function ConfigurationPage() {
  return (
    <DocsPage
      eyebrow="Environment"
      title="Configuration"
      description="Runtime configuration used by the CLI and SDK: storage, wallet encryption, RPC limits, sender lanes, guarded live execution, lifecycle workers, metadata services, and venue-specific endpoints."
    >
      <h2 id="storage-vault">Database and wallet vault</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default / alias</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SLRD_DB_PATH</code>
              </td>
              <td>
                <code>~/.solard/solard.sqlite</code>
              </td>
              <td>
                Shared SDK/CLI SQLite database. <code>SOLARD_DB_PATH</code> is
                accepted as an alias.
              </td>
            </tr>
            <tr>
              <td>
                <code>SLRD_MASTER_KEY</code>
              </td>
              <td>unset</td>
              <td>
                Explicit wallet-encryption/signing key for CI or automation. The
                CLI otherwise prompts for an ephemeral wallet password on
                signing commands and does not persist that password.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout title="SLRD_MASTER_KEY is an automation override, not a normal CLI requirement">
        <p>
          The CLI's interactive path is designed to unlock persisted signing
          wallets for the current invocation without storing the password.
          SDK/server automation that cannot prompt should provide{" "}
          <code>SLRD_MASTER_KEY</code>.
        </p>
      </Callout>

      <h2 id="rpc">RPC and indexed history</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>RPC_ENDPOINT</code>
              </td>
              <td>—</td>
              <td>Primary Solana JSON-RPC endpoint for chain operations.</td>
            </tr>
            <tr>
              <td>
                <code>HELIUS_RPC_URL</code>
              </td>
              <td>—</td>
              <td>
                Helius RPC endpoint used by ordinary Helius-RPC execution paths
                and as an available chain endpoint.
              </td>
            </tr>
            <tr>
              <td>
                <code>HELIUS_API_KEY</code>
              </td>
              <td>—</td>
              <td>
                Helius API key used by integrations that construct Helius
                endpoints from a key.
              </td>
            </tr>
            <tr>
              <td>
                <code>SLRD_RPC_MAX_RPS</code>
              </td>
              <td>
                <code>5</code>
              </td>
              <td>
                Global maximum Solard JSON-RPC request rate. Increase only when
                the provider permits it.
              </td>
            </tr>
            <tr>
              <td>
                <code>SLRD_RPC_NETWORK_RETRIES</code>
              </td>
              <td>
                <code>4</code>
              </td>
              <td>
                Retries for fetch-level failures such as connection resets or
                socket closure.
              </td>
            </tr>
            <tr>
              <td>
                <code>SOLSCAN_API_KEY</code>
              </td>
              <td>unset</td>
              <td>
                Optional indexed provider for authoritative historical transfer
                reconstruction.
              </td>
            </tr>
            <tr>
              <td>
                <code>SLRD_JUPITER_MAX_RPS</code>
              </td>
              <td>keyless 0.5 req/s; keyed path defaults to 1 req/s</td>
              <td>Maximum request rate for Jupiter fallback/quote traffic.</td>
            </tr>
            <tr>
              <td>
                <code>SOLARD_EXTERNAL_HTTP_TIMEOUT_MS</code>
              </td>
              <td>
                <code>10000</code> in the example environment
              </td>
              <td>
                Timeout used by optional external HTTP intelligence/data
                integrations.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="live-trading">Guarded live-trading switch</h2>
      <CodeBlock language="dotenv">{`SOLARD_ENABLE_LIVE_TRADES=1
# Legacy aliases accepted by parts of the runtime:
# SOLWAL_ENABLE_LIVE_TRADES=1
# SLRD_ENABLE_LIVE_TRADES=1`}</CodeBlock>
      <p>
        This is the process-level master switch used by guarded execution
        families such as Meteora, Raydium, durable transfer-many/reward
        distribution flows, and other explicitly gated runtime paths. It is{" "}
        <strong>not</strong> a universal switch around every direct SDK or CLI
        send method: for example, the ordinary <code>slrd buy</code>,{" "}
        <code>sell</code>, and <code>transfer</code> commands have their own
        live-by-default semantics and use <code>--simulate-only</code> to avoid
        submission.
      </p>

      <h2 id="senders">Sender lanes</h2>
      <CodeBlock language="dotenv">{`HELIUS_SENDER_URL=...
HELIUS_TIP_ACCOUNT=...
HELIUS_TIP_LAMPORTS=...
HELIUS_PRIORITY_MICRO_LAMPORTS=...
JITO_BLOCK_ENGINE_URL=https://mainnet.block-engine.jito.wtf`}</CodeBlock>
      <p>
        Transaction APIs that accept a sender id can use paths such as{" "}
        <code>rpc</code>, <code>helius</code>, and <code>jito</code>. The
        required environment depends on the chosen sender.{" "}
        <code>JITO_BLOCK_ENGINE_URL</code> is only needed when explicitly
        selecting the separate Jito sender.
      </p>

      <h2 id="web-console">Web console API</h2>
      <CodeBlock language="dotenv">{`SOLARD_WEB_TOKEN=your-local-api-token
# Legacy alias:
# SOLWAL_WEB_TOKEN=your-local-api-token
# Explicitly disable token auth only when intended:
# SOLARD_ALLOW_OPEN_WEB=1`}</CodeBlock>
      <p>
        The web console API expects bearer-token authentication unless open-web
        mode is explicitly enabled.
      </p>

      <h2 id="pump-lifecycle">Pump lifecycle</h2>
      <CodeBlock language="dotenv">{`SOLARD_PUMP_WS_CONNECTIONS=5
SOLARD_PUMP_SUBSCRIPTIONS_PER_CONNECTION=1000
SOLARD_PUMP_MAX_TRACKED_TOKENS=5000
SOLARD_PUMP_LIFECYCLE_REFRESH_MS=2000
SOLARD_PUMP_ACTIVE_WINDOW_MS=3600000
SOLARD_PUMP_CURVE_POLL_MS=5000
SOLARD_PUMP_CURVE_REPAIR_POLL_MS=60000
SOLARD_PUMP_REQUIRE_INTEREST_SIGNAL=false
SOLARD_PUMP_INTEREST_WINDOW_MS=1800000
SOLARD_PUMP_MIN_INTEREST_SCORE=0`}</CodeBlock>
      <p>
        These settings control the primary Pump lifecycle worker's websocket
        fan-out, tracked-token cap, refresh cadence, active window, curve
        polling/repair, and optional interest-signal filter.
      </p>

      <h2 id="pumpswap-lifecycle">PumpSwap lifecycle</h2>
      <CodeBlock language="dotenv">{`SOLARD_PUMPSWAP_WS_CONNECTIONS=5
SOLARD_PUMPSWAP_SUBSCRIPTIONS_PER_CONNECTION=1000
SOLARD_PUMPSWAP_MAX_TRACKED_TOKENS=5000
SOLARD_PUMPSWAP_LIFECYCLE_REFRESH_MS=2000
SOLARD_PUMPSWAP_ACTIVE_WINDOW_MS=86400000
SOLARD_PUMPSWAP_REPAIR_POLL_MS=60000
SOLARD_PUMPSWAP_HISTORY_MS=0`}</CodeBlock>

      <h2 id="meteora">Meteora DLMM</h2>
      <CodeBlock language="dotenv">{`METEORA_DLMM_CLUSTER=mainnet-beta
METEORA_DLMM_DATA_API_URL=https://dlmm.datapi.meteora.ag
METEORA_POOL_DISCOVERY_API_URL=https://pool-discovery-api.datapi.meteora.ag`}</CodeBlock>
      <p>
        These read endpoints can be overridden for proxied or self-hosted
        deployments. Meteora write methods additionally require explicit live
        intent and the guarded live-trading switch documented above.
      </p>

      <h2 id="metadata">Metadata upload</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Default</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SLRD_METADATA_UPLOADER</code>
              </td>
              <td>
                <code>pump-frontend</code>
              </td>
              <td>
                Select the default metadata uploader used by CLI metadata/launch
                flows.
              </td>
            </tr>
            <tr>
              <td>
                <code>PUMP_IPFS_ENDPOINT</code>
              </td>
              <td>
                <code>https://pump.fun/api/ipfs</code>
              </td>
              <td>Browser-facing Pump metadata upload endpoint.</td>
            </tr>
            <tr>
              <td>
                <code>PINATA_JWT</code>
              </td>
              <td>unset</td>
              <td>
                Required when explicitly using the Pinata provider or Pinata
                fallback.
              </td>
            </tr>
            <tr>
              <td>
                <code>IPFS_PUBLIC_GATEWAY</code>
              </td>
              <td>
                <code>https://ipfs.io/ipfs</code>
              </td>
              <td>Public gateway used for Pinata-returned metadata URLs.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="launch-policy">Launch transport policy</h2>
      <p>
        <code>SLRD_LAUNCH_*</code> variables define resend and timeout policy
        shared by launch execution. Helius launch paths also use the
        tip/priority variables above. These are transport/runtime settings
        rather than token metadata.
      </p>

      <h2 id="gmgn">Optional GMGN intelligence</h2>
      <CodeBlock language="dotenv">{`GMGN_API_KEY=...
GMGN_API_URL=https://openapi.gmgn.ai
SOLARD_EXTERNAL_HTTP_TIMEOUT_MS=10000`}</CodeBlock>
      <p>
        The GMGN integration in this codebase is read-only for
        token/security/holder/trader/kline/trending/signal/gas data. Signed GMGN
        swap or order execution is intentionally not supported.
      </p>
    </DocsPage>
  );
}
