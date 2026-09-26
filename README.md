# Give sales a daily view of open meeting follow-ups

Bring open Krisp meeting action items into a morning Slack digest with owners and due dates, giving sales a shared view of commitments still waiting on action.

Every weekday morning, Automate.ax asks Krisp for unfinished action items from meetings visible to the connected user. It posts a Slack digest with each item's title, assignee, due date, source meeting, and Krisp item ID.

A sales manager can review missing owners and overdue commitments with the team. The workflow does not decide whether Krisp extracted the right action items or write notes back into the CRM; the team still verifies the conversation and updates the source records.

## Set it up with a coding agent

Copy the setup prompt from [the article](https://automate.ax/articles/krisp-sales-followup-digest) into your coding agent. The agent creates the Automate.ax project, asks for your choices, guides account authorization, checks the automation, and deploys it. You do not need to clone this repository yourself when using the prompt.

You'll choose:

- The Slack conversation where the sales team reviews meeting commitments.
- The time zone for the weekday 9 a.m. digest.
- A Krisp Meeting Assistant API key with read access and account authorization.

Krisp Meeting Assistant API access requires a Core or Advanced plan. Automate.ax currently requires a paid Slack workspace connection. The agent can help find the Slack conversation ID after authorization.

## Manual setup

If you prefer to set it up yourself:

```sh
git clone https://github.com/SentsCo/automate-ax-krisp-sales-followup-digest.git
cd automate-ax-krisp-sales-followup-digest
bun install
bunx automate.ax login
bunx automate.ax init
bun run typecheck
bunx automate.ax deploy
```

Connect the accounts requested by Automate.ax when you deploy. The platform stores credentials outside this repository. Set any project parameters requested by the automation, then review the read and write operations before turning it on.

## Check a run

With a few known open and completed Krisp action items, run the automation from a safe test schedule. Confirm the Slack digest includes open items, omits completed ones, and names any unassigned item.

## Limits

- Krisp's personal API key can read meetings the connected user owns or that have been shared directly with them. It does not see every workspace meeting automatically.
- The example requests the first 200 open items. The Slack message warns if Krisp reports another page; add pagination if that volume is common.
- This digest depends on Krisp extracting and updating action items. It does not judge whether they accurately reflect the call or create tasks in the CRM.

The workflow responds to [a real problem described by An eight-rep sales team's inconsistent follow-ups on Reddit](https://www.reddit.com/r/CRMSoftware/comments/1vkn5m7/our_sales_calls_are_a_black_hole_nobody_takes/). The public report informed the example; it is not an endorsement of this implementation.
