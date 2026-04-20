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

| Method   | Path                  | Action                             |
| -------- | --------------------- | ---------------------------------- |
| `GET`    | `/api/invoices`       | List all                           |
| `POST`   | `/api/invoices`       | Create (status: `draft` / `pending`) |
| `GET`    | `/api/invoices/[id]`  | Get one                            |
| `PUT`    | `/api/invoices/[id]`  | Update                             |
| `PATCH`  | `/api/invoices/[id]`  | Partial (used for "Mark as Paid")  |
| `DELETE` | `/api/invoices/[id]`  | Delete                             |

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

```
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
