"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useInvoices } from "@/context/InvoicesContext";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { invoices, initialized } = useInvoices();

  if (!initialized) return null;

  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) notFound();

  return <InvoiceForm mode="edit" invoice={invoice} />;
}
