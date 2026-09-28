import { Callout, DocsPage, Method } from "../_components/docs";

export default function MeteoraAutopilotPage() {
  return (
    <DocsPage
      eyebrow="Autonomous liquidity"
      title="Meteora autopilot"
      description="The Meteora autonomous LP subsystem combines deterministic screening and position management with persistent context and explicitly gated execution."
    >
      <h2 id="workflow">Workflow</h2>
      <ol>
        <li>
          Screen candidate pools with deterministic hard filters and scoring.
        </li>
        <li>
          Inspect existing positions and produce claim, close, rebalance, or
          review actions.
        </li>
        <li>Build a read-only management and deployment plan.</li>
        <li>
          Optionally run an execution cycle only when explicit live gates are
          satisfied.
        </li>
      </ol>

      <h2 id="tool-surface">Tool surface</h2>
      <Method name="meteora_autopilot_status">
        <p>
          Read risk configuration, SOL balance, position count, memory counts,
          and last-cycle state.
        </p>
      </Method>
      <Method name="meteora_autopilot_screen">
        <p>Run deterministic DLMM filters and scoring before model judgment.</p>
      </Method>
      <Method name="meteora_autopilot_management_plan">
        <p>
          Inspect open positions and produce deterministic management actions.
        </p>
      </Method>
      <Method name="meteora_autopilot_plan_cycle">
        <p>Build a complete read-only management and deployment plan.</p>
      </Method>
      <Method name="meteora_autopilot_run_cycle">
        <p>
          Run one autonomous cycle, with broadcasting separately gated by
          execution and live flags.
        </p>
      </Method>
      <Method name="meteora_autopilot_history">
        <p>
          Read structured recent screens, deploys, claims, closes, rebalances,
          skips, and errors.
        </p>
      </Method>

      <h2 id="persistent-context">Persistent context</h2>
      <p>
        The subsystem can retain configuration, lessons, recent decisions,
        position instructions, blacklist state, and pool-memory summaries for
        later cycles.
      </p>

      <Callout title="Planning does not broadcast" tone="warn">
        <p>
          The planning tool is read-only. Broadcasting from a run cycle requires
          explicit execution intent, live intent, and the server live-trading
          master switch.
        </p>
      </Callout>
    </DocsPage>
  );
}
