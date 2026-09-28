import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { automationCommands } from "../../_data/cli";

export default function CliAutomationPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Automation & agents"
      description="Scripts, reusable strategy files, wallet groups, persisted agents, watch targets, Jito helpers, and address lookup tables."
    >
      <h2 id="scripts-strategies">Scripts and strategies</h2>
      {automationCommands.slice(0, 4).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="groups-agents">Groups and agents</h2>
      {automationCommands.slice(4, 10).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="watching-alts">Watching, Jito, and ALTs</h2>
      {automationCommands.slice(10).map((command) => (
        <CommandRef {...command} />
      ))}
    </DocsPage>
  );
}
