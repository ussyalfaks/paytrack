import Link from "next/link";
import { notFound } from "next/navigation";
import { findInvoice } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { InvoiceActions } from "@/components/InvoiceActions";
import { formatCurrency, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await findInvoice(params.id);
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-[730px] px-6 pt-8 pb-[88px] lg:pt-16 lg:pb-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-6 text-sm font-bold text-ink-900 transition-colors hover:text-ink-400 dark:text-white"
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" />
        </svg>
        Go back
      </Link>

      {/* Status + actions */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-white px-8 py-5 shadow-card dark:bg-ink-800">
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-5">
          <span className="text-sm text-ink-400 dark:text-ink-200">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        {/* Actions shown inline on desktop only; mobile uses fixed bottom bar */}
        <div className="hidden md:flex gap-2">
          <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
        </div>
      </div>

      {/* Body card */}
      <div className="rounded-lg bg-white p-6 shadow-card dark:bg-ink-800 lg:p-12">
        {/* Header: ID/description + sender address */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-2 font-bold text-ink-900 dark:text-white">
                <span className="text-ink-400">#</span>
                {invoice.id}
              </p>
              <p className="text-sm text-ink-400 dark:text-ink-200">
                {invoice.description}
              </p>
            </div>
            {/* Sender address — right-aligned on desktop */}
            <address className="hidden lg:block text-right text-sm capitalize not-italic leading-[1.35rem] text-ink-400 dark:text-ink-200">
              {invoice.senderAddress.street}
              <br />
              {invoice.senderAddress.city}
              <br />
              {invoice.senderAddress.postCode}
              <br />
              {invoice.senderAddress.country}
            </address>
          </div>
          {/* Sender address — left-aligned on mobile */}
          <address className="mt-8 text-sm capitalize not-italic leading-[1.35rem] text-ink-400 dark:text-ink-200 lg:hidden">
            {invoice.senderAddress.street}
            <br />
            {invoice.senderAddress.city}
            <br />
            {invoice.senderAddress.postCode}
            <br />
            {invoice.senderAddress.country}
          </address>
        </div>

        {/* Metadata grid */}
        <div className="mb-10">
          {/* 2-col on mobile, 3-col on desktop */}
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
            {/* Col 1: dates */}
            <div className="flex flex-col justify-between">
              <div className="mb-6">
                <p className="mb-3 text-sm text-ink-400 dark:text-ink-200">Invoice Date</p>
                <p className="font-bold text-ink-900 dark:text-white">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm text-ink-400 dark:text-ink-200">Payment Due</p>
                <p className="font-bold text-ink-900 dark:text-white">
                  {formatDate(invoice.paymentDue)}
                </p>
              </div>
            </div>

            {/* Col 2: Bill To */}
            <div>
              <p className="mb-3 text-sm text-ink-400 dark:text-ink-200">Bill To</p>
              <p className="mb-2 font-bold text-ink-900 dark:text-white">
                {invoice.clientName}
              </p>
              <address className="text-sm not-italic capitalize leading-[1.35rem] text-ink-400 dark:text-ink-200">
                {invoice.clientAddress.street && (
                  <>{invoice.clientAddress.street}<br /></>
                )}
                {invoice.clientAddress.city && (
                  <>{invoice.clientAddress.city}<br /></>
                )}
                {invoice.clientAddress.postCode && (
                  <>{invoice.clientAddress.postCode}<br /></>
                )}
                {invoice.clientAddress.country}
              </address>
            </div>

            {/* Col 3: Sent To — desktop only */}
            <div className="hidden lg:block">
              <p className="mb-3 text-sm text-ink-400 dark:text-ink-200">Sent to</p>
              <p className="font-bold text-ink-900 dark:text-white">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Sent To — mobile only, full width */}
          <div className="mt-8 lg:hidden">
            <p className="mb-3 text-sm text-ink-400 dark:text-ink-200">Sent to</p>
            <p className="font-bold text-ink-900 dark:text-white">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items — desktop table */}
        <div className="hidden lg:block overflow-hidden rounded-t-lg bg-ink-100 dark:bg-ink-700">
          <div className="p-8">
            <div className="mb-8 grid grid-cols-[1fr_80px_120px_120px] text-sm text-ink-400 dark:text-ink-200">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            {invoice.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_80px_120px_120px] py-3 text-sm font-bold"
              >
                <span className="text-ink-900 dark:text-white">{item.name}</span>
                <span className="text-center text-ink-400">{item.quantity}</span>
                <span className="text-right text-ink-400">{formatCurrency(item.price)}</span>
                <span className="text-right text-ink-900 dark:text-white">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Items — mobile compact */}
        <div className="lg:hidden rounded-t-lg bg-ink-100 dark:bg-ink-700 p-6 space-y-4">
          {invoice.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-bold text-ink-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-ink-400">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-bold text-ink-900 dark:text-white">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>

        {/* Total bar */}
        <div className="flex items-center justify-between rounded-b-lg bg-[#373B53] px-8 py-7 dark:bg-ink-900">
          <span className="text-sm text-white">
            <span className="lg:hidden">Grand Total</span>
            <span className="hidden lg:inline">Amount Due</span>
          </span>
          <span className="text-2xl font-bold text-white">
            {formatCurrency(invoice.total)}
          </span>
        </div>
      </div>

      {/* Mobile actions — InvoiceActions renders as fixed bottom bar on mobile */}
      <div className="md:hidden">
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
      </div>
    </div>
  );
}
