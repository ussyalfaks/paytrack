import type { InvoiceStatus } from "@/types/invoice";

const LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  draft: "Draft",
};

const STYLES: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  paid: {
    bg: "bg-status-paid/10",
    text: "text-status-paid",
    dot: "bg-status-paid",
  },
  pending: {
    bg: "bg-status-pending/10",
    text: "text-status-pending",
    dot: "bg-status-pending",
  },
  draft: {
    bg: "bg-ink-600/10 dark:bg-white/5",
    text: "text-ink-600 dark:text-ink-200",
    dot: "bg-ink-600 dark:bg-ink-200",
  },
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold ${s.bg} ${s.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {LABEL[status]}
    </span>
  );
}
