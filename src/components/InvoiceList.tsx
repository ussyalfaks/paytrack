"use client";

import Link from "next/link";
import { useState } from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { InvoiceCard } from "./InvoiceCard";
import { EmptyState } from "./EmptyState";
import { FilterDropdown } from "./FilterDropdown";

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [filter, setFilter] = useState<InvoiceStatus[]>([]);

  const visible =
    filter.length === 0 ? invoices : invoices.filter((i) => filter.includes(i.status));

  const countLabel =
    invoices.length === 0
      ? "No invoices"
      : `There are ${visible.length} total invoice${visible.length === 1 ? "" : "s"}`;

  return (
    <div className="mx-auto max-w-[730px] px-6 py-16">
      <header className="mb-16 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-ink-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-sm text-ink-400">{countLabel}</p>
        </div>
        <div className="flex items-center gap-10">
          <FilterDropdown selected={filter} onChange={setFilter} />
          <Link
            href="/invoices/new"
            className="flex items-center gap-4 rounded-full bg-brand py-2 pl-2 pr-6 text-sm font-bold text-white transition-colors hover:bg-brand-light"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023H3.732v3.71H.023v2.58h3.71v3.71h2.58z"
                  fill="#7C5DFA"
                />
              </svg>
            </span>
            New Invoice
          </Link>
        </div>
      </header>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((inv) => (
            <InvoiceCard key={inv.id} invoice={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
