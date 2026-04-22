"use client";

import { useInvoices } from "@/context/InvoicesContext";
import { InvoiceList } from "@/components/InvoiceList";

export default function HomePage() {
  const { invoices } = useInvoices();
  return <InvoiceList invoices={invoices} />;
}
