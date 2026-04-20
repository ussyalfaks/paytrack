import { notFound } from "next/navigation";
import { findInvoice } from "@/lib/db";
import { InvoiceForm } from "@/components/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await findInvoice(params.id);
  if (!invoice) notFound();
  return <InvoiceForm mode="edit" invoice={invoice} />;
}
