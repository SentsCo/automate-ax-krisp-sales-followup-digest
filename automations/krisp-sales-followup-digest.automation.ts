import { automation, onSchedule, t, transform } from "automate.ax"
import { krisp } from "automate.ax/krisp"
import { slack } from "automate.ax/slack"

export default automation(
  "Review open sales meeting action items",
  {
    parameters: [
      {
        label: "Sales follow-up Slack conversation ID",
        name: "reviewConversationId",
        type: "text",
      },
      {
        label: "Schedule time zone",
        name: "timeZone",
        type: "text",
        defaultValue: "UTC",
      },
    ],
  },
  ({ parameters }) => {
    const morning = onSchedule({
      schedule: "0 9 * * 1-5",
      timeZone: parameters.timeZone,
    })
    const openItems = krisp.listActionItems({ completed: false, limit: 200 })
    const digest = transform(
      [openItems, morning],
      ({ items, nextCursor, total }) => ({
        count: total,
        moreAvailable: nextCursor !== null,
        lines: items.map((item) => {
          const owner =
            [item.assignee?.firstName, item.assignee?.lastName]
              .filter(Boolean)
              .join(" ") ||
            item.assignee?.email ||
            "unassigned"
          return `• ${item.title} — ${owner}; meeting: ${item.meetingTitle}; due: ${item.dueDate ?? "not set"}; Krisp item: ${item.id}`
        }),
      }),
    ).filter(({ count }) => count > 0)

    slack.sendMessage({
      conversation: parameters.reviewConversationId,
      text: t`${digest.count} open Krisp meeting action items. Showing up to 200:\n${digest.lines.transform((lines) => lines.join("\n"))}\n${digest.moreAvailable.transform((more) => (more ? "More items are available in Krisp." : "This is the full returned list."))}`.transform(
        escapeSlackText,
      ),
      unfurlLinks: false,
    })
  },
)

/** Keeps provider text from becoming Slack mentions or control markup. */
function escapeSlackText(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
