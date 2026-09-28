export type DocEntry = {
  href: string;
  title: string;
  section: string;
  description: string;
  keywords: string[];
};

export const docGroups = [
  {
    title: "Start",
    pages: [
      ["/", "Overview"],
      ["/getting-started", "Getting started"],
      ["/configuration", "Configuration"],
    ],
  },
  {
    title: "SDK",
    pages: [
      ["/sdk", "SDK overview"],
      ["/sdk/client", "Client methods"],
      ["/sdk/history-events", "History & events"],
      ["/sdk/rewards", "Claims & distributions"],
      ["/sdk/price-feed", "Shared price feed"],
      ["/sdk/types", "Types & return values"],
    ],
  },
  {
    title: "CLI",
    pages: [
      ["/cli", "CLI overview"],
      ["/cli/wallets-tokens", "Wallets & tokens"],
      ["/cli/market-data", "Market data & history"],
      ["/cli/trading", "Trading & operations"],
      ["/cli/launching", "Launching & metadata"],
      ["/cli/automation", "Automation & agents"],
      ["/cli/meteora", "Meteora DLMM"],
      ["/cli/raydium", "Raydium"],
    ],
  },
  {
    title: "Concepts",
    pages: [
      ["/venues", "Venues & routing"],
      ["/meteora-autopilot", "Meteora autopilot"],
      ["/safety", "Execution & safety"],
    ],
  },
  {
    title: "Reference",
    pages: [["/api-reference", "Reference index"]],
  },
] as const;

export const docEntries: DocEntry[] = [
  {
    href: "/",
    title: "Solard documentation",
    section: "Start",
    description:
      "Developer documentation for the public SDK, CLI, trading engine, history, venues, rewards, and automation.",
    keywords: ["overview", "solana", "sdk", "cli", "trading", "docs"],
  },
  {
    href: "/getting-started",
    title: "Getting started",
    section: "Start",
    description:
      "Install Solard, configure RPC and wallet encryption, create a client, and run the first read and write operations.",
    keywords: ["install", "bun", "quickstart", "rpc", "wallet", "createSolard"],
  },
  {
    href: "/configuration",
    title: "Configuration",
    section: "Start",
    description:
      "Environment variables for database paths, wallet encryption, RPC limits, senders, Pump, PumpSwap, Meteora, and web auth.",
    keywords: [
      "environment",
      "SLRD_MASTER_KEY",
      "RPC_ENDPOINT",
      "SOLARD_ENABLE_LIVE_TRADES",
      "helius",
      "jito",
    ],
  },
  {
    href: "/sdk",
    title: "SDK overview",
    section: "SDK",
    description:
      "What @solard/sdk exports, what the curated client intentionally hides, and how the SDK is organized.",
    keywords: [
      "@solard/sdk",
      "createSolard",
      "createTraderSolard",
      "exports",
      "membrane",
    ],
  },
  {
    href: "/sdk/client",
    title: "SDK client methods",
    section: "SDK",
    description:
      "Exact signatures and behavior for wallet, token, holder, balance, price, buy, sell, and lifecycle methods.",
    keywords: [
      "createWallet",
      "importWallet",
      "addToken",
      "snapshotHolders",
      "walletBalances",
      "samplePrice",
      "buy",
      "sell",
    ],
  },
  {
    href: "/sdk/history-events",
    title: "SDK history & events",
    section: "SDK",
    description:
      "Replay history, market history, merged histories, replay subscriptions, coverage, and stream shutdown.",
    keywords: [
      "history.replay",
      "history.market",
      "events",
      "ReplayOptions",
      "ReplayCoverage",
      "market history",
    ],
  },
  {
    href: "/sdk/rewards",
    title: "SDK claims & distributions",
    section: "SDK",
    description:
      "Creator-fee claims and durable cumulative entitlement distributions, including planning, execution, and status.",
    keywords: [
      "claims",
      "creator fees",
      "distributions",
      "entitlements",
      "rewards",
      "payouts",
    ],
  },
  {
    href: "/sdk/price-feed",
    title: "SDK shared price feed",
    section: "SDK",
    description:
      "connectPriceFeed and createPriceFeed, subscription commands, launch messages, price messages, reconnection, and listeners.",
    keywords: [
      "price feed",
      "websocket",
      "connectPriceFeed",
      "createPriceFeed",
      "watchPrice",
      "launch",
    ],
  },
  {
    href: "/sdk/types",
    title: "SDK types & return values",
    section: "SDK",
    description:
      "Reference for amounts, token and wallet refs, holder snapshots, market prices, receipts, replay items, and distribution state.",
    keywords: [
      "types",
      "HumanAmount",
      "WalletRef",
      "TokenRef",
      "SendReceipt",
      "TokenHolderSnapshot",
    ],
  },
  {
    href: "/cli",
    title: "CLI overview",
    section: "CLI",
    description:
      "How slrd parses commands, prompts for the ephemeral wallet password, reports telemetry, and chooses live versus simulation behavior.",
    keywords: ["slrd", "commands", "help", "measure", "live", "simulate"],
  },
  {
    href: "/cli/wallets-tokens",
    title: "CLI wallets & tokens",
    section: "CLI",
    description:
      "Wallet creation/import/export, contacts, balances, token registry, holders, events, and vanity mint commands.",
    keywords: [
      "wallet create",
      "import",
      "export",
      "contacts",
      "token backfill",
      "holders",
      "events",
      "vanity",
    ],
  },
  {
    href: "/cli/market-data",
    title: "CLI market data & history",
    section: "CLI",
    description:
      "Shared market feed, launch discovery, Pump discovery, quotes, prices, token history, backtesting, and transaction streams.",
    keywords: [
      "feed serve",
      "launch watch",
      "pump watch",
      "price",
      "quote",
      "backtest",
      "tx stream",
    ],
  },
  {
    href: "/cli/trading",
    title: "CLI trading & operations",
    section: "CLI",
    description:
      "Transfers, buys, sells, swaps, sweeps, liquidation, WSOL unwrap, reclaim, claims, transfer-many, and reward operations.",
    keywords: [
      "transfer",
      "buy",
      "sell",
      "swap",
      "sweep",
      "liquidate",
      "unwrap-wsol",
      "reclaim",
      "rewards",
    ],
  },
  {
    href: "/cli/launching",
    title: "CLI launching & metadata",
    section: "CLI",
    description:
      "Pump launch, external payer preparation, metadata uploads, deploy, vamp, mint pools, and transport controls.",
    keywords: [
      "launch pump",
      "prepare pump",
      "metadata upload",
      "deploy pump",
      "vamp",
      "mint pool",
    ],
  },
  {
    href: "/cli/automation",
    title: "CLI automation & agents",
    section: "CLI",
    description:
      "Scripts, event strategies, groups, agents, watches, Jito helpers, and address lookup tables.",
    keywords: ["scripts", "strategy", "group", "agent", "watch", "alt", "jito"],
  },
  {
    href: "/cli/meteora",
    title: "CLI Meteora DLMM",
    section: "CLI",
    description:
      "Complete Meteora read, quote, position, migration, claim, close, and swap command reference.",
    keywords: [
      "meteora",
      "dlmm",
      "discover",
      "positions",
      "open",
      "move",
      "migrate",
      "claim-all",
      "swap",
    ],
  },
  {
    href: "/cli/raydium",
    title: "CLI Raydium",
    section: "CLI",
    description:
      "Raydium quotes and swaps, LaunchLab configs/launch/buy/sell, and CPMM pool creation.",
    keywords: ["raydium", "launchlab", "cpmm", "quote", "swap"],
  },
  {
    href: "/venues",
    title: "Venues & routing",
    section: "Concepts",
    description:
      "How Solard distinguishes Pump, PumpSwap, Raydium, Jupiter, and Meteora execution paths.",
    keywords: [
      "venue",
      "routing",
      "pump",
      "pumpswap",
      "jupiter",
      "raydium",
      "meteora",
    ],
  },
  {
    href: "/meteora-autopilot",
    title: "Meteora autopilot",
    section: "Concepts",
    description:
      "Deterministic screening, management plans, policy review, persistent lessons, and guarded autonomous LP execution.",
    keywords: [
      "autopilot",
      "meteora",
      "agent",
      "screening",
      "management",
      "lessons",
    ],
  },
  {
    href: "/safety",
    title: "Execution & safety",
    section: "Concepts",
    description:
      "The real execution model: which commands broadcast by default, which require --live, how simulation works, and how signing keys are protected.",
    keywords: [
      "safety",
      "simulation",
      "live",
      "master key",
      "wallet",
      "broadcast",
    ],
  },
  {
    href: "/api-reference",
    title: "Reference index",
    section: "Reference",
    description: "Single-page index linking every SDK and CLI reference area.",
    keywords: ["reference", "api", "commands", "methods", "index"],
  },
];
