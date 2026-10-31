# Ghost Ticket: cross-org agent debugging (Agent Relay track pick)

> Sat 31 Oct 2026. Candidate aimed at the Agent Relay prize (Mac mini). Context: [../EVENT_KICKOFF_NOTES.md](../EVENT_KICKOFF_NOTES.md), [../research/agent-relay.md](../research/agent-relay.md), [../research/terse.md](../research/terse.md).

**One line:** your company's support agent and your customer's agent debug a broken integration together over Agent Relay, with no humans copy-pasting messages between them ("don't be a meat proxy").

**Problem:** when a customer's integration with a vendor breaks, humans on both sides relay logs, stack traces and config through tickets and Slack. That is slow and lossy. Each side's AI agent can see only its own side.

**How it works:**
- **Vendor side:** a support agent on the OpenAI API with read access to the vendor's code and logs.
- **Customer side:** the customer's agent (Claude, or a different OpenAI persona) with read access to the customer's app and config. Ideally it runs on a second laptop, or on a Freestyle VM.
- **They talk over Agent Relay DMs and threads.** Scoped permissions: the customer agent shares error logs, never secrets. Relay's durable delivery queues messages for an offline agent.
- **A Terse Durable Actor owns the ticket:** state machine open → diagnosing → fix proposed → verified → closed; who claimed which step; the agreed fix. Only one agent can apply a fix, and the ticket survives crashes.
- **Escalation:** when the agents disagree or a fix needs approval, a human approves from their phone.
- **Halloween look:** the customer's app is "possessed"; the vendor agent performs the "exorcism".

**Demo beats:** human copy-paste "before" → agents talking directly, with the Relay observer stream on screen → kill the customer agent mid-debug; its messages queue, it restarts and catches up → the ticket actor shows the state and the single fix claim → the fix is verified and the ticket closes with the shared history as the audit trail.

**Constraints:** 5-hour build (11:00-16:00) by a small team. Video judged first, then 8 finalists demo live for 2 minutes. Criteria: real-time AI (Terse/Relay), originality, working demo, UX/design, meaningfulness. About 5 agents per hosted Relay workspace. Actors can't hold Relay listeners (needs a bridge process). Pin `@agent-relay/sdk@14.0.0`.
