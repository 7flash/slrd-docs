import { CodeBlock, DocsPage } from "../../_components/docs";
import { ApiRef } from "../../_components/reference";

export default function SdkPriceFeedPage() {
  return (
    <DocsPage
      eyebrow="SDK reference"
      title="Shared price feed"
      description="The SDK exposes both a low-level reconnecting WebSocket client and a higher-level shared listener API for launch and price events produced by slrd feed serve."
    >
      <h2 id="messages">Message protocol</h2>
      <CodeBlock language="ts">{`type PriceFeedVenue =
  | "pump"
  | "pumpswap"
  | "raydium-launchlab"
  | "rpc-fallback";

type PriceFeedLaunch = {
  type: "launch";
  atMs: number;
  signature: string | null;
  slot: number | null;
  mint: string;
  venue: "pump" | "raydium-launchlab";
  decimals: number;
  supplyUi: number;
  quoteMint: string | null;
  pool: string | null;
  name: string | null;
  symbol: string | null;
  isMayhemMode: boolean | null;
};

type PriceFeedPrice = {
  type: "price";
  atMs: number;
  signature: string | null;
  slot: number | null;
  mint: string;
  venue: PriceFeedVenue;
  priceSol: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  source: string;
};

type PriceFeedStatus = {
  type: "status";
  atMs: number;
  event: string;
  data?: Record<string, unknown>;
};

type PriceFeedCommand =
  | { op: "subscribe"; mints?: string[]; launches?: boolean; allPrices?: boolean }
  | { op: "unsubscribe"; mints?: string[] }
  | { op: "ping" };

type PriceFeedMessage = PriceFeedLaunch | PriceFeedPrice | PriceFeedStatus;`}</CodeBlock>

      <h2 id="connect-price-feed">Low-level client</h2>
      <ApiRef
        id="connect"
        name="connectPriceFeed"
        signature={`connectPriceFeed({\n  url,\n  subscribe,\n  onMessage,\n  onStatus?,\n  signal?,\n}): Promise<PriceFeedClient>`}
        summary="Connect to a Solard feed WebSocket, send the desired subscription, automatically reconnect, and dispatch typed messages."
        behavior={[
          "The handshake has a 5-second timeout. Initial connection waits up to roughly 6 seconds before rejecting with a message that suggests starting slrd feed serve.",
          "After disconnects, the client reconnects with exponential delay beginning at 250 ms and capped at 10 seconds. Desired mint/launch/all-price subscription state is remembered across reconnects.",
        ]}
        parameters={[
          {
            name: "url",
            type: "string",
            description: "WebSocket URL, typically ws://127.0.0.1:8788/ws.",
          },
          {
            name: "subscribe",
            type: "subscribe command",
            description: "Initial mint/launch/all-price subscription.",
          },
          {
            name: "onMessage",
            type: "(message) => void|Promise<void>",
            description: "Typed message callback.",
          },
          {
            name: "onStatus",
            type: "callback?",
            description: "Connection/reconnect/callback-error status hook.",
          },
          {
            name: "signal",
            type: "AbortSignal?",
            description: "Abort and close the client.",
          },
        ]}
        returns="PriceFeedClient with connected, send(), subscribeMints(), unsubscribeMints(), close(), and closed."
      />
      <CodeBlock language="ts">{`const client = await connectPriceFeed({
  url: "ws://127.0.0.1:8788/ws",
  subscribe: { op: "subscribe", mints: [mint], launches: true },
  onMessage(message) {
    console.log(message.type, message);
  },
});

client.subscribeMints([anotherMint]);
client.unsubscribeMints([mint]);
client.close();
await client.closed;`}</CodeBlock>

      <h2 id="create-price-feed">Shared listener API</h2>
      <ApiRef
        id="create"
        name="createPriceFeed"
        signature={`createPriceFeed(options?: {\n  url?: string;\n  onStatus?: (event: string, data?: Record<string, unknown>) => void;\n  signal?: AbortSignal;\n}): Promise<SharedPriceFeed>`}
        summary="Create a higher-level shared feed that reference-counts mint subscriptions and fans messages out to listeners."
        behavior={[
          "The default URL is ws://127.0.0.1:8788/ws.",
          "watchPrice registers one mint, watchPrices registers several, watchLaunches subscribes to launch messages, latest returns the most recent price cached for a mint, and each watch method returns an unsubscribe function.",
        ]}
        returns="SharedPriceFeed { connected, watchPrice, watchPrices, watchLaunches, latest, close, closed }."
      />
      <CodeBlock language="ts">{`const feed = await createPriceFeed();
const stop = feed.watchPrice(mint, (price) => {
  console.log(price.priceSol, price.marketCapUsd);
});

const stopLaunches = feed.watchLaunches((launch) => {
  console.log(launch.venue, launch.symbol, launch.mint);
});

stop();
stopLaunches();
feed.close();
await feed.closed;`}</CodeBlock>
    </DocsPage>
  );
}
