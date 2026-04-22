# Invoice App

A Next.js 14 invoice management app built from the provided Figma designs.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (with custom design tokens matching the Figma)
- **League Spartan** font (via `next/font/google`)
- Mock JSON file + API routes for data persistence

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path                      | Page                                                      |
| ------------------------- | --------------------------------------------------------- |
| `/`                       | Invoice list (empty state when no invoices)               |
| `/invoices/new`           | List + "New Invoice" drawer open                          |
| `/invoices/[id]`          | View invoice + Edit/Delete/Mark as Paid + delete modal    |
| `/invoices/[id]/edit`     | Edit invoice drawer                                       |

## API

| Method   | Path                  | Action                                  |
| -------- | --------------------- | --------------------------------------- |
| `GET`    | `/api/invoices`       | List all                                |
| `POST`   | `/api/invoices`       | Create (status: `draft` / `pending`)    |
| `GET`    | `/api/invoices/[id]`  | Get one                                 |
| `PUT`    | `/api/invoices/[id]`  | Update                                  |
| `PATCH`  | `/api/invoices/[id]`  | Partial (used for "Mark as Paid")       |
| `DELETE` | `/api/invoices/[id]`  | Delete                                  |

Data lives in `src/data/invoices.json` — edits are written straight back to this file, so the mock DB persists across restarts.

## Features

- Light / dark theme toggle (sidebar moon icon, persisted via `localStorage`, respects system preference on first visit)
- Filter list by status (Draft / Pending / Paid, multi-select)
- Empty-state illustration
- Create as draft (no validation) or as pending (full validation)
- Dynamic line items with auto-calculated totals
- Delete confirmation modal
- One-click "Mark as Paid"

## Project structure

```text
src/
├── app/
│   ├── api/invoices/...      # REST endpoints
│   ├── invoices/[id]/        # detail + edit
│   ├── invoices/new/         # create drawer over list
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # list
├── components/                # Sidebar, InvoiceForm, DeleteModal, etc.
├── data/invoices.json         # mock DB
├── lib/                       # db + format helpers
└── types/invoice.ts
```

## Trade-offs

- **File-based persistence over a real database** — `invoices.json` is written directly on every mutation. Simple to set up and zero-dependency, but not safe for concurrent writes. A real deployment should use SQLite (via Prisma) or Postgres.
- **Server-side rendering for the list and detail pages** — data is always fresh on navigation, but it means no optimistic UI. An SWR or React Query layer could make edits feel snappier without a full page refresh.
- **No authentication** — invoices are globally readable/writable. Adding NextAuth.js would scope data per user, which is the natural next step before any real deployment.
- **Single-file form component** — `InvoiceForm` handles both create and edit modes in one file. This avoids prop-drilling but makes the file longer than ideal; splitting into `useInvoiceForm` hook + pure render component would improve testability.
- **Tailwind for styling** — rapid to build against a Figma design system, but utility-class verbosity grows quickly in complex layouts (e.g., the invoice detail page). A component library like shadcn/ui could reduce repetition at the cost of flexibility.

## Accessibility

- **Semantic HTML throughout** — `<main>`, `<header>`, `<aside>`, `<address>`, and `<button>` are used for their correct purposes; no `<div onClick>` for interactive elements.
- **Form labels** — every `<input>` and `<select>` has an associated `<label>` rendered above it.
- **Modal accessibility** — `DeleteModal` uses `role="dialog"` and `aria-modal="true"`, focuses the Cancel button on open, traps Tab/Shift+Tab within the dialog, and closes on Escape.
- **Error announcements** — inline validation messages use `role="alert"` so screen readers announce them as soon as they appear.
- **Keyboard navigation** — all interactive elements (buttons, links, inputs, checkboxes) are reachable and operable via keyboard alone.
- **Color contrast** — primary text (`#0C0E16`) on white exceeds WCAG AA 4.5:1. Brand purple (`#7C5DFA`) on white meets AA for large/bold text. Both light and dark themes maintain adequate contrast ratios.
- **Dark mode** — implemented via a CSS class on `<html>` rather than a CSS media query override, so users can override their OS preference from within the app.
