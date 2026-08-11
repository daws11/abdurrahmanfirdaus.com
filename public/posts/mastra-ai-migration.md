# Migrating a WhatsApp booking flow from rule-based NLP to Mastra AI

Six months ago This is Bali's reservation host was answering the same question — date, time, party size — on every channel, sometimes twice per conversation. We built a booking agent on rule-based NLP first. It worked. It also broke in ways nobody could predict, and the maintenance burden grew with every edge case. Here's what we learned migrating to Mastra AI.

## The starting point

Four channels (WhatsApp, Instagram DMs, email, TikTok), each with its own inbox, no unified state. Rule-based NLP handled the easy 60% of messages: "Book a table for 4 at 7pm Friday." It failed on the long tail: ambiguity ("this weekend"), context carried across messages, and channel-specific idioms ("bisa buat 6 orang?" vs. "table for 6?").

## What Mastra AI changed

Three things that mattered:

1. **Multi-turn context.** The agent now carries state across a conversation. If the user says "Friday" after asking about "this weekend," the agent resolves the date without asking again.
2. **Tool calls as first-class.** Booking a table is now a function call, not a regex match. The agent can chain tool calls: lookup availability → confirm → create reservation → send confirmation. Failure modes are explicit and recoverable.
3. **Channel-aware phrasing.** The same underlying reservation logic, but the agent adapts tone and idiom per channel. WhatsApp gets Bahasa Indonesia casual; Instagram gets more formal; email gets structured.

## The migration

We didn't switch overnight. We ran rule-based and AI in parallel for two weeks — same inbound, two responses, manual comparison. Caught three classes of failure:

- **Hallucinated availability.** The agent invented slots that didn't exist. Fix: ground every availability check on a real API call, never the model's prior.
- **Tone drift.** The agent started using English on a Bahasa Indonesia thread. Fix: explicit system prompt per channel, no language fallback.
- **Loop on ambiguity.** When the user gave partial info, the agent asked the same clarifying question twice. Fix: track which questions have been asked in the conversation state.

## Adoption

The team stopped second-guessing which channel a message came from because they stopped looking at four inboxes. One queue, four doors in. The AI handles the booking flow end-to-end without a human in the loop. Humans engage when fallback triggers — currently ~5% of conversations, all of which the system hands off with full context preserved.

## What I'd tell someone starting this

Don't skip the parallel-run phase. The model's failure modes are not the same as the rule-based system's. You'll find them only by running both and watching the divergence.
