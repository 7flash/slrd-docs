import { DocsPage } from "../../_components/docs";
import { CommandRef } from "../../_components/reference";
import { walletTokenCommands } from "../../_data/cli";

export default function CliWalletsTokensPage() {
  return (
    <DocsPage
      eyebrow="CLI reference"
      title="Wallets & tokens"
      description="Complete reference for the CLI wallet vault, contacts, wallet/balance inspection, token registry/history primitives, holder snapshots, event streams, and vanity mint workflows."
    >
      <h2 id="wallet-management">Wallet management</h2>
      {walletTokenCommands.slice(0, 4).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="contacts-balances">Contacts and balances</h2>
      {walletTokenCommands.slice(4, 9).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="token-registry-history">Token registry and history</h2>
      {walletTokenCommands.slice(9, 16).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="holders-events">Holders and events</h2>
      {walletTokenCommands.slice(16, 19).map((command) => (
        <CommandRef {...command} />
      ))}
      <h2 id="vanity">Vanity mint workflows</h2>
      {walletTokenCommands.slice(19).map((command) => (
        <CommandRef {...command} />
      ))}
    </DocsPage>
  );
}
