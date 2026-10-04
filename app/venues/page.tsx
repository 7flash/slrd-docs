import { DocsPage, Method } from "../_components/docs";

export default function VenuesPage() {
  return (
    <DocsPage
      title="Venues"
      description="Pump, PumpSwap, Jupiter, Raydium, and Meteora."
    >
      <h2 id="routing">Routing</h2>
      <p>
        Solard resolves token/venue state, then routes price and execution
        operations through the matching adapter.
      </p>

      <h2 id="integrations">Integrations</h2>
      <Method name="Pump">
        <p>Bonding curve, launch discovery, history, pricing, execution.</p>
      </Method>
      <Method name="PumpSwap">
        <p>Post-graduation pools and swaps.</p>
      </Method>
      <Method name="Jupiter">
        <p>Generic fallback quotes/swaps for supported assets.</p>
      </Method>
      <Method name="Raydium">
        <p>Quotes/swaps, LaunchLab, CPMM.</p>
      </Method>
      <Method name="Meteora DLMM">
        <p>Discovery, pool data, positions, liquidity, swaps, autopilot.</p>
      </Method>

      <h2 id="price">Price</h2>
      <p>
        <code>samplePrice()</code> resolves the token and uses its venue
        adapter.
      </p>

      <h2 id="gmgn">GMGN</h2>
      <p>
        Optional read-only intelligence. Solard does not use GMGN for signed
        swaps/orders.
      </p>
    </DocsPage>
  );
}
