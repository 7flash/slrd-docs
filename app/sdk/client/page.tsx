import { Callout, DocsPage } from "../../_components/docs";
import { ApiRef } from "../../_components/reference";

export default function SdkClientPage() {
  return (
    <DocsPage
      eyebrow="SDK reference"
      title="Client methods"
      description="Exact public Solard client surface exported by @solard/sdk, including wallet and token registry methods, holder/balance reads, market prices, and routed trading."
    >
      <h2 id="construction">Construction and lifecycle</h2>
      <ApiRef
        id="create-solard"
        name="createSolard(options?)"
        signature={`function createSolard(options: SolardOptions = {}): Solard\n\ntype SolardOptions = {\n  rpcUrl?: string;\n  dbPath?: string;\n  cacheTtlMs?: number;\n};`}
        summary="Create the curated public client. No persistence is created merely by importing the module; construction happens when this function is called."
        parameters={[
          {
            name: "rpcUrl",
            type: "string?",
            description:
              "Optional RPC endpoint override passed to the core Solard connection layer.",
          },
          {
            name: "dbPath",
            type: "string?",
            description: "Optional SQLite database path override.",
          },
          {
            name: "cacheTtlMs",
            type: "number?",
            description: "Optional account-cache TTL override.",
          },
        ]}
        returns="A frozen Solard object exposing only the curated public methods and nested APIs documented here."
      />
      <ApiRef
        id="create-trader-solard"
        name="createTraderSolard"
        signature="const createTraderSolard = createSolard"
        summary="Compatibility/application alias for createSolard in @solard/sdk. It does not add extra trader-only methods."
      />
      <ApiRef
        id="close"
        name="close()"
        signature="close(): void"
        summary="Close the underlying Solard instance and database/connection resources owned by the client."
      />

      <h2 id="wallets">Wallet methods</h2>
      <Callout title="Wallet secrets never appear in WalletInfo">
        <p>
          The public wallet result is limited to id, name, address, active
          state, and timestamps. Encrypted secret-key material is not part of
          the returned wallet object.
        </p>
      </Callout>
      <ApiRef
        id="create-wallet"
        name="createWallet"
        signature="createWallet(name?: string): WalletInfo"
        summary="Generate a new Solana keypair and persist it encrypted in the canonical Solard database."
        parameters={[
          {
            name: "name",
            type: "string?",
            description: "Optional stored wallet alias.",
          },
        ]}
        returns="WalletInfo with public metadata only."
        example={`const wallet = slrd.createWallet("maker");\nconsole.log(wallet.address);`}
      />
      <ApiRef
        id="create-vanity-wallet"
        name="createVanityWallet"
        signature={`createVanityWallet(\n  name: string | undefined,\n  options: VanityMintOptions,\n): Promise<{\n  wallet: WalletInfo;\n  suffix: string;\n  attempts: number;\n  elapsedMs: number;\n  ratePerSecond: number;\n  lastMint: string;\n}>\n\ntype VanityMintOptions = {\n  suffix: string;\n  maxAttempts?: number;\n  timeoutMs?: number;\n  reportEvery?: number;\n  onProgress?: (progress: VanityMintProgress) => void;\n  workers?: number;\n  signal?: AbortSignal;\n};`}
        summary="Search for a public-key suffix, persist the matching keypair as an encrypted wallet, and return generation statistics."
        parameters={[
          {
            name: "name",
            type: "string | undefined",
            description: "Stored wallet alias.",
          },
          {
            name: "options.suffix",
            type: "string",
            description: "Required public-key suffix target.",
          },
          {
            name: "options.maxAttempts",
            type: "number?",
            description: "Optional attempt budget.",
          },
          {
            name: "options.timeoutMs",
            type: "number?",
            description: "Optional wall-clock timeout.",
          },
          {
            name: "options.reportEvery",
            type: "number?",
            description: "Progress callback interval.",
          },
          {
            name: "options.workers",
            type: "number?",
            description: "Parallel vanity workers.",
          },
          {
            name: "options.signal",
            type: "AbortSignal?",
            description: "Abort the generation search.",
          },
        ]}
      />
      <ApiRef
        id="import-wallet"
        name="importWallet"
        signature="importWallet(privateKey: string, name?: string, options?: { overwrite?: boolean }): WalletInfo"
        summary="Parse a base58 or JSON byte-array private key and persist it encrypted in the wallet database."
        behavior={[
          "Same-address re-imports can update without overwrite. Replacing a different wallet that already uses the requested name requires overwrite=true.",
        ]}
        parameters={[
          {
            name: "privateKey",
            type: "string",
            description: "Base58 secret key or JSON array of secret-key bytes.",
          },
          {
            name: "name",
            type: "string?",
            description: "Optional wallet alias.",
          },
          {
            name: "options.overwrite",
            type: "boolean?",
            defaultValue: "false",
            description:
              "Allow replacing a different wallet that already uses the requested name.",
          },
        ]}
        returns="WalletInfo."
      />
      <ApiRef
        id="list-wallets"
        name="listWallets"
        signature="listWallets(): WalletInfo[]"
        summary="List every stored wallet as public metadata without exposing encrypted-secret fields."
        returns="Array of WalletInfo."
      />

      <h2 id="tokens">Token registry and account methods</h2>
      <ApiRef
        id="add-token"
        name="addToken"
        signature="addToken(mintRef: string, name?: string, metadata: Partial<TokenRow> = {}): Promise<TokenRow>"
        summary="Read the mint, inspect it through registered venue adapters, and upsert the resulting token record."
        behavior={[
          "The method reads on-chain decimals/token program, merges venue inspection fields, then applies supplied metadata and stores refreshedAtMs.",
        ]}
        parameters={[
          {
            name: "mintRef",
            type: "string",
            description: "Base58 token mint address.",
          },
          {
            name: "name",
            type: "string?",
            description: "Optional human alias/name override.",
          },
          {
            name: "metadata",
            type: "Partial<TokenRow>",
            defaultValue: "{}",
            description:
              "Additional persisted token metadata merged after inspection.",
          },
        ]}
        returns="The persisted TokenRow."
      />
      <ApiRef
        id="resolve-token"
        name="resolveToken"
        signature="resolveToken(ref: TokenRef): TokenRow"
        summary="Resolve a stored token by supported reference form. This does not automatically add an unknown mint."
        returns="Stored TokenRow or an unknown-token error when no registry entry matches."
      />
      <ApiRef
        id="token-accounts"
        name="tokenAccounts"
        signature="tokenAccounts(ref: WalletRef): Promise<OwnedTokenAccount[]>"
        summary="List actual token accounts owned by a wallet across both the classic Token program and Token-2022."
        behavior={[
          "Each returned account includes address, mint, owner, raw amount, decimals, token program, lamports, associated-account status, account state, and close authority.",
        ]}
        returns="Array of OwnedTokenAccount records."
      />
      <ApiRef
        id="snapshot-holders"
        name="snapshotHolders"
        signature="snapshotHolders(token: TokenRef, options?: Omit<TokenHolderSnapshotOptions, 'token'>): Promise<TokenHolderSnapshot>"
        summary="Take a complete on-chain holder snapshot suitable for payout denominators and accounting."
        behavior={[
          "The underlying snapshot reads token-program accounts directly rather than stitching websocket deltas.",
          "Solard automatically passes stored Pump/PumpSwap token metadata into the lower-level snapshot primitive so curve, pool, and sharing-config inventory can be excluded when known.",
        ]}
        parameters={[
          {
            name: "token",
            type: "TokenRef",
            description: "Stored token reference.",
          },
          {
            name: "commitment",
            type: "confirmed|finalized?",
            defaultValue: "confirmed",
            description: "Snapshot commitment.",
          },
          {
            name: "excludeOwners",
            type: "Iterable<string|PublicKey>?",
            description:
              "Explicit owner addresses excluded from the eligible denominator.",
          },
          {
            name: "minimumRaw",
            type: "bigint?",
            defaultValue: "1n",
            description: "Exclude balances below this raw-token threshold.",
          },
        ]}
        returns="TokenHolderSnapshot with supply, holder counts, eligible/excluded totals, holder rows, and excluded rows."
      />
      <ApiRef
        id="wallet-balances"
        name="walletBalances"
        signature="walletBalances(ref: WalletRef, tokenRefs?: TokenRef[]): Promise<WalletBalanceSnapshot>"
        summary="Read confirmed SOL balance plus balances for the supplied token references."
        behavior={[
          "When tokenRefs is omitted in core, the method uses the stored token registry. It also refreshes missing decimals when necessary and records position balances in Solard's internal position store.",
        ]}
        returns="{ wallet, solLamports, tokenBalances, capturedAtMs }."
      />

      <h2 id="market-trading">Market and trading methods</h2>
      <ApiRef
        id="sample-price"
        name="samplePrice"
        signature="samplePrice(token: TokenRef): Promise<MarketPrice>"
        summary="Resolve the token's venue, sample its current quote-per-token price, and persist that price sample."
        returns="MarketPrice containing venue, mint, quote asset, priceQuotePerToken, optional reserve values, and capturedAtMs."
      />
      <ApiRef
        id="buy"
        name="buy"
        signature={`buy(\n  token: TokenRef,\n  wallet: WalletRef,\n  amount: HumanAmount,\n  options?: {\n    slippageBps?: number;\n    via?: SenderId;\n    skipSimulation?: boolean;\n    skipPreflight?: boolean;\n  },\n): Promise<SendReceipt>`}
        summary="Build, simulate by default, submit, and confirm a routed native Solard buy for one wallet."
        behavior={[
          "The public SDK buy method is an execution method, not a quote-only method. It calls the transaction composer and sends immediately.",
          "When a PumpSwap preflight fails with the specific retryable 6040 simulation error, the core method rebuilds exactly once so the pool/fee quote is fresh while preserving the requested slippage.",
          "The SDK wrapper does not impose the CLI's 1500-bps default; omitted options flow to the underlying composer/venue behavior.",
        ]}
        parameters={[
          {
            name: "token",
            type: "TokenRef",
            description: "Registered token to buy.",
          },
          {
            name: "wallet",
            type: "WalletRef",
            description: "Stored signing wallet reference.",
          },
          {
            name: "amount",
            type: "HumanAmount",
            description:
              "SOL or raw quote-asset amount accepted by the routed market.",
          },
          {
            name: "options.slippageBps",
            type: "number?",
            description: "Optional slippage override.",
          },
          {
            name: "options.via",
            type: "SenderId?",
            defaultValue: "rpc",
            description: "Sender lane.",
          },
          {
            name: "options.skipSimulation",
            type: "boolean?",
            defaultValue: "false",
            description: "Skip Solard's explicit simulation step.",
          },
          {
            name: "options.skipPreflight",
            type: "boolean?",
            description: "Sender preflight preference.",
          },
        ]}
      />
      <ApiRef
        id="sell"
        name="sell"
        signature={`sell(\n  token: TokenRef,\n  wallet: WalletRef,\n  options?: {\n    bps?: number;\n    slippageBps?: number;\n    via?: SenderId;\n    skipSimulation?: boolean;\n    skipPreflight?: boolean;\n  },\n): Promise<SendReceipt>`}
        summary="Build, simulate by default, submit, and confirm a routed sell for one wallet."
        behavior={[
          "The method is an execution method. bps selects the fraction of token balance sold; sender defaults to rpc inside the core method when omitted.",
        ]}
        parameters={[
          {
            name: "token",
            type: "TokenRef",
            description: "Registered token to sell.",
          },
          {
            name: "wallet",
            type: "WalletRef",
            description: "Stored signing wallet.",
          },
          {
            name: "options.bps",
            type: "number?",
            description: "Balance fraction in basis points.",
          },
          {
            name: "options.slippageBps",
            type: "number?",
            description: "Optional slippage override.",
          },
          {
            name: "options.via",
            type: "SenderId?",
            defaultValue: "rpc",
            description: "Sender lane.",
          },
          {
            name: "options.skipSimulation",
            type: "boolean?",
            defaultValue: "false",
            description: "Skip explicit Solard simulation.",
          },
          {
            name: "options.skipPreflight",
            type: "boolean?",
            description: "Sender preflight preference.",
          },
        ]}
      />
    </DocsPage>
  );
}
