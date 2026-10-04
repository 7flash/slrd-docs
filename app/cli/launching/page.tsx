import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { launchCommands } from "../../_data/cli";

export default function CliLaunchingPage() {
  return (
    <DocsPage
      title="Launching"
      description="Pump launch, prepare, metadata, deploy, vamp, and mint pools."
    >
      <p>
        Launch flow: metadata → mint → creator/beneficiary → build/sign →
        broadcast.
      </p>
      <h2 id="pump-launching">Pump launch flows</h2>
      {launchCommands.map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="mint-pool">Using the vanity mint pool</h2>
      <p>
        Use <code>--mint-pool &lt;suffix&gt;</code> to consume a stored vanity
        mint; <code>--mint-pool-address</code> selects one reservation.
      </p>
    </DocsPage>
  );
}
