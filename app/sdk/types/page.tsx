import { CodeBlock, DocsPage } from "../../_components/docs";
import { OptionTable } from "../../_components/reference";

export default function SdkTypesPage() {
  return (
    <DocsPage title="Types" description="Public SDK values and return types.">
      <h2 id="export-inventory">Complete public type inventory</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Exported types</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Client</td>
              <td>
                <code>Solard</code>, <code>SolardOptions</code>,{" "}
                <code>SolardHistoryApi</code>, <code>SolardEventsApi</code>
              </td>
            </tr>
            <tr>
              <td>Amounts / execution</td>
              <td>
                <code>HumanAmount</code>, <code>QuoteAsset</code>,{" "}
                <code>SenderId</code>, <code>SendReceipt</code>,{" "}
                <code>SimulationResult</code>
              </td>
            </tr>
            <tr>
              <td>Wallets / tokens</td>
              <td>
                <code>WalletRef</code>, <code>WalletInfo</code>,{" "}
                <code>TokenRef</code>, <code>TokenRow</code>
              </td>
            </tr>
            <tr>
              <td>Holders</td>
              <td>
                <code>TokenHolder</code>, <code>ExcludedTokenHolder</code>,{" "}
                <code>TokenHolderSnapshot</code>,{" "}
                <code>TokenHolderSnapshotOptions</code>
              </td>
            </tr>
            <tr>
              <td>Market / replay</td>
              <td>
                <code>MarketPrice</code>, <code>MarketHistory</code>,{" "}
                <code>MarketHistoryOptions</code>, <code>ReplayCoverage</code>,{" "}
                <code>ReplayEventSubscription</code>,{" "}
                <code>ReplayEventsOptions</code>, <code>ReplayHistory</code>,{" "}
                <code>ReplayItem</code>, <code>ReplayOptions</code>,{" "}
                <code>ReplayPayout</code>, <code>ReplayTransaction</code>,{" "}
                <code>MergedReplayEventStream</code>,{" "}
                <code>TokenEventHistoryProgress</code>,{" "}
                <code>SolardCanonicalEvent</code>, <code>SolardClaimEvent</code>
                , <code>SolardClaimAttribution</code>
              </td>
            </tr>
            <tr>
              <td>Creator claims</td>
              <td>
                <code>ClaimCreatorRewardsOptions</code>,{" "}
                <code>CreatorRewardClaimPayout</code>,{" "}
                <code>CreatorRewardClaimResult</code>
              </td>
            </tr>
            <tr>
              <td>Cumulative distributions</td>
              <td>
                <code>CumulativeEntitlement</code>,{" "}
                <code>CumulativeDistributionInput</code>,{" "}
                <code>CumulativeDistributionExecuteOptions</code>,{" "}
                <code>CumulativeDistributionPlan</code>,{" "}
                <code>CumulativeDistributionRecipient</code>,{" "}
                <code>CumulativeDistributionState</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="subscription-types">Market subscription types</h2>
      <p>
        Subscription handles accept cancellation, expose <code>closed</code>/
        <code>close()</code>, and token-aware streams support{" "}
        <code>addTokens()</code>.
      </p>
      <CodeBlock language="ts">{`import {
  subscribeLaunches,
  subscribeMigrations,
  subscribeTrades,
  type TradeEvent,
} from "@solard/sdk";`}</CodeBlock>
      <p>
        <code>TradeEvent</code> raw amount fields are <code>bigint</code>.
        Launch events can expose <code>isMayhemMode</code>;
        launch/migration/trade events expose the mint used by the promotion
        flow.
      </p>
      <p>
        Use the installed TypeScript declarations for exhaustive event fields.
      </p>

      <h2 id="amounts">Amounts and quote assets</h2>
      <CodeBlock language="ts">{`type QuoteAsset =
  | { kind: "native-sol"; mint: PublicKey; tokenProgram: PublicKey; decimals: 9 }
  | { kind: "spl-token"; mint: PublicKey; tokenProgram: PublicKey; decimals: number };

type RawAmount = { raw: bigint; asset: QuoteAsset };
type HumanAmount = { sol: string | number } | RawAmount;

sol(value: string | number): RawAmount;
tokenAmount(value: string | number, mint: PublicKey, decimals: number, tokenProgram?): RawAmount;
formatRaw(raw: bigint, decimals: number): string;`}</CodeBlock>
      <p>
        <code>sol()</code> converts SOL to lamports. <code>tokenAmount()</code>{" "}
        converts UI token amounts to raw units. Excess precision is rejected.
      </p>

      <h2 id="refs">WalletRef and TokenRef</h2>
      <CodeBlock language="ts">{`type WalletRef = string | PublicKey | Keypair | WalletRow;
type TokenRef = string | PublicKey | TokenRow;`}</CodeBlock>
      <p>
        Common refs are aliases, addresses/mints, or <code>PublicKey</code>{" "}
        objects.
      </p>

      <h2 id="wallet-info">WalletInfo</h2>
      <CodeBlock language="ts">{`type WalletInfo = {
  id: number;
  name: string;
  address: string;
  isActive: number;
  createdAtMs: number;
  updatedAtMs: number;
};`}</CodeBlock>
      <p>
        WalletInfo is a public projection. It intentionally contains no
        secret-key or encrypted-secret fields.
      </p>

      <h2 id="market-price">MarketPrice</h2>
      <CodeBlock language="ts">{`type MarketPrice = {
  venue: VenueId;
  mint: PublicKey;
  quoteAsset: QuoteAsset;
  priceQuotePerToken: number;
  baseReserveRaw?: bigint;
  quoteReserveRaw?: bigint;
  capturedAtMs: number;
};`}</CodeBlock>

      <h2 id="holder-snapshot">TokenHolderSnapshot</h2>
      <CodeBlock language="ts">{`type TokenHolderSnapshot = {
  version: 1;
  mint: string;
  tokenProgram: string;
  decimals: number;
  supplyRaw: bigint;
  slot: number;
  observedAtMs: number;
  tokenAccounts: number;
  holderCount: number;
  eligibleHolderCount: number;
  totalHeldRaw: bigint;
  eligibleTotalRaw: bigint;
  excludedTotalRaw: bigint;
  holders: TokenHolder[];
  excluded: ExcludedTokenHolder[];
};`}</CodeBlock>
      <OptionTable
        rows={[
          {
            name: "commitment",
            type: "confirmed|finalized?",
            defaultValue: "confirmed",
            description:
              "Consistency level used for the token-program account snapshot.",
          },
          {
            name: "excludeOwners",
            type: "Iterable<string|PublicKey>?",
            description: "Owners removed from the eligible denominator.",
          },
          {
            name: "minimumRaw",
            type: "bigint?",
            defaultValue: "1n",
            description:
              "Minimum raw token amount required for holder eligibility.",
          },
        ]}
      />

      <h2 id="send-receipt">SendReceipt and SimulationResult</h2>
      <CodeBlock language="ts">{`type SendReceipt = {
  signature: string;
  slot: number | null;
  sender: string;
  status: "submitted" | "confirmed" | "failed";
  feeLamports?: number;
  computeUnitsConsumed?: number;
  error?: string;
};

type SimulationResult = {
  success: boolean;
  logs: string[];
  cuUsed: number | null;
  error: unknown | null;
  accountChanges: Array<...>;
  tokenChanges: Array<...>;
  solChanges: Array<...>;
};`}</CodeBlock>
      <p>
        Receipts may include actual fee/CU data. Simulations include expected
        account, token, and SOL deltas.
      </p>

      <h2 id="replay">Replay types</h2>
      <CodeBlock language="ts">{`type ReplayCoverage = {
  version: 1;
  mint: string;
  fromCreation: boolean;
  throughSlot: number;
  complete: boolean;
  warnings: string[];
  updatedAtMs: number;
};

type ReplayTransaction = "mint" | "burn" | "transfer" | "change_owner" | "claim";`}</CodeBlock>
      <p>
        Coverage must be checked before treating replay output as authoritative
        accounting history.
      </p>

      <h2 id="distribution-state">Distribution state</h2>
      <CodeBlock language="ts">{`type CumulativeDistributionState = {
  version: 1;
  id: string;
  sourceWallet: string;
  asset: { kind: QuoteAsset["kind"]; mint: string; tokenProgram: string; decimals: number };
  status: "ready" | "distributing" | "complete" | "funding-required" | "uncertain";
  recipients: CumulativeDistributionRecipient[];
  entitlementHash: string;
  pending: CumulativeDistributionPending | null;
  receipts: Array<...>;
  reserveRaw: string;
  lastError: string | null;
  uncertainReason: string | null;
  createdAtMs: number;
  updatedAtMs: number;
};`}</CodeBlock>
      <p>
        State includes pending and confirmed payment data so distributions can
        resume safely.
      </p>
    </DocsPage>
  );
}
