"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteModal } from "./DeleteModal";
import type { InvoiceStatus } from "@/types/invoice";

interface Props {
  invoiceId: string;
  status: InvoiceStatus;
}

export function InvoiceActions({ invoiceId, status }: Props) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
    setPending(false);
    if (res.ok) {
      setShowDelete(false);
      router.push("/");
      router.refresh();
    }
  };

  const handleMarkPaid = async () => {
    setPending(true);
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    setPending(false);
    if (res.ok) router.refresh();
  };

  return (
    <>
      <Link
        href={`/invoices/${invoiceId}/edit`}
        className="rounded-full bg-ink-100 px-6 py-4 text-sm font-bold text-ink-500 transition-colors hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-white"
      >
        Edit
      </Link>
      <button
        onClick={() => setShowDelete(true)}
        className="rounded-full bg-danger px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-danger-light"
      >
        Delete
      </button>
      <button
        onClick={handleMarkPaid}
        disabled={pending || status === "paid"}
        className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
      >
        Mark as Paid
      </button>

      {showDelete && (
        <DeleteModal
          invoiceId={invoiceId}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
          pending={pending}
        />
      )}
    </>
  );
}
