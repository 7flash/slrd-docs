import { Callout, DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";

export default function CliMeteoraPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Meteora DLMM"
      description="The complete Meteora CLI surface from the supplied source: discovery, indexed/on-chain inspection, OHLCV, positions, portfolio/history, quoting, liquidity management, migration, claims, and swaps."
    >
      <Callout title="Meteora writes are prepare-first">
        <p>
          Position and swap commands are prepare/simulation flows unless{" "}
          <code>--live</code> is supplied. Live execution still requires{" "}
          <code>SOLARD_ENABLE_LIVE_TRADES=1</code>. The source also states that
          live sends simulate first and keep preflight enabled unless explicitly
          skipped.
        </p>
      </Callout>

      <h2 id="discovery">Discovery and pool inspection</h2>
      <CommandRef
        id="meteora-discover"
        title="slrd meteora discover"
        syntax="slrd meteora discover [--timeframe 30m] [--category all|top|new|trending] [--sort fee-active-tvl] [--direction asc|desc] [--limit 20] [--min-tvl N] [--min-active-tvl N] [--min-volume N] [--page-size 100] [--launchpad <name>] [--safe] [--filter <expr>]"
        summary="Read the ranked Meteora Pool Discovery feed and apply server/local filters before displaying candidates."
        behavior={[
          "The implementation caps --limit and --page-size at 100. The discovery API is treated as one ranked feed rather than a true paginated list, so page-size controls breadth rather than a page number.",
          "Supported discover sorts are fee-active-tvl, fee, volume, active-tvl, and tvl. Direction must be asc or desc. --category all removes the category constraint; top, new, and trending are sent as discovery subsets.",
          "--safe adds filters excluding critical warnings and high single ownership. If the upstream API rejects active_tvl filtering with HTTP 400/422, Solard retries without that server filter and applies the minimum active TVL locally.",
        ]}
        mode="read"
      />
      <CommandRef
        id="meteora-opportunities"
        title="slrd meteora opportunities"
        syntax="slrd meteora opportunities [--timeframe 30m] [--sort flow-inactive|inactive|fee-active|volume-active] [--launchpad pump.fun] [--safe] [--risk-screen] [--min-inactive-pct N] [--min-volume-active N] [--limit 20]"
        summary="Rank DLMM opportunities using activity/inactivity-oriented scoring and optional safety/risk screening."
        mode="read"
      />
      <CommandRef
        id="meteora-token-pools"
        title="slrd meteora token-pools"
        syntax="slrd meteora token-pools <mint|symbol> [--timeframe 30m] [--sort flow-inactive|fee-active|inactive] [--limit 20]"
        summary="Find DLMM pools associated with one token mint or symbol and rank the matching pool set."
        mode="read"
      />
      <CommandRef
        id="meteora-pools"
        title="slrd meteora pools"
        syntax="slrd meteora pools [--timeframe 30m] [--sort fee-tvl|volume|tvl] [--limit 20] [--min-tvl N] [--min-volume N]"
        summary="List indexed DLMM pools with basic TVL/volume filters and ranking."
        mode="read"
      />
      <CommandRef
        id="meteora-pool"
        title="slrd meteora pool"
        syntax="slrd meteora pool <pool> [--timeframe 30m]"
        summary="Show detailed indexed and normalized information for one DLMM pool."
        mode="read"
      />
      <CommandRef
        id="meteora-candles"
        title="slrd meteora candles"
        syntax="slrd meteora candles <pool> [--timeframe 5m] [--start-time unix] [--end-time unix]"
        summary="Fetch indexed OHLCV candles for a pool, optionally bounded by inclusive Unix-second timestamps."
        mode="read"
      />
      <CommandRef
        id="meteora-active-bin"
        title="slrd meteora active-bin"
        syntax="slrd meteora active-bin <pool>"
        summary="Read the pool's current active bin from normalized on-chain state."
        mode="read"
      />
      <CommandRef
        id="meteora-stats"
        title="slrd meteora stats"
        syntax="slrd meteora stats [--series protocol-fees|trading-fees|volume]"
        summary="Read Meteora aggregate/statistical series exposed through the service."
        mode="read"
      />
      <CommandRef
        id="meteora-quote"
        title="slrd meteora quote"
        syntax="slrd meteora quote <pool> (--in-x N|--in-y N|--out-x N|--out-y N) [--slippage-bps 100]"
        summary="Quote a DLMM swap by exact input or requested output direction without executing it."
        behavior={[
          "Exactly one amount/direction selector is expected: input X, input Y, output X, or output Y. The documented slippage default is 100 bps.",
        ]}
        mode="read"
      />

      <h2 id="positions-read">Position and portfolio inspection</h2>
      <CommandRef
        id="meteora-positions"
        title="slrd meteora positions"
        syntax={[
          "slrd meteora positions --wallet <wallet|address> [--pool <pool>]",
          "slrd meteora positions --all-wallets",
        ]}
        summary="List DLMM positions for one wallet/address or across all stored wallets, optionally narrowed to a pool."
        mode="read"
      />
      <CommandRef
        id="meteora-position"
        title="slrd meteora position"
        syntax="slrd meteora position <position> (--wallet <wallet|address> | --pool <pool>)"
        summary="Inspect one position while supplying enough wallet or pool context for resolution."
        mode="read"
      />
      <CommandRef
        id="meteora-portfolio"
        title="slrd meteora portfolio"
        syntax="slrd meteora portfolio --wallet <wallet|address> [--open]"
        summary="Aggregate a wallet's Meteora portfolio; --open narrows to currently open positions."
        mode="read"
      />
      <CommandRef
        id="meteora-history"
        title="slrd meteora history"
        syntax="slrd meteora history <position>"
        summary="Read persisted/indexed history associated with one DLMM position."
        mode="read"
      />

      <h2 id="position-writes">Position management</h2>
      <CommandRef
        id="meteora-open"
        title="slrd meteora open / create"
        syntax="slrd meteora open|create <pool> --wallet <wallet> --sol N --bins 40 [--strategy spot] [--live]"
        summary="Prepare or open a new DLMM liquidity position funded from SOL according to a bin range and strategy."
        behavior={[
          "open and create are aliases in this CLI surface. The documented strategy default is spot. Without --live, no transaction is broadcast.",
        ]}
        mode="live-flag"
      />
      <CommandRef
        id="meteora-add"
        title="slrd meteora add"
        syntax="slrd meteora add <position> --wallet <wallet> --sol N [--pool <pool>] [--live]"
        summary="Prepare or add liquidity to an existing position, optionally supplying the pool explicitly."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-remove"
        title="slrd meteora remove"
        syntax="slrd meteora remove <position> --wallet <wallet> [--bps 10000] [--pool <pool>] [--live]"
        summary="Prepare or remove a basis-point fraction of liquidity from a position; 10000 bps represents the full amount."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-close"
        title="slrd meteora close"
        syntax="slrd meteora close <position> --wallet <wallet> [--pool <pool>] [--live]"
        summary="Prepare or close one position."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-close-all"
        title="slrd meteora close-all"
        syntax={[
          "slrd meteora close-all <pool> --wallet <wallet> [--live]",
          "slrd meteora close-all --wallet <wallet> --all-pools [--live]",
          "slrd meteora close-all --all-wallets --all-pools [--live]",
        ]}
        summary="Prepare or close multiple positions scoped by pool, wallet, or the explicit all-wallets/all-pools selectors."
        notes={[
          "The broadest form is intentionally explicit: both --all-wallets and --all-pools must be supplied.",
        ]}
        mode="live-flag"
      />
      <CommandRef
        id="meteora-move"
        title="slrd meteora move"
        syntax="slrd meteora move <position> --wallet <wallet> [--pool <pool>] [--bins N] [--haircut-bps 100] [--live]"
        summary="Reposition liquidity within the same pool, rebuilding the range around a new target with optional haircut tolerance."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-migrate"
        title="slrd meteora migrate"
        syntax="slrd meteora migrate <position> --wallet <wallet> --to-pool <pool> [--from-pool <source-pool>] [--bins N] [--haircut-bps 100] [--live]"
        summary="Move liquidity from one DLMM pool into another, with optional explicit source-pool context, bin range, and haircut tolerance."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-claim"
        title="slrd meteora claim"
        syntax="slrd meteora claim <position> --wallet <wallet> [--kind fees|rewards|all] [--pool <pool>] [--live]"
        summary="Prepare or claim fees, rewards, or both from one position."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-claim-all"
        title="slrd meteora claim-all"
        syntax="slrd meteora claim-all <pool> --wallet <wallet> [--kind fees|rewards|all] [--live]"
        summary="Prepare or claim the selected reward class across all eligible positions for one wallet in a pool."
        mode="live-flag"
      />
      <CommandRef
        id="meteora-swap"
        title="slrd meteora swap"
        syntax="slrd meteora swap <pool> --wallet <wallet> (--in-x N|--in-y N|--out-x N|--out-y N) [--live]"
        summary="Prepare or execute a DLMM swap in a known pool using the same X/Y input/output direction model as the quote command."
        mode="live-flag"
      />
    </DocsPage>
  );
}
