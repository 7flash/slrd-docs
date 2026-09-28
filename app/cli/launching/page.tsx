import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { launchCommands } from "../../_data/cli";

export default function CliLaunchingPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Launching & metadata"
      description="Pump launch construction, external-payer preparation, metadata upload, deployment, vamp workflows, pooled vanity mints, and explicit live-broadcast controls."
    >
      <h2 id="pump-launching">Pump launch flows</h2>
      {launchCommands.map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="mint-pool">Using the vanity mint pool</h2>
      <p>
        The launch and vamp flows can consume encrypted vanity mints generated
        with <code>slrd vanity pool generate</code>. Pass{" "}
        <code>--mint-pool &lt;suffix&gt;</code> to select from that pool and
        optionally <code>--mint-pool-address &lt;address&gt;</code> when you
        need a specific reservation.
      </p>
    </DocsPage>
  );
}
