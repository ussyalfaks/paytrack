import { readInvoices } from "@/lib/db";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const invoices = await readInvoices();
  return (
    <>
      <InvoiceList invoices={invoices} />
      <InvoiceForm mode="create" />
    </>
  );
}
