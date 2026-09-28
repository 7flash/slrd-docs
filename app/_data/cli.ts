import type { ReferenceOption } from "../_components/reference";

export type CommandDoc = {
  id: string;
  title: string;
  syntax: string | string[];
  summary: string;
  behavior?: string[];
  options?: ReferenceOption[];
  notes?: string[];
  example?: string;
  mode?:
    | "read"
    | "local-write"
    | "external-write"
    | "live-default"
    | "live-flag"
    | "plan"
    | "mixed";
};

export const walletTokenCommands: CommandDoc[] = [
  {
    id: "setup",
    title: "slrd setup",
    syntax: "slrd setup [--status]",
    summary:
      "Inspect or initialize the CLI's ephemeral wallet-password workflow.",
    behavior: [
      "Solard does not persist the interactive wallet password. Signing commands ask for it for that process unless SLRD_MASTER_KEY is explicitly supplied for automation or CI.",
      "With --status, the command reports the password mode and whether an environment override is active. If no signing wallets exist yet, plain slrd setup explains that wallet creation is the next step.",
    ],
    options: [
      {
        name: "--status",
        type: "boolean",
        description:
          "Print vault/password-mode status without creating or modifying a wallet.",
      },
    ],
    mode: "read",
  },
  {
    id: "wallet-create",
    title: "slrd wallet create",
    syntax:
      "slrd wallet create [name] [--vanity <suffix>] [--workers N] [--max-attempts N] [--timeout-ms N] [--report-every N] [--json]",
    summary:
      "Generate a Solana keypair and persist it encrypted in the canonical Solard database.",
    behavior: [
      "If this is the first stored wallet and no name is supplied, the CLI uses main. A normal wallet is generated immediately; --vanity switches to suffix search before the keypair is encrypted and stored.",
      "The public result contains wallet metadata, not secret-key ciphertext. Vanity output also includes attempts, elapsed time, and generation rate.",
    ],
    options: [
      {
        name: "name",
        type: "string",
        defaultValue: "main for first wallet",
        description: "Stored wallet alias.",
      },
      {
        name: "--vanity",
        type: "string",
        description:
          "Require the generated public key to end with this suffix.",
      },
      {
        name: "--workers",
        type: "integer",
        description: "Worker count for vanity generation.",
      },
      {
        name: "--max-attempts",
        type: "integer",
        description: "Stop vanity search after this many attempts.",
      },
      {
        name: "--timeout-ms",
        type: "integer",
        defaultValue: "0",
        description:
          "Vanity search timeout. Zero means no explicit timeout in this CLI path.",
      },
      {
        name: "--report-every",
        type: "integer",
        defaultValue: "1000000",
        description: "Progress reporting interval during vanity search.",
      },
      {
        name: "--json",
        type: "boolean",
        description:
          "Emit structured JSON instead of the formatted terminal card.",
      },
    ],
    mode: "local-write",
  },
  {
    id: "wallet-import",
    title: "slrd import",
    syntax: [
      "slrd import <private_key> [name] [--force]",
      "cat key.json | slrd import --stdin [name] [--force]",
    ],
    summary:
      "Import a base58 or JSON-array Solana secret key into encrypted wallet storage.",
    behavior: [
      "--stdin keeps the key out of the command line. --force and --overwrite are accepted by the implementation as the same overwrite request.",
      "Re-importing the same address can update it without overwrite; replacing a different wallet that already owns the requested name requires overwrite permission.",
    ],
    options: [
      {
        name: "--stdin",
        type: "boolean",
        description: "Read the private key from standard input.",
      },
      {
        name: "--force / --overwrite",
        type: "boolean",
        description:
          "Allow replacing a different wallet that already uses the requested name.",
      },
    ],
    mode: "local-write",
  },
  {
    id: "wallet-export",
    title: "slrd export",
    syntax: "slrd export <wallet|address> [--json] [--out <path>]",
    summary:
      "Export a stored signing wallet's secret key after the signing vault is unlocked.",
    behavior: [
      "Without --json, the secret is emitted as base58. With --json, it is emitted as a JSON byte array.",
      "When --out is used, the CLI creates the parent directory and writes the file with exclusive-create semantics and mode 0600. Without --out, secret material goes to stdout while wallet metadata goes to stderr so piping remains clean.",
    ],
    options: [
      {
        name: "--json",
        type: "boolean",
        description: "Use keypair JSON byte-array format instead of base58.",
      },
      {
        name: "--out",
        type: "path",
        description: "Write the secret to a new file instead of stdout.",
      },
    ],
    notes: [
      "This command intentionally exposes secret key material. Treat terminal history, redirected output, and destination files as sensitive.",
    ],
    mode: "external-write",
  },
  {
    id: "contacts",
    title: "slrd contact",
    syntax: [
      "slrd contact add <name> <address> [--force]",
      "slrd contact list",
      "slrd contact show <name|address>",
      "slrd contact remove <name|address>",
    ],
    summary:
      "Manage public-address contacts separately from signing wallets and group members.",
    behavior: [
      "Contacts are destination references only. They never become signing wallets and are explicitly kept separate from wallet/group membership.",
    ],
    options: [
      {
        name: "--force",
        type: "boolean",
        description:
          "Allow contact replacement when adding a conflicting entry.",
      },
    ],
    mode: "mixed",
  },
  {
    id: "wallets",
    title: "slrd wallets",
    syntax:
      "slrd wallets [--wallet <wallet>] [--group <name>] [--token <token> | --tokens] [--token-totals] [--only-with-tokens] [--rpc-concurrency N] [--rpc-delay-ms N] [--addresses-only]",
    summary:
      "List stored wallets, showing SOL by default and optionally scanning token balances.",
    behavior: [
      "Token scans are opt-in for the wallets command. --token selects one registered token; --tokens requests the broader token scan. The implementation rejects using both together.",
      "Filters can narrow to one wallet or a group. --addresses-only emits compact alias/address lines without balance RPC work.",
    ],
    mode: "read",
  },
  {
    id: "balances",
    title: "slrd balances",
    syntax: "slrd balances --wallet <wallet> [--token <token>] [--show-zero]",
    summary: "Read SOL and SPL balances for one stored wallet.",
    behavior: [
      "Unlike slrd wallets, balances requires a single wallet and opts into token balance inspection as part of the command's purpose.",
    ],
    mode: "read",
  },
  {
    id: "fees",
    title: "slrd fees",
    syntax: "slrd fees --wallet <wallet> [--since 30m] [--limit 100]",
    summary:
      "Sum actual on-chain transaction fees paid by the selected wallet.",
    behavior: [
      "The command inspects transaction history rather than estimating configured fees. --since constrains the lookback window and --limit caps fetched signatures/transactions.",
    ],
    mode: "read",
  },
  {
    id: "sol-flow",
    title: "slrd sol-flow",
    syntax: "slrd sol-flow --wallet <wallet> [--since 30m] [--limit 100]",
    summary:
      "Audit native SOL, wrapped SOL, and SPL deltas from actual wallet transactions.",
    behavior: [
      "This is an accounting/debugging view intended to explain balance movement, including WSOL legs that can otherwise obscure SOL flow.",
    ],
    mode: "read",
  },
  {
    id: "token-add",
    title: "slrd token",
    syntax: "slrd token <token_ca> [name] [--metadata-json <json>]",
    summary: "Inspect a mint and persist it in the Solard token registry.",
    behavior: [
      "Adding a token reads mint state and asks registered venue adapters to inspect it, then persists decimals, token program, venue hints, and supplied metadata.",
    ],
    mode: "local-write",
  },
  {
    id: "token-set",
    title: "slrd token set",
    syntax:
      "slrd token set <token|ca> [--pool <address>] [--quote-mint <mint>] [--quote-program <program>] [--metadata-json <json>]",
    summary: "Patch persisted token routing/metadata fields.",
    behavior: [
      "Use this when automatic inspection cannot infer a pool or quote configuration, or when you need to attach explicit metadata used by later routing and analysis.",
    ],
    mode: "local-write",
  },
  {
    id: "token-refresh",
    title: "slrd token refresh",
    syntax: "slrd token refresh <token|ca>",
    summary:
      "Re-read mint state and venue inspection data for a registered token.",
    behavior: [
      "Refresh preserves the stored token identity while updating inspected venue metadata, decimals, token program, and refreshed timestamp.",
    ],
    mode: "local-write",
  },
  {
    id: "token-backfill",
    title: "slrd token backfill",
    syntax: [
      "slrd token backfill <ca> [--max-signatures N] [--json]",
      "slrd token backfill <ca> --materialize [--price-sample-ms 1000] [--replace] [--rpc-concurrency 2]",
      "slrd token backfill <ca> --exact [--replace] [--rpc-concurrency 2]",
    ],
    summary:
      "Build durable token history, with explicit modes for lightweight signature indexing, sampled price materialization, or exact trade reconstruction.",
    behavior: [
      "With neither --materialize nor --exact, the command indexes signatures only and deliberately avoids transaction hydration.",
      "--materialize reconstructs durable history plus sparse price candles at the requested sample interval. --exact requests exact trade reconstruction and durable sparse 1-second candle materialization from creation when coverage permits.",
    ],
    options: [
      {
        name: "--max-signatures",
        type: "integer",
        description: "Cap indexed signatures in the lightweight mode.",
      },
      {
        name: "--materialize",
        type: "boolean",
        description: "Hydrate history and materialize sampled price data.",
      },
      {
        name: "--price-sample-ms",
        type: "integer",
        defaultValue: "1000",
        description: "Sampling interval used by materialized price history.",
      },
      {
        name: "--exact",
        type: "boolean",
        description:
          "Request durable exact market fills instead of sampled-only history.",
      },
      {
        name: "--replace",
        type: "boolean",
        description: "Replace/rebuild stored materialized history.",
      },
      {
        name: "--rpc-concurrency",
        type: "integer",
        defaultValue: "2 in documented examples",
        description: "Control concurrent RPC transaction hydration.",
      },
    ],
    mode: "local-write",
  },
  {
    id: "token-trades",
    title: "slrd token trades",
    syntax:
      "slrd token trades <ca> [--from-start] [--min-sol N] [--owner <wallet>] [--side buy|sell] [--limit N] [--json]",
    summary:
      "Query the durable trade tape for a token with owner, side, size, and range filters.",
    behavior: [
      "--from-start asks for history from creation rather than a recent slice; --owner and --side narrow the stored tape without re-running execution.",
    ],
    mode: "read",
  },
  {
    id: "token-analyze",
    title: "slrd token analyze",
    syntax: "slrd token analyze <ca> [--top N] [--first N] [--json]",
    summary:
      "Analyze durable token history for market and owner-level forensics.",
    behavior: [
      "The analyzer reports aggregate market activity and owner P/L-style summaries based on reconstructed durable history; output can be switched to JSON for downstream tooling.",
    ],
    mode: "read",
  },
  {
    id: "tokens",
    title: "slrd tokens",
    syntax: "slrd tokens",
    summary: "List tokens currently stored in the canonical Solard registry.",
    mode: "read",
  },
  {
    id: "holders",
    title: "slrd holders",
    syntax: "slrd holders <token|ca> [--exclude <a,b>] [--min-raw N] [--json]",
    summary:
      "Take a complete on-chain holder snapshot directly from token-program accounts.",
    behavior: [
      "This is snapshot-based rather than websocket-delta-based and is the holder primitive intended for payout calculations.",
      "Pump/PumpSwap metadata allows Solard to exclude curve, pool, and sharing-config inventory; --exclude adds explicit owner exclusions and --min-raw sets the minimum raw balance, which otherwise defaults to one raw unit in the SDK primitive.",
    ],
    mode: "read",
  },
  {
    id: "events-live",
    title: "slrd events",
    syntax:
      "slrd events <token|ca> [--all|--swaps|--transfers|--creates|--swaps-only|--transfers-only] [--jsonl]",
    summary:
      "Stream typed live Pump/PumpSwap swap events plus mint-mentioned SPL transfers and creates for one token.",
    behavior: [
      "Use the filter flags to reduce event classes. --jsonl makes the stream machine-friendly for long-running consumers.",
    ],
    mode: "read",
  },
  {
    id: "events-history",
    title: "slrd events history",
    syntax:
      "slrd events history <token|ca> [--provider auto|solscan|rpc] [--from-slot N] [--to-slot N] [--slot-order] [--json|--jsonl]",
    summary:
      "Reconstruct historical holder-balance movements with explicit coverage/completeness reporting.",
    behavior: [
      "The provider can be chosen explicitly or left on auto. Slot bounds are diagnostic controls for this event-history path; persistent neutral replay uses its own coverage model.",
    ],
    mode: "read",
  },
  {
    id: "vanity-file",
    title: "slrd vanity",
    syntax: "slrd vanity --suffix pump --out .\\mint.json [--count N]",
    summary:
      "Generate vanity mint keypairs to files rather than the canonical encrypted wallet pool.",
    behavior: [
      "This is the direct file-output vanity generator. The pool subcommands below instead store encrypted mint keypairs in the canonical database for launch consumption.",
    ],
    mode: "external-write",
  },
  {
    id: "vanity-pool",
    title: "slrd vanity pool",
    syntax: [
      "slrd vanity pool generate --suffix pump --count N [--max-attempts N]",
      "slrd vanity pool list [--suffix pump] [--status available|reserved|used]",
      "slrd vanity pool release <mint-address>",
    ],
    summary:
      "Manage the encrypted mint-keypair pool used by launch and vamp workflows.",
    behavior: [
      "generate creates encrypted mint keypairs in the canonical DB, list filters them by suffix/status, and release moves an ambiguous or failed reservation back into a reusable state.",
      "Launch/vamp can consume this pool with --mint-pool <suffix> and may select a specific pooled mint with --mint-pool-address.",
    ],
    mode: "mixed",
  },
];

export const marketDataCommands: CommandDoc[] = [
  {
    id: "feed-serve",
    title: "slrd feed serve",
    syntax:
      "slrd feed serve [--host 127.0.0.1] [--port 8788] [--rpc-rps 5] [--rpc-read-rps 2] [--max-fallback-subs 200]",
    summary:
      "Run one shared upstream Pump/PumpSwap/LaunchLab market feed for watchers, strategies, agents, and UI consumers.",
    behavior: [
      "The feed centralizes upstream subscriptions and exposes a local WebSocket consumed by launch watchers and SDK price-feed clients.",
    ],
    mode: "read",
  },
  {
    id: "launch-watch",
    title: "slrd launch watch",
    syntax:
      "slrd launch watch [--venue pump,raydium-launchlab] [--min-mcap 5000] [--ath-step-pct 20] [--track-ttl 30m] [--feed ws://127.0.0.1:8788/ws] [--show-new] [--prices] [--json]",
    summary:
      "Watch new launches through the shared feed and emit milestone notifications.",
    behavior: [
      "The documented policy ignores Pump Mayhem launches, notifies on the first configured market-cap crossing, and then on each configured notified-ATH step while the token remains inside the tracking TTL.",
    ],
    mode: "read",
  },
  {
    id: "pump-pairs",
    title: "slrd pump pairs",
    syntax: "slrd pump pairs [--json]",
    summary:
      "Read Pump-supported quote mints from the on-chain Global account.",
    mode: "read",
  },
  {
    id: "pump-watch",
    title: "slrd pump watch",
    syntax:
      "slrd pump watch [--min-mcap 5000] [--ath-step-pct 20] [--track-ttl 30m] [--feed ws://127.0.0.1:8788/ws] [--show-new] [--prices] [--json]",
    summary: "Compatibility alias for launch watching restricted to Pump.",
    behavior: [
      "Semantically equivalent to slrd launch watch --venue pump with the same notification and feed controls.",
    ],
    mode: "read",
  },
  {
    id: "quote-buy",
    title: "slrd quote buy",
    syntax: "slrd quote buy <token|ca> --sol <amount> [--slippage-bps 1500]",
    summary:
      "Inspect the routed buy quote for a registered token without submitting a transaction.",
    mode: "read",
  },
  {
    id: "price",
    title: "slrd price",
    syntax: "slrd price <token|ca>",
    summary:
      "Sample the current venue price and persist the sample in Solard's price repository.",
    mode: "read",
  },
  {
    id: "price-average",
    title: "slrd price average",
    syntax: "slrd price average <token|ca> --period 15m",
    summary: "Average stored price samples over the requested period.",
    mode: "read",
  },
  {
    id: "price-watch",
    title: "slrd price watch",
    syntax: "slrd price watch <token|ca...> [--interval 1s] [--period 1m]",
    summary:
      "Continuously sample one or more registered tokens and display current plus rolling-average prices.",
    mode: "read",
  },
  {
    id: "backtest",
    title: "slrd backtest",
    syntax:
      "slrd backtest <mint> --dip-pct 20 --profit-pct 40 --buy-sol 0.1 [--from creation|migration|<time>] [--to <time>] [--capital-sol 5] [--slippage-bps N] [--venue-fee-bps N] [--network-fee-sol N] [--latency-ms N] [--require-from-start] [--exact-trades] [--ledger[=<csv>]] [--json]",
    summary:
      "Replay the built-in ATH-dip/profit-ladder policy against durable token history.",
    behavior: [
      "The default history input is the sparse 1-second candle tape. --exact-trades switches the simulator to durable market fills. Execution costs such as slippage, venue fee, network fee, and latency are explicit simulation inputs.",
    ],
    mode: "read",
  },
  {
    id: "tx-stream",
    title: "slrd tx stream",
    syntax: [
      "slrd tx stream --wallet <wallet|address> [--finalized] [--jsonl]",
      "slrd tx stream --wallets <a,b,c> [--finalized] [--jsonl]",
    ],
    summary:
      "Stream every transaction mentioning the selected wallet addresses until interrupted.",
    mode: "read",
  },
  {
    id: "execution-history",
    title: "slrd history",
    syntax: "slrd history",
    summary:
      "Print Solard's persisted execution history from the canonical execution repository.",
    mode: "read",
  },
  {
    id: "jito-tip-accounts",
    title: "slrd jito tip-accounts",
    syntax: "slrd jito tip-accounts [--endpoint <block-engine-url>]",
    summary:
      "Read Jito tip accounts from the configured or supplied block-engine endpoint.",
    mode: "read",
  },
];

export const tradingCommands: CommandDoc[] = [
  {
    id: "transfer",
    title: "slrd transfer",
    syntax: [
      "slrd transfer <contact|wallet|address> --wallet <source-wallet> --sol <amount> [--sender rpc|helius|jito] [--simulate-only]",
      "slrd transfer <contact|wallet|address> --wallet <source-wallet> --token <USDC|mint> --amount <ui> [--sender rpc|helius|jito] [--simulate-only]",
    ],
    summary:
      "Transfer native SOL or an SPL token to a contact, stored wallet, or raw address.",
    behavior: [
      "Exactly one of --sol or --token must be supplied. USDC is accepted as a canonical alias; arbitrary token transfers resolve mint metadata on-chain.",
      "This command executes by default. Add --simulate-only to build and simulate without broadcasting. The implementation also accepts --cu-limit, --priority-micro-lamports, --skip-simulation, and --skip-preflight for explicit transaction policy control.",
    ],
    options: [
      {
        name: "--sender",
        type: "rpc|helius|jito",
        defaultValue: "rpc",
        description: "Submission lane for the built transfer transaction.",
      },
      {
        name: "--cu-limit",
        type: "integer",
        defaultValue: "10000 SOL / 30000 token",
        description: "Compute-unit limit applied by the transfer command.",
      },
      {
        name: "--priority-micro-lamports",
        type: "integer",
        defaultValue: "0",
        description: "Compute-unit price in micro-lamports.",
      },
      {
        name: "--simulate-only",
        type: "boolean",
        description: "Return simulation output and do not send.",
      },
      {
        name: "--skip-simulation",
        type: "boolean",
        description:
          "Skip Solard's explicit pre-send simulation on live execution.",
      },
      {
        name: "--skip-preflight",
        type: "boolean",
        description:
          "Request sender-side preflight skip; --skip-simulation also implies this in the CLI.",
      },
    ],
    mode: "live-default",
  },
  {
    id: "swap",
    title: "slrd swap",
    syntax: [
      "slrd swap --from <SOL|token|mint> --to <SOL|token|mint> --amount <ui> --wallet <wallet> [--live]",
      "slrd swap <token|mint> --wallet <wallet> --sol <amount> [--live]",
    ],
    summary:
      "Run a Jupiter exact-input swap between arbitrary supported assets.",
    behavior: [
      "Without --live, this command is quote-only. The positional compatibility form represents SOL → token.",
    ],
    mode: "live-flag",
  },
  {
    id: "buy",
    title: "slrd buy",
    syntax:
      "slrd buy <token|ca> (--wallet <wallet> | --wallets <w1,w2> | --group <name>) --sol <amount> [--venue auto|native|jupiter] [--slippage-bps 1500] [--sender rpc|helius|jito] [--simulate-only]",
    summary:
      "Buy an SPL token with SOL, automatically routing between native Pump/PumpSwap execution and Jupiter unless a route is forced.",
    behavior: [
      "The command executes by default. --simulate-only builds/simulates the native route or returns a Jupiter quote without execution.",
      "Native routing requires a registered Pump/PumpSwap token. Ordinary SPL assets can use Jupiter. The default native slippage is 1500 bps and the default sender is rpc.",
      "A single wallet, explicit wallet list, or group must be selected. Multi-wallet native execution uses Solard's batch composition; Jupiter execution is deliberately sequential to avoid avoidable API bursts.",
    ],
    options: [
      {
        name: "--venue",
        type: "auto|native|jupiter",
        defaultValue: "auto",
        description: "Choose the route resolver or force one execution family.",
      },
      {
        name: "--slippage-bps",
        type: "integer",
        defaultValue: "1500",
        description: "Native Pump/PumpSwap slippage tolerance.",
      },
      {
        name: "--sender",
        type: "rpc|helius|jito",
        defaultValue: "rpc",
        description: "Native Solard sender lane.",
      },
      {
        name: "--simulate-only",
        type: "boolean",
        description:
          "Prevent execution; native route simulates, Jupiter route quotes.",
      },
    ],
    mode: "live-default",
  },
  {
    id: "spam-buy",
    title: "slrd spam-buy / buy --spam",
    syntax: [
      "slrd buy <future-mint> (--wallet <wallet> | --group <name>) (--sol <amount> | --lamports <amount> | --min-bps N --max-bps N) --spam [--live]",
      "slrd spam-buy [pump] <future-mint> (--wallet <wallet> | --group <name>) (--sol <amount> | --lamports <amount> | --min-bps N --max-bps N) [--sender <id>] [--live]",
    ],
    summary:
      "Continuously attempt a buy against a future Pump mint for launch-time execution workflows.",
    behavior: [
      "This is a guarded live family: --live is required for broadcasting. It can use a fixed amount or randomized basis-point range according to the supplied flags.",
    ],
    mode: "live-flag",
  },
  {
    id: "sell",
    title: "slrd sell",
    syntax:
      "slrd sell <token|ca> (--wallet <wallet> | --wallets <w1,w2> | --group <name>) [--bps 10000] [--venue auto|native|jupiter] [--slippage-bps 1500] [--sender rpc|helius|jito] [--simulate-only]",
    summary:
      "Sell a percentage of token balance into SOL through native Pump/PumpSwap routing or Jupiter.",
    behavior: [
      "This command executes by default. --bps defaults to 10000 (100%) and must be between 1 and 10000.",
      "For Jupiter, the implementation sells associated-token-account balance only, calculates the requested basis-point fraction per wallet, and runs sequentially. --simulate-only quotes each Jupiter plan or simulates native plans.",
    ],
    options: [
      {
        name: "--bps",
        type: "integer",
        defaultValue: "10000",
        description: "Fraction of sellable token balance in basis points.",
      },
      {
        name: "--venue",
        type: "auto|native|jupiter",
        defaultValue: "auto",
        description: "Automatic or forced route family.",
      },
      {
        name: "--slippage-bps",
        type: "integer",
        defaultValue: "1500",
        description: "Native route slippage tolerance.",
      },
      {
        name: "--sender",
        type: "rpc|helius|jito",
        defaultValue: "rpc",
        description: "Native route sender.",
      },
      {
        name: "--simulate-only",
        type: "boolean",
        description: "Prevent broadcast; simulate native or quote Jupiter.",
      },
    ],
    mode: "live-default",
  },
  {
    id: "sweep",
    title: "slrd sweep",
    syntax: [
      "slrd sweep --to <contact|wallet|address> --below <SOL> [--wallets <a,b,...>] [--keep <wallet=SOL,...>] [--simulate | --live] [--json]",
      "slrd sweep sol --to <destination> --max-balance-sol <SOL>",
    ],
    summary:
      "Consolidate SOL from stored wallets whose balances are strictly below a threshold.",
    behavior: [
      "Preview is the default. --simulate exercises transactions without broadcasting; --live performs the sweep. --keep can retain wallet-specific SOL reserves. The second form is a compatibility alias.",
    ],
    mode: "plan",
  },
  {
    id: "liquidate",
    title: "slrd liquidate tokens",
    syntax:
      "slrd liquidate tokens [--except <token|mint>] [--wallets <a,b,...>] [--except-wallet <wallet>] [--except-wallets <a,b,...>] [--slippage-bps 1500] [--no-jupiter] [--burn-unsellable] [--rounds 3] [--simulate | --live]",
    summary:
      "Scan selected stored wallets and dispose of supported token balances while honoring explicit token/wallet exclusions.",
    behavior: [
      "The command previews by default, can simulate, and only broadcasts with --live. Jupiter fallback can be disabled. --burn-unsellable allows destructive cleanup of balances that cannot be sold, so it should be treated separately from ordinary liquidation.",
    ],
    mode: "plan",
  },
  {
    id: "unwrap-wsol",
    title: "slrd unwrap-wsol",
    syntax:
      "slrd unwrap-wsol (--all-wallets | --wallet <wallet> | --wallets <w1,w2> | --group <name>) [--sender rpc|helius|jito] [--ignore-missing] [--simulate-only] [--destination <address>]",
    summary:
      "Close every owned WSOL token account for the selected wallets, including non-associated token accounts.",
    behavior: [
      "This command executes by default unless --simulate-only is present. It enumerates actual WSOL token accounts, verifies close authority, closes them individually, and re-checks on-chain account closure after each live transaction.",
      "--destination is only valid for a single selected wallet. --ignore-missing/--skip-missing suppresses an error when no WSOL accounts are found. An all-wallets selection implies skip-missing behavior.",
    ],
    mode: "live-default",
  },
  {
    id: "reclaim",
    title: "slrd reclaim",
    syntax: [
      "slrd reclaim inspect --all-wallets",
      "slrd reclaim buffers --all-wallets [--simulate | --live]",
      "slrd reclaim programs --all-wallets [--simulate | --live --confirm-program-close]",
      "slrd reclaim all --all-wallets [--simulate | --live --confirm-program-close]",
    ],
    summary:
      "Inspect and close Loader-v3 buffer/program accounts controlled by stored wallets to reclaim lamports.",
    behavior: [
      "Program closure is irreversible. Live program closure requires the additional --confirm-program-close acknowledgment. The command also refuses reclaim execution when its authority scan was incomplete.",
    ],
    mode: "plan",
  },
  {
    id: "claim",
    title: "slrd claim",
    syntax:
      "slrd claim <token|ca> --wallet <wallet> [--sender rpc|helius|jito]",
    summary:
      "Compatibility shorthand for a creator-fee claim; returns the resulting send receipt.",
    behavior: [
      "The selected wallet is the fee payer. Where the claim source is permissionless, the configured on-chain beneficiary receives the reward rather than the fee payer.",
    ],
    mode: "live-default",
  },
  {
    id: "transfer-many",
    title: "slrd transfer-many",
    syntax: [
      "slrd transfer-many --wallet <wallet> (--token <mint>|--sol) --file <allocations.json> [--id <stable-id> --live]",
      "slrd transfer-many status <stable-id>",
      "slrd transfer-many resume <stable-id> [--sender rpc|helius]",
    ],
    summary:
      "Run or resume a durable multi-recipient cumulative distribution from an allocation file.",
    behavior: [
      "The initial command plans by default; --live executes. A stable id lets the durable state reconcile confirmed payments and continue without paying already-confirmed amounts again.",
      "status is read-only. resume signs and continues an existing distribution state using its remembered pending/confirmed information.",
    ],
    mode: "live-flag",
  },
  {
    id: "rewards-history",
    title: "slrd rewards history",
    syntax:
      "slrd rewards history <token|ca> [--wallet <reward-recipient>] [--provider auto|solscan|rpc] [--json|--jsonl]",
    summary:
      "Build persistent neutral replay history for reward accounting, optionally scoped to a recipient.",
    behavior: [
      "Persistent replay intentionally rejects bounded diagnostic flags such as --from-slot and --to-slot; use slrd events history when you need bounded history inspection.",
    ],
    mode: "read",
  },
  {
    id: "rewards-distribute",
    title: "slrd rewards distribute",
    syntax:
      "slrd rewards distribute <token|ca> --wallet <beneficiary> --snapshot <snapshot.json> [--reward-mint <mint>] [--reserve-raw N] [--max-per-tx N] [--sender rpc|helius|jito] [--live]",
    summary:
      "Pay outstanding cumulative holder entitlements from a snapshot until the durable distribution reaches completion or a stopping condition.",
    behavior: [
      "Without --live, the command returns a distribution plan. Live execution calls the same process-level live-trading gate before distribution.execute(). Entitlements are cumulative: confirmed payments are remembered and subtracted from future outstanding amounts.",
    ],
    mode: "live-flag",
  },
  {
    id: "rewards-stop",
    title: "slrd rewards stop",
    syntax: "slrd rewards stop <token|ca>",
    summary:
      "Request that a supervised distribution stop before its next transfer.",
    behavior: [
      "The in-process CLI implementation can report that no process-level stop state exists and direct the operator to stop the supervising process; this command is meaningful only when paired with a supervisor/runtime that honors that state.",
    ],
    mode: "read",
  },
  {
    id: "rewards-status-audit",
    title: "slrd rewards status / audit",
    syntax: [
      "slrd rewards status <token|ca>",
      "slrd rewards audit <token|ca> [--holder <wallet>]",
    ],
    summary: "Inspect remembered cumulative entitlement and payment state.",
    behavior: [
      "status returns the whole durable distribution state. audit can narrow the recipients list to one holder while preserving the same remembered distribution metadata.",
    ],
    mode: "read",
  },
  {
    id: "rewards-inspect",
    title: "slrd rewards inspect",
    syntax: "slrd rewards inspect <token|ca>",
    summary:
      "Resolve the creator-reward claim source and inspect quote asset, estimated accrual, and payout targets without sending a claim.",
    behavior: [
      "The command refreshes token metadata when possible, resolves a claim plan, and explains that the transaction wallet is a fee payer while the configured beneficiary receives the reward for permissionless claim sources.",
    ],
    mode: "read",
  },
  {
    id: "rewards-claim",
    title: "slrd rewards claim",
    syntax:
      "slrd rewards claim <token|ca> --wallet <fee-payer> [--id <stable-claim-id>] [--basis <reward-basis.json>] [--sender rpc|helius|jito] [--skip-simulation] [--skip-preflight]",
    summary:
      "Execute a durable creator-fee claim with optional idempotency/reconciliation metadata.",
    behavior: [
      "A basis file must contain id, slot, and hash and may include observedAtMs. The result includes estimated/claimed raw amount, payout records, receipt, claim slot/signature, and the basis checkpoint.",
    ],
    mode: "live-default",
  },
  {
    id: "rewards-claim-status",
    title: "slrd rewards claim-status",
    syntax: "slrd rewards claim-status <stable-claim-id>",
    summary: "Read durable creator-fee claim state by stable claim id.",
    mode: "read",
  },
];

export const launchCommands: CommandDoc[] = [
  {
    id: "launch-pump",
    title: "slrd launch pump",
    syntax:
      "slrd launch pump --creator <wallet> (--uri <metadata_uri> | --metadata <json> | --image <path> --description <text>) [--pair SOL|USDC|<custom-quote-mint>] [--beneficiary <wallet|address>] [--alias <name>] [--live] [--skip-simulation] [--deployment-sender helius-rpc|helius-fast] [--helius-tip-sol 0.01]",
    summary:
      "Build and optionally broadcast a Pump token deployment from a stored creator wallet.",
    behavior: [
      "Metadata can be supplied as an existing URI, JSON payload, or local image plus description. Local launch planning resolves a real signing wallet even before broadcast, while actual broadcast is controlled by --live.",
    ],
    mode: "live-flag",
  },
  {
    id: "prepare-pump",
    title: "slrd prepare pump",
    syntax:
      "slrd prepare pump --payer <phantom-address> --name <name> --symbol <symbol> --uri <metadata_uri> [--pair SOL|USDC|<custom-quote-mint>] [--beneficiary <address>] [--out prepared.json]",
    summary:
      "Build an externally payable Pump deployment while leaving the payer signature absent.",
    behavior: [
      "The command mint-partial-signs the prepared transaction, keeps the supplied payer unsigned, writes a preparation artifact when requested, and never broadcasts.",
    ],
    mode: "plan",
  },
  {
    id: "metadata-upload",
    title: "slrd metadata upload",
    syntax:
      "slrd metadata upload --image <local_path> --name <name> --symbol <symbol> --description <text> [--provider pump-frontend|pinata] [--twitter <url>] [--telegram <url>] [--website <url>] [--video <url>] [--hide-name]",
    summary:
      "Upload token metadata and media through the configured Pump frontend or Pinata path.",
    behavior: [
      "The default provider is controlled by SLRD_METADATA_UPLOADER and otherwise defaults to pump-frontend. Pinata requires PINATA_JWT.",
    ],
    mode: "external-write",
  },
  {
    id: "vamp",
    title: "slrd vamp",
    syntax:
      "slrd vamp <source-mint> --creator <wallet> [--name <name>] [--symbol <symbol>] [--image <path-or-url>] [--description <text>] [--website <url>] [--twitter <url>] [--telegram <url>] [--video <url>] [--uri <metadata-uri>] [--buy-plan <file>] [--mint-pool pump] [--submit-mode jito-bundle] [--live] [--skip-simulation]",
    summary:
      "Create a new launch using metadata derived from or associated with an existing source mint, with optional buy planning and pooled vanity mint selection.",
    behavior: [
      "This command requires access to a signing creator wallet even for its local construction path. --live controls broadcast, and Jito bundle submission can be selected explicitly.",
    ],
    mode: "live-flag",
  },
  {
    id: "deploy-pump",
    title: "slrd deploy pump",
    syntax:
      "slrd deploy pump --wallet <wallet> --name <name> --symbol <symbol> (--uri <metadata_uri> | --image <local_path> --description <text>) [--pair SOL|USDC|<custom-quote-mint>] [--beneficiary <wallet|address>] [--alias <name>] [--live] [--twitter <url>] [--telegram <url>] [--website <url>] [--video <url>] [--hide-name]",
    summary:
      "Higher-level Pump deployment command that can upload metadata and then construct the launch.",
    behavior: [
      "The command combines metadata preparation with deployment. Broadcast remains explicit through --live.",
    ],
    mode: "live-flag",
  },
];

export const automationCommands: CommandDoc[] = [
  {
    id: "scripts",
    title: "slrd scripts",
    syntax: "slrd scripts",
    summary: "List scripts registered in slrd.config.ts.",
    mode: "read",
  },
  {
    id: "run",
    title: "slrd run",
    syntax: [
      "slrd run <name-or-path> [script flags...]",
      "slrd run snipe --name <exact_name> --group <group> --sol 0.05 --sender jito",
    ],
    summary:
      "Execute a registered or path-based Bun/TypeScript script that imports Solard.",
    behavior: [
      "Live behavior is script-defined. The CLI treats --live runs as signing operations for vault preparation, but each script controls its own transaction logic.",
    ],
    mode: "mixed",
  },
  {
    id: "strategy-run",
    title: "slrd strategy run",
    syntax:
      "slrd strategy run <file.ts> --token <mint|alias> --wallet <wallet> [--params <json>] [--feed ws://127.0.0.1:8788/ws] [--live]",
    summary:
      "Run an onPrice event strategy against the shared feed with wallet/execution state isolated per strategy agent.",
    behavior: [
      "The same strategy file can be backtested with the next command. Broadcast is explicit through --live.",
    ],
    mode: "live-flag",
  },
  {
    id: "strategy-backtest",
    title: "slrd strategy backtest",
    syntax:
      "slrd strategy backtest <file.ts> --token <mint> [--params <json>] [--capital-sol 1] [--price-sample 5s] [--sol-usd N] [--json]",
    summary:
      "Replay an onPrice strategy file over durable token history instead of the live feed.",
    mode: "read",
  },
  {
    id: "group-create",
    title: "slrd group create",
    syntax: "slrd group create <name> [description]",
    summary: "Create a persisted wallet group.",
    mode: "local-write",
  },
  {
    id: "group-add",
    title: "slrd group add",
    syntax: "slrd group add <group> <wallet> [weight_bps]",
    summary: "Add one wallet to a group with an optional basis-point weight.",
    mode: "local-write",
  },
  {
    id: "group-add-many",
    title: "slrd group add-many",
    syntax: "slrd group add-many <group> <wallet1,wallet2,...>",
    summary: "Add multiple stored wallets to a group in one command.",
    mode: "local-write",
  },
  {
    id: "group-show",
    title: "slrd group show / list",
    syntax: ["slrd group show <group>", "slrd group list"],
    summary:
      "Inspect one group with resolved wallet addresses or list all persisted groups.",
    mode: "read",
  },
  {
    id: "group-trading",
    title: "Group buy/sell",
    syntax: [
      "slrd buy <token|ca> --group <name> --sol <amount> --sender jito",
      "slrd sell <token|ca> --group <name> --sender jito",
    ],
    summary:
      "Target a persisted wallet group from the normal buy/sell commands.",
    behavior: [
      "With the Jito sender, group transactions are submitted as bundles in batches of five transactions per bundle according to the CLI help contract.",
    ],
    mode: "live-default",
  },
  {
    id: "agent",
    title: "slrd agent",
    syntax: [
      "slrd agent create <name> --wallet <wallet> [--config-json <json>]",
      "slrd agent list",
    ],
    summary:
      "Persist lightweight agent definitions bound to stored signing wallets and optional JSON configuration.",
    mode: "mixed",
  },
  {
    id: "watch",
    title: "slrd watch",
    syntax: [
      "slrd watch token <token|ca> [label]",
      "slrd watch wallet <wallet> [label]",
      "slrd watch program <address> [label]",
      "slrd watch list",
    ],
    summary:
      "Persist active watch targets for tokens, wallets, or arbitrary programs and list currently active watches.",
    mode: "mixed",
  },
  {
    id: "alt",
    title: "slrd alt",
    syntax: [
      "slrd alt add <address> [label]",
      "slrd alt list",
      "slrd alt create --wallet <wallet>",
      "slrd alt extend <address> --wallet <wallet> <account...>",
    ],
    summary:
      "Register, create, list, and extend Solana address lookup tables used by transaction assembly.",
    behavior: [
      "create and extend are signing operations; add/list only manage or inspect known ALT addresses.",
    ],
    mode: "mixed",
  },
  {
    id: "jito-tip",
    title: "slrd jito tip-accounts",
    syntax: "slrd jito tip-accounts [--endpoint <block-engine-url>]",
    summary:
      "Inspect tip accounts from a Jito block engine for bundle submission workflows.",
    mode: "read",
  },
];
