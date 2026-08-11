# Why I sit with the team for two weeks before opening my editor

A pattern I've repeated on every product I've shipped: 1-3 weeks of observation before any code.

The first time was for Invenflow. I spent a week watching the warehouse manager do a stocktake by hand before I drew a screen. The system wasn't broken — there was no system. The numbers lived in three spreadsheets, two WhatsApp groups, and one paper ledger. If I'd built a screen first, I would have built it for the spreadsheet workflow I imagined, not the workflow that actually existed.

## The cost of guessing

Most software fails not because the code is wrong, but because the code is right for the wrong problem. You can spend a month building a beautiful reconciliation tool and find out the real bottleneck was the missing tap that the warehouse manager kept forgetting. The model of the problem in the developer's head is rarely the model the user has in theirs.

## What sitting looks like

- **Watch the work, don't interview about it.** People narrate their work in idealized form. Watching the work shows you the real form, including the parts they don't notice anymore.
- **Take notes on friction, not features.** Every time the user pauses, sighs, asks a colleague, opens a second app — that's a real requirement you won't hear about in a feature request.
- **Don't pitch the product.** Sit silently for the first 2-3 days. Pitching changes what people show you. They show you the things they think you can fix.

## When to break the rule

- If the problem is well-understood (e.g., a CRUD form), skip the sit.
- If the user is paying for discovery explicitly, sit but bring questions.
- If you've sat with this team before on adjacent work, you can sit for less time.

## The FDE mindset

Forward Deployed Engineer is a job title borrowed from Palantir. The pattern — embedded with the customer, deploying in their environment, owning the outcome — requires that the engineer understands the customer's world better than the customer's own tools do. You can't embed without sitting. You can't deploy in their environment without understanding it.

Two weeks of sitting is the cheapest insurance you can buy against building the wrong thing.
