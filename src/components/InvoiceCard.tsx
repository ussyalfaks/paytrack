import Link from "next/link";
import type { Invoice } from "@/types/invoice";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="group block rounded-lg border border-transparent bg-white px-6 py-5 shadow-card transition-colors hover:border-brand dark:bg-ink-800 dark:hover:border-brand lg:px-8"
    >
      {/* Mobile / tablet layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex items-center justify-between">
          <span className="font-bold text-ink-900 dark:text-white">
            <span className="text-ink-400">#</span>
            {invoice.id}
          </span>
          <span className="text-sm text-ink-400 dark:text-ink-200">{invoice.clientName}</span>
        </div>
        <span className="text-sm text-ink-400 dark:text-ink-200">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <div className="flex items-center justify-between">
          <span className="font-bold text-ink-900 dark:text-white">
            {formatCurrency(invoice.total)}
          </span>
          <div className="flex items-center gap-4">
            <StatusBadge status={invoice.status} />
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-[110px_140px_1fr_120px_auto_12px] items-center gap-6 w-full">
        <span className="font-bold text-ink-900 dark:text-white">
          <span className="text-ink-400">#</span>
          {invoice.id}
        </span>
        <span className="text-sm text-ink-400 dark:text-ink-200">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-sm text-ink-400 dark:text-ink-200">{invoice.clientName}</span>
        <span className="text-right font-bold text-ink-900 dark:text-white">
          {formatCurrency(invoice.total)}
        </span>
        <StatusBadge status={invoice.status} />
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </Link>
  );
}
