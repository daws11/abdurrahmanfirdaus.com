# TaxAI Chat

This demo re-implements the **chat.taxai** chat-style tax Q&A interface as
a synthetic prototype. Three screens are wired: **Inbox** (default — left
sidebar with 6 sample conversations tagged by topic: VAT, Corporate Tax, Free
Zones, Excise, Transfer Pricing, with unread dots, a search field, and a
token quota footer at 37%), **Conversation** (dual bubble layout — user on
the right in accent color, AI on the left in a bordered card — with citation
cards under AI answers quoting "Federal Decree-Law No. (8) of 2017" and the
Executive Regulations, plus a PDF attachment chip), and **Settings** (language
detection toggle showing Auto/EN/AR pills, model picker, account info).

All conversations, citation snippets, and attachment names are synthetic
placeholders. UAE-specific touches: VAT at 5%, AED 375,000 corporate tax
threshold, Free Zone qualifying income rules. Brand identity and layout
follow shadcn new-york with indigo accent (`#4f46e5`) — no production code,
schemas, or fixtures committed here.
