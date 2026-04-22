"use client";

import { useInvoices } from "@/context/InvoicesContext";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  const { invoices } = useInvoices();
  return (
    <>
      <InvoiceList invoices={invoices} />
      <InvoiceForm mode="create" />
    </>
  );
}
