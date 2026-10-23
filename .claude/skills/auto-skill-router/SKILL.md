---
name: auto-skill-router
description: Mandatory routing protocol. On every task, classify the request (UI, bug, database/auth, security, cleanup/review, deploy, new feature) and load the matching installed skills before answering or editing. Use at the start of every prompt.
---

# Auto Skill Router

Before answering or executing ANY task, classify it and invoke the matching skills with the Skill tool, then follow their instructions. A task can match several rows; load the union. If a task matches nothing, say so in the badge (`[Auto-Skills Active: none]`) and continue normally.

## Routing table

| Task type | Invoke |
|---|---|
| UI / styling / components / modals | `frontend-ui-engineering`, `frontend-design:frontend-design`, `web-design-guidelines`, `vercel-react-best-practices` |
| Bug / silent button / error / crash | `debugging-and-error-recovery`, `doubt-driven-development`, `browser-testing-with-devtools` |
| Database / Prisma / Auth / RLS | `supabase`, `supabase-postgres-best-practices`, `api-and-interface-design` |
| Security / validation / uploads | `security-and-hardening`, `security-audit` |
| Code cleanup / refactoring / PR check | `code-review-and-quality`, `code-simplification`, `code-review:code-review`, agent `code-simplifier:code-simplifier` |
| Build / push / Vercel deployment | `deploy-to-vercel`, `vercel-optimize`, `ci-cd-and-automation`, `shipping-and-launch` |
| New feature / architecture | `planning-and-task-breakdown`, `spec-driven-development`, `incremental-implementation` |

## Protocol

1. Classify the prompt before any other action (including clarifying questions).
2. Invoke each matching skill that is actually installed. Plugin skills use `plugin:skill` names (e.g. `frontend-design:frontend-design`); `code-simplifier` is an agent, launched with the Agent tool.
3. Print a one-line badge at the very top of the response: `[Auto-Skills Active: skill-a + skill-b]`.
4. Actively apply the loaded skills' instructions; do not just name them.
5. This project's `CLAUDE.md` rules (strict types, brand tokens, RSC default, no new dependencies) win over any skill on conflict.

## Notes

- `browser-testing-with-devtools` needs the chrome-devtools MCP server; if it is not connected, say so instead of pretending to use it.
- `vercel-optimize` needs a deployed Vercel project with metrics; load it for deployment work but only run its collection steps when asked about cost or performance.
- Do not push, deploy or change remote services just because a skill was loaded; those still need the user's go-ahead.
