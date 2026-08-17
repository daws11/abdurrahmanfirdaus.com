# TaxAI Chat

Three-screen portfolio prototype mirroring production `chat.taxai`:

**Inbox (AppSidebar) → Conversation → Settings.**

- **Inbox**: production-style sidebar with Atto branding + "New chat" button + session history (hover-reveal Trash delete) + footer with Globe language dropdown (EN/العربية), token quota progress bar, user info, Settings + Sign out.
- **Conversation**: dual-bubble chat with Atto assistant (left, `bg-muted`) and user Sara (right, `bg-primary`). Mini markdown rendering (`**bold**` + `*italic*`). Citations under assistant messages. Hover-reveal action tray (Helpful / Love it / Copy) on assistant bubbles. Typing indicator (3 dots) after last user message. Paperclip + send composer.
- **Settings**: language picker (Globe dropdown), compact Subscription card (Crown icon + plan + usage + Change Plan / Upgrade), Model picker, Account info.

Brand identity is **Atto** (production's actual AI assistant name, owned by ATTO group).

All data is synthetic; no backend, no real MongoDB / OpenAI.
