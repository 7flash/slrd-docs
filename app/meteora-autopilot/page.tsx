import { DocsPage, Method } from "../_components/docs";

export default function MeteoraAutopilotPage() {
  return (
    <DocsPage
      title="Meteora autopilot"
      description="DLMM screening, planning, memory, and guarded execution."
    >
      <h2 id="flow">Flow</h2>
      <ol>
        <li>Screen pools with deterministic filters.</li>
        <li>Plan position management.</li>
        <li>Build a read-only cycle plan.</li>
        <li>Execute only when all live gates are set.</li>
      </ol>

      <h2 id="tools">Tools</h2>
      <Method name="meteora_autopilot_status">
        <p>Config, balance, positions, memory, last cycle.</p>
      </Method>
      <Method name="meteora_autopilot_configure">
        <p>Persist screening, risk, strategy, management, and loop settings.</p>
      </Method>
      <Method name="meteora_autopilot_context">
        <p>
          Read config, lessons, decisions, instructions, blacklist, pool memory.
        </p>
      </Method>
      <Method name="meteora_autopilot_screen">
        <p>Run hard filters and scoring.</p>
      </Method>
      <Method name="meteora_autopilot_management_plan">
        <p>Plan claim, close, rebalance, or review actions.</p>
      </Method>
      <Method name="meteora_autopilot_plan_cycle">
        <p>Build a read-only management + deployment plan.</p>
      </Method>
      <Method name="meteora_autopilot_run_cycle">
        <p>Run one cycle; broadcast only with execution + live gates.</p>
      </Method>
      <Method name="meteora_autopilot_history">
        <p>
          Recent screens, deploys, claims, closes, rebalances, skips, errors.
        </p>
      </Method>
      <Method name="meteora_autopilot_list_lessons">
        <p>Persistent lessons by screener, manager, or general role.</p>
      </Method>

      <h2 id="execution">Execution</h2>
      <p>
        <code>plan_cycle</code> never broadcasts. <code>run_cycle</code>{" "}
        requires <code>execute=true</code>, <code>live=true</code>, and the
        live-trading master switch to broadcast.
      </p>
    </DocsPage>
  );
}
