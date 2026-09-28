import { Callout, CodeBlock, DocsPage } from "../../_components/docs";
import { ApiRef } from "../../_components/reference";

export default function SdkRewardsPage() {
  return (
    <DocsPage
      eyebrow="SDK reference"
      title="Claims & distributions"
      description="The public SDK contains two durable payout primitives: creator-fee claims with stable reconciliation state, and cumulative entitlement distributions that remember confirmed payments across retries and restarts."
    >
      <h2 id="creator-fees">Creator-fee claims</h2>
      <ApiRef
        id="creator-fees-claim"
        name="claims.creatorFees.claim"
        signature={`claims.creatorFees.claim(\n  token: TokenRef,\n  wallet: WalletRef,\n  options?: {\n    id?: string;\n    basis?: RewardEntitlementBasisInput;\n    via?: SenderId;\n    skipSimulation?: boolean;\n    skipPreflight?: boolean;\n  },\n): Promise<CreatorRewardClaimResult>`}
        summary="Resolve the token's registered creator-reward claim source, build the claim, submit it, and persist reconciliation/checkpoint state."
        behavior={[
          "wallet is the transaction fee payer; payout addresses come from the resolved on-chain claim plan and may differ from the fee payer.",
          "id enables stable durable claim state. basis can pin an entitlement basis containing an id, slot, hash, and optional observed timestamp so downstream reward accounting can tie a claim to a specific observed basis.",
          "The result includes estimatedClaimRaw, claimedRaw when known, payout splits, the SendReceipt, signature/slot, block time, observed time, and basis.",
        ]}
        returns="CreatorRewardClaimResult."
      />
      <ApiRef
        id="creator-fees-status"
        name="claims.creatorFees.status"
        signature="claims.creatorFees.status(id: string): DurableCreatorRewardClaimState | null"
        summary="Read remembered durable claim state by stable id."
        behavior={[
          "Durable state tracks prepared/submitted/confirmed/failed/uncertain status, pending signed transaction information, checkpoint, last error, and uncertainty reason.",
        ]}
      />
      <CodeBlock language="ts">{`type CreatorRewardClaimResult = {
  version: 2;
  claimId: string | null;
  tokenMint: string;
  source: string;
  feePayer: string;
  quoteAsset: { kind: QuoteAsset["kind"]; mint: string; tokenProgram: string; decimals: number };
  estimatedClaimRaw: bigint;
  claimedRaw: bigint | null;
  payouts: Array<{ address: string; amountRaw: bigint; shareBps: number | null }>;
  receipt: SendReceipt;
  claimSignature: string;
  claimSlot: number | null;
  blockTimeMs: number | null;
  observedAtMs: number;
  basis: { id: string; slot: number; hash: string; observedAtMs: number | null } | null;
};`}</CodeBlock>
      <CodeBlock language="ts">{`const result = await slrd.claims.creatorFees.claim(token, feePayer, {
  id: "creator-fees:epoch-42",
  via: "rpc",
});

console.log(result.claimedRaw, result.payouts);
console.log(slrd.claims.creatorFees.status("creator-fees:epoch-42"));`}</CodeBlock>

      <h2 id="cumulative-distributions">Cumulative distributions</h2>
      <ApiRef
        id="distribution-plan"
        name="distributions.plan"
        signature={`distributions.plan({\n  id,\n  from,\n  asset,\n  entitlements,\n  reserveRaw?,\n  maxRecipientsPerTransaction?,\n}: CumulativeDistributionInput): Promise<CumulativeDistributionPlan>`}
        summary="Calculate outstanding cumulative payments without broadcasting transactions."
        behavior={[
          "Each entitlement is cumulative, not a one-shot payment. The planner subtracts confirmedPaidRaw from entitledRaw and only returns outstanding recipients.",
          "The plan reports source balance, reserve, available balance, total entitled/confirmed/outstanding amounts, next payments, and any pending transaction that still needs reconciliation.",
        ]}
        parameters={[
          {
            name: "id",
            type: "string",
            description:
              "Stable distribution id used to persist/reconcile state.",
          },
          {
            name: "from",
            type: "WalletRef",
            description: "Source signing wallet.",
          },
          {
            name: "asset",
            type: "'SOL' | string | PublicKey",
            description: "SOL or SPL token mint to distribute.",
          },
          {
            name: "entitlements",
            type: "CumulativeEntitlement[]",
            description: "Recipient plus cumulative entitled raw amount.",
          },
          {
            name: "reserveRaw",
            type: "bigint?",
            defaultValue: "0n",
            description: "Raw balance that must remain in the source wallet.",
          },
          {
            name: "maxRecipientsPerTransaction",
            type: "number?",
            description:
              "Upper bound on recipients packed into one transfer transaction.",
          },
        ]}
        returns="CumulativeDistributionPlan."
      />
      <ApiRef
        id="distribution-execute"
        name="distributions.execute"
        signature={`distributions.execute({\n  ...input,\n  via?,\n  skipSimulation?,\n  skipPreflight?,\n}: CumulativeDistributionExecuteOptions): Promise<CumulativeDistributionState>`}
        summary="Execute outstanding cumulative payments while persisting pending and confirmed payment state."
        behavior={[
          "Execution state can be ready, distributing, complete, funding-required, or uncertain.",
          "Pending state stores the signed transaction, recent blockhash, last valid block height, included payments, submission attempts, and timestamps so uncertain outcomes can be reconciled instead of blindly repeated.",
        ]}
        returns="CumulativeDistributionState with durable recipients, receipts, pending transaction, entitlement hash, and status."
      />
      <CodeBlock language="ts">{`type CumulativeDistributionPlan = {
  id: string;
  sourceWallet: string;
  asset: { kind: QuoteAsset["kind"]; mint: string; tokenProgram: string; decimals: number };
  totalEntitledRaw: bigint;
  totalConfirmedPaidRaw: bigint;
  totalOutstandingRaw: bigint;
  sourceBalanceRaw: bigint;
  availableRaw: bigint;
  reserveRaw: bigint;
  outstanding: Array<{
    recipient: string;
    entitledRaw: bigint;
    confirmedPaidRaw: bigint;
    outstandingRaw: bigint;
  }>;
  nextPayments: Array<{ id: string; recipient: string; amountRaw: bigint }>;
  pending: CumulativeDistributionPending | null;
};`}</CodeBlock>
      <ApiRef
        id="distribution-status"
        name="distributions.status"
        signature="distributions.status(id: string): CumulativeDistributionState | null"
        summary="Read durable distribution state without planning or executing another payment."
      />

      <Callout title="Use stable ids for resumable payouts">
        <p>
          A stable distribution or claim id is what makes persisted
          reconciliation useful. Changing ids turns the same logical payout into
          a new durable state namespace.
        </p>
      </Callout>
    </DocsPage>
  );
}
