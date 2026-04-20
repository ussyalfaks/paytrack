import { readInvoices } from "@/lib/db";
import { InvoiceList } from "@/components/InvoiceList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const invoices = await readInvoices();
  return <InvoiceList invoices={invoices} />;
}
