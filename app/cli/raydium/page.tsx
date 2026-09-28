import { Callout, DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";

export default function CliRaydiumPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Raydium"
      description="Complete Raydium CLI reference for exact-input quotes/swaps, LaunchLab configuration and trading, and arbitrary SPL/SPL CPMM creation."
    >
      <Callout title="Raydium write policy">
        <p>
          Every Raydium write is simulation-only unless <code>--live</code> is
          supplied. Live writes additionally require{" "}
          <code>SOLARD_ENABLE_LIVE_TRADES=1</code>.
        </p>
      </Callout>
      <h2 id="swap">Quotes and swaps</h2>
      <CommandRef
        id="raydium-quote"
        title="slrd raydium quote"
        syntax="slrd raydium quote --from <SOL|token|mint> --to <SOL|token|mint> --amount <ui> [--slippage-bps 100]"
        summary="Request an exact-input Raydium route quote without creating or sending a transaction."
        behavior={[
          "The command resolves both assets, converts the UI input amount to raw units, and returns expected output plus minimum output after slippage. The documented default slippage is 100 bps.",
        ]}
        mode="read"
      />
      <CommandRef
        id="raydium-swap"
        title="slrd raydium swap"
        syntax="slrd raydium swap --from <SOL|token|mint> --to <SOL|token|mint> --amount <ui> --wallet <wallet> [--slippage-bps 100] [--live]"
        summary="Build a Raydium exact-input swap for one stored wallet and simulate it unless live execution is explicitly enabled."
        mode="live-flag"
      />

      <h2 id="launchlab">LaunchLab</h2>
      <CommandRef
        id="launchlab-configs"
        title="slrd raydium launchlab configs"
        syntax="slrd raydium launchlab configs [--quote <SOL|token|mint>]"
        summary="List LaunchLab launch configurations, optionally filtered/resolved for a quote asset."
        mode="read"
      />
      <CommandRef
        id="launchlab-launch"
        title="slrd raydium launchlab launch"
        syntax="slrd raydium launchlab launch --wallet <wallet> --name <name> --symbol <symbol> --uri <metadata-uri> [--quote SOL|mint] [--buy <ui>] [--decimals 6] [--mint-keypair <path>] [--live]"
        summary="Build or execute a LaunchLab token launch, optionally including an initial buy and using a supplied/persisted mint keypair path."
        behavior={[
          "The documented token decimal default is 6. If no explicit mint-keypair path is requested, the implementation can create and persist a mint keypair under .solard/raydium-mints.",
        ]}
        mode="live-flag"
      />
      <CommandRef
        id="launchlab-buy"
        title="slrd raydium launchlab buy"
        syntax="slrd raydium launchlab buy <mint> --wallet <wallet> [--quote SOL|mint] --amount <ui> [--live]"
        summary="Build or execute a LaunchLab buy for an existing launch mint."
        mode="live-flag"
      />
      <CommandRef
        id="launchlab-sell"
        title="slrd raydium launchlab sell"
        syntax="slrd raydium launchlab sell <mint> --wallet <wallet> [--quote SOL|mint] --amount <ui> [--live]"
        summary="Build or execute a LaunchLab sell for an existing launch mint."
        mode="live-flag"
      />

      <h2 id="cpmm">CPMM creation</h2>
      <CommandRef
        id="raydium-cpmm-create"
        title="slrd raydium cpmm create"
        syntax="slrd raydium cpmm create --wallet <wallet> --mint-a <token|mint> --mint-b <token|mint> --amount-a <ui> --amount-b <ui> [--fee-config-index 0] [--start-time 0] [--live]"
        summary="Build or execute a Raydium CPMM pool creation transaction for an arbitrary SPL/SPL pair."
        behavior={[
          "The CLI resolves both assets and converts the supplied UI amounts to raw token units. fee-config-index defaults to 0 and the implementation accepts start-time with a default of 0.",
        ]}
        mode="live-flag"
      />
    </DocsPage>
  );
}
