import { CodeBlock, DocsPage } from "../../_components/docs";
import { ApiRef } from "../../_components/reference";

export default function SdkHistoryEventsPage() {
  return (
    <DocsPage
      title="History"
      description="Durable replay, market history, coverage, and event streams."
    >
      <h2 id="replay">Neutral replay</h2>
      <ApiRef
        id="history-replay"
        name="history.replay"
        signature={`history.replay(\n  token: TokenRef,\n  options?: ReplayOptions,\n): Promise<ReplayHistory>\n\ntype ReplayOptions = {\n  recipient?: string | PublicKey;\n  provider?: "auto" | "solscan" | "rpc";\n  maxPages?: number;\n  claimMaxPages?: number;\n  onProgress?: (progress: TokenEventHistoryProgress) => void;\n};`}
        summary="Reconstruct a normalized event history for one token, including mint/burn/transfer/owner-change/claim records and coverage metadata."
        behavior={[
          "ReplayHistory is both iterable and indexable through its items property. Each ReplayItem contains beforeBalance and postBalance maps plus normalized payouts and the underlying canonical event.",
          "Coverage is explicit: fromCreation, throughSlot, complete, warnings, and updatedAtMs tell you whether the reconstructed history is suitable for authoritative accounting.",
          "recipient narrows creator-reward reconstruction to a reward recipient. provider chooses auto, Solscan, or direct RPC reconstruction.",
        ]}
        returns="ReplayHistory { mint, items, coverage } that also implements Iterable<ReplayItem>."
        example={`const history = await slrd.history.replay(token, {\n  provider: "auto",\n});\n\nif (!history.coverage.complete) {\n  console.warn(history.coverage.warnings);\n}\n\nfor (const item of history) {\n  console.log(item.slot, item.trx, item.signature);\n}`}
      />
      <ApiRef
        id="history-merge"
        name="history.merge"
        signature="history.merge(histories: readonly (ReplayHistory | Iterable<ReplayItem>)[]): ReplayItem[]"
        summary="Merge multiple replay histories or item iterables into one deterministically ordered ReplayItem array."
        returns="ReplayItem[]."
      />

      <h2 id="market-history">Market history</h2>
      <ApiRef
        id="history-market"
        name="history.market"
        signature={`history.market(\n  token: TokenRef,\n  options?: MarketHistoryOptions,\n): Promise<MarketHistory>\n\ntype MarketHistoryOptions = {\n  commitment?: "confirmed" | "finalized";\n  pageSize?: number;\n  transactionBatchSize?: number;\n  transactionConcurrency?: number;\n  rpcTimeoutMs?: number;\n  rpcRetries?: number;\n  retryDelayMs?: number;\n  maxSignaturesPerAddress?: number;\n  priceSampleMs?: number;\n  replace?: boolean;\n  backfill?: boolean;\n  maxRaydiumPools?: number;\n  onProgress?: (progress: TokenHistoryBackfillProgress) => void;\n};`}
        summary="Ensure durable token history coverage and return the token's persisted sparse 1-second market candle series."
        behavior={[
          "When backfill is not explicitly false, the core path backfills when stored coverage is missing/incomplete or replace=true.",
          "MarketHistory contains mint, quoteMint, TokenHistoryCoverage, and candles1s. Backfill controls RPC paging, transaction hydration concurrency/retries, and price sampling.",
        ]}
        returns="MarketHistory { mint, quoteMint, coverage, candles1s }."
      />

      <h2 id="replay-events">Replay event subscriptions</h2>
      <ApiRef
        id="events-call"
        name="events(token, options?)"
        signature={`events(\n  token: TokenRef,\n  options?: ReplayEventsOptions,\n): Promise<ReplayEventSubscription>\n\ntype ReplayEventsOptions = ReplayOptions & {\n  pollMs?: number;\n  signal?: AbortSignal;\n};`}
        summary="Open an async replay-event subscription for one token."
        behavior={[
          "The subscription is AsyncIterable<ReplayItem>, exposes mint and a watermark slot, and has an async close() method.",
          "pollMs controls polling cadence and signal allows external cancellation. Provider and replay page controls are inherited from ReplayOptions.",
        ]}
        returns="ReplayEventSubscription."
        example={`const stream = await slrd.events(token, { pollMs: 2_000 });\ntry {\n  for await (const item of stream) {\n    console.log(item.trx, item.signature);\n  }\n} finally {\n  await stream.close();\n}`}
      />
      <ApiRef
        id="events-merge"
        name="events.merge"
        signature="events.merge(streams: readonly ReplayEventSubscription[]): MergedReplayEventStream"
        summary="Merge several replay subscriptions into one AsyncIterable stream with a shared close() method."
        returns="MergedReplayEventStream."
      />

      <p>
        <strong>Replay</strong> is for ordered, durable reconstruction.{" "}
        <strong>Live subscriptions</strong> are for reacting to launches,
        migrations, and trades.
      </p>

      <h2 id="replay-item">Replay item shape</h2>
      <CodeBlock language="ts">{`type ReplayItem = {
  id: string;
  mint: string;
  signature: string;
  slot: number;
  timestampSec: number | null;
  transactionIndex: number | null;
  instructionIndex: number | null;
  innerInstructionIndex: number | null;
  trx: "mint" | "burn" | "transfer" | "change_owner" | "claim";
  beforeBalance: ReadonlyMap<string, bigint>;
  postBalance: ReadonlyMap<string, bigint>;
  payouts: readonly ReplayPayout[];
  raw: SolardCanonicalEvent;
};`}</CodeBlock>
    </DocsPage>
  );
}
