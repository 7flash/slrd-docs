import { DocsPage, Method } from "../_components/docs";

export default function VenuesPage() {
  return (
    <DocsPage
      eyebrow="Routing"
      title="Venues"
      description="Solard contains venue-specific implementations behind higher-level token and trading operations. The scan includes Pump, PumpSwap, Raydium, and Meteora DLMM support."
    >
      <h2 id="venue-model">Venue model</h2>
      <p>
        Token metadata and on-chain state are used to determine the applicable
        execution venue. Higher-level callers can then use common trade and
        price operations while venue-specific transaction construction remains
        behind the core layer.
      </p>

      <h2 id="supported-venues">Major integrations</h2>
      <Method name="Pump">
        <p>
          Bonding-curve lifecycle, launch discovery, price and trade history,
          and execution tooling.
        </p>
      </Method>
      <Method name="PumpSwap">
        <p>Post-graduation pool lifecycle and swap execution support.</p>
      </Method>
      <Method name="Raydium">
        <p>
          Raydium routing and LaunchLab-aware execution paths used by the
          trading engine.
        </p>
      </Method>
      <Method name="Meteora DLMM">
        <p>
          Pool discovery, liquidity position management, screening,
          intelligence, and autonomous LP tooling.
        </p>
      </Method>

      <h2 id="price-resolution">Price resolution</h2>
      <p>
        <code>samplePrice()</code> uses the resolved token and venue metadata to
        obtain a market price through the core venue layer. Interactive trading
        similarly detects an execution venue before arming price targets.
      </p>

      <h2 id="external-intelligence">External intelligence</h2>
      <p>
        Optional GMGN support is used for read-only token and market
        intelligence. Signed GMGN swap or order execution is intentionally
        excluded from Solard.
      </p>
    </DocsPage>
  );
}
