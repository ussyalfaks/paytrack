"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invoice, InvoiceItem } from "@/types/invoice";

interface Props {
  invoice?: Invoice;
  mode: "create" | "edit";
}

interface FormItem {
  name: string;
  quantity: string;
  price: string;
}

const EMPTY_ADDRESS = { street: "", city: "", postCode: "", country: "" };

export function InvoiceForm({ invoice, mode }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [sender, setSender] = useState(invoice?.senderAddress ?? EMPTY_ADDRESS);
  const [client, setClient] = useState(invoice?.clientAddress ?? EMPTY_ADDRESS);
  const [clientName, setClientName] = useState(invoice?.clientName ?? "");
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
  const [createdAt, setCreatedAt] = useState(
    invoice?.createdAt ?? new Date().toISOString().split("T")[0]
  );
  const [paymentTerms, setPaymentTerms] = useState(invoice?.paymentTerms ?? 30);
  const [description, setDescription] = useState(invoice?.description ?? "");
  const [items, setItems] = useState<FormItem[]>(
    invoice?.items.map((i) => ({
      name: i.name,
      quantity: String(i.quantity),
      price: String(i.price),
    })) ?? []
  );
  const [termsOpen, setTermsOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [router]);

  const updateItem = (idx: number, field: keyof FormItem, value: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", quantity: "1", price: "0" }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const itemTotal = (it: FormItem) =>
    (Number(it.quantity) || 0) * (Number(it.price) || 0);

  const hasBlank = (val: string) => val.trim().length === 0;

  const save = async (status: "draft" | "pending") => {
    if (status === "pending") {
      const hasEmptyField =
        hasBlank(sender.street) ||
        hasBlank(sender.city) ||
        hasBlank(sender.postCode) ||
        hasBlank(sender.country) ||
        hasBlank(client.street) ||
        hasBlank(client.city) ||
        hasBlank(client.postCode) ||
        hasBlank(client.country) ||
        hasBlank(clientName) ||
        hasBlank(clientEmail) ||
        hasBlank(description) ||
        items.length === 0 ||
        items.some((it) => hasBlank(it.name));

      if (hasEmptyField) {
        setShowErrors(true);
        return;
      }
    }

    setSubmitting(true);

    const payload = {
      senderAddress: sender,
      clientAddress: client,
      clientName,
      clientEmail,
      createdAt,
      paymentTerms,
      description,
      status,
      items: items.map((it) => ({
        name: it.name,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      })),
    };

    const url = mode === "create" ? "/api/invoices" : `/api/invoices/${invoice!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (res.ok) {
      router.refresh();
      router.push(mode === "create" ? "/" : `/invoices/${invoice!.id}`);
    }
  };

  const errorBorder = (val: string) =>
    showErrors && hasBlank(val)
      ? "border-danger focus:border-danger"
      : "border-ink-200 focus:border-brand dark:border-ink-700";

  const inputBase =
    "w-full rounded-md border bg-white px-5 py-4 text-sm font-bold text-ink-900 outline-none transition-colors dark:bg-ink-800 dark:text-white";
  const labelBase = "mb-2.5 block text-xs text-ink-500 dark:text-ink-200";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => router.back()}
        className="fixed inset-0 z-40 bg-black/50 animate-fadeIn"
      />

      {/* Drawer */}
      <div className="fixed left-[103px] top-0 z-50 flex h-screen w-full max-w-[719px] flex-col bg-white animate-slideIn dark:bg-ink-900 md:rounded-r-[20px]">
        <div className="drawer-scroll flex-1 overflow-y-auto px-14 pb-8 pt-14">
          <h1 className="mb-12 text-2xl font-bold text-ink-900 dark:text-white">
            {mode === "create" ? (
              "New Invoice"
            ) : (
              <>
                Edit <span className="text-ink-400">#</span>
                {invoice?.id}
              </>
            )}
          </h1>

          {/* Bill From */}
          <h2 className="mb-6 text-sm font-bold text-brand">Bill From</h2>
          <div className="mb-6">
            <label className={labelBase}>Street Address</label>
            <input
              value={sender.street}
              onChange={(e) => setSender({ ...sender, street: e.target.value })}
              className={`${inputBase} ${errorBorder(sender.street)}`}
            />
          </div>
          <div className="mb-12 grid grid-cols-3 gap-6">
            <div>
              <label className={labelBase}>City</label>
              <input
                value={sender.city}
                onChange={(e) => setSender({ ...sender, city: e.target.value })}
                className={`${inputBase} ${errorBorder(sender.city)}`}
              />
            </div>
            <div>
              <label className={labelBase}>Post Code</label>
              <input
                value={sender.postCode}
                onChange={(e) => setSender({ ...sender, postCode: e.target.value })}
                className={`${inputBase} ${errorBorder(sender.postCode)}`}
              />
            </div>
            <div>
              <label className={labelBase}>Country</label>
              <input
                value={sender.country}
                onChange={(e) => setSender({ ...sender, country: e.target.value })}
                className={`${inputBase} ${errorBorder(sender.country)}`}
              />
            </div>
          </div>

          {/* Bill To */}
          <h2 className="mb-6 text-sm font-bold text-brand">Bill To</h2>
          <div className="mb-6">
            <label className={labelBase}>Client&apos;s Name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`${inputBase} ${errorBorder(clientName)}`}
            />
          </div>
          <div className="mb-6">
            <label className={labelBase}>Client&apos;s Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="e.g. email@example.com"
              className={`${inputBase} ${errorBorder(clientEmail)}`}
            />
          </div>
          <div className="mb-6">
            <label className={labelBase}>Street Address</label>
            <input
              value={client.street}
              onChange={(e) => setClient({ ...client, street: e.target.value })}
              className={`${inputBase} ${errorBorder(client.street)}`}
            />
          </div>
          <div className="mb-12 grid grid-cols-3 gap-6">
            <div>
              <label className={labelBase}>City</label>
              <input
                value={client.city}
                onChange={(e) => setClient({ ...client, city: e.target.value })}
                className={`${inputBase} ${errorBorder(client.city)}`}
              />
            </div>
            <div>
              <label className={labelBase}>Post Code</label>
              <input
                value={client.postCode}
                onChange={(e) => setClient({ ...client, postCode: e.target.value })}
                className={`${inputBase} ${errorBorder(client.postCode)}`}
              />
            </div>
            <div>
              <label className={labelBase}>Country</label>
              <input
                value={client.country}
                onChange={(e) => setClient({ ...client, country: e.target.value })}
                className={`${inputBase} ${errorBorder(client.country)}`}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Invoice Date</label>
              <input
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className={`${inputBase} border-ink-200 focus:border-brand dark:border-ink-700`}
              />
            </div>
            <div className="relative">
              <label className={labelBase}>Payment Terms</label>
              <button
                type="button"
                onClick={() => setTermsOpen((o) => !o)}
                className={`${inputBase} flex items-center justify-between border-ink-200 dark:border-ink-700`}
              >
                Net {paymentTerms} Days
                <svg
                  width="11"
                  height="7"
                  viewBox="0 0 11 7"
                  fill="none"
                  className={`transition-transform ${termsOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" />
                </svg>
              </button>
              {termsOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg bg-white shadow-modal dark:bg-ink-700">
                  {[1, 7, 14, 30].map((days) => (
                    <button
                      type="button"
                      key={days}
                      onClick={() => {
                        setPaymentTerms(days);
                        setTermsOpen(false);
                      }}
                      className="block w-full border-b border-ink-200 px-5 py-3 text-left text-sm font-bold text-ink-900 last:border-b-0 hover:text-brand dark:border-ink-600 dark:text-white"
                    >
                      Net {days} Days
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-12">
            <label className={labelBase}>Project Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Graphic Design Service"
              className={`${inputBase} ${errorBorder(description)}`}
            />
          </div>

          {/* Item List */}
          <h2 className="mb-6 text-lg font-bold text-[#777F98]">Item List</h2>

          {items.length > 0 && (
            <div className="mb-4 grid grid-cols-[1fr_60px_100px_80px_40px] gap-4 text-xs text-ink-500 dark:text-ink-200">
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
          )}

          {items.map((it, idx) => (
            <div
              key={idx}
              className="mb-4 grid grid-cols-[1fr_60px_100px_80px_40px] items-center gap-4"
            >
              <input
                value={it.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
                className={`${inputBase} !py-3 ${errorBorder(it.name)}`}
              />
              <input
                value={it.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                className={`${inputBase} !py-3 border-ink-200 dark:border-ink-700`}
              />
              <input
                value={it.price}
                onChange={(e) => updateItem(idx, "price", e.target.value)}
                className={`${inputBase} !py-3 border-ink-200 dark:border-ink-700`}
              />
              <span className="text-sm font-bold text-ink-400">
                {itemTotal(it).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                aria-label="Remove item"
                className="text-ink-400 transition-colors hover:text-danger"
              >
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                  <path
                    d="M8.47 0l.935.936H12.2v1.871H0V.936h2.795L3.73 0h4.74zM2.336 14.13c0 1.03.84 1.87 1.87 1.87H8c1.03 0 1.87-.84 1.87-1.87V3.738h-7.534V14.13z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="mt-4 w-full rounded-full bg-ink-100 py-4 text-sm font-bold text-ink-400 transition-colors hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-ink-600"
          >
            + Add New Item
          </button>

          {showErrors && items.length === 0 && (
            <p className="mt-4 text-xs font-bold text-danger">- An item must be added</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 bg-white px-14 py-6 dark:bg-ink-900">
          {mode === "create" ? (
            <>
              <button
                onClick={() => router.back()}
                className="rounded-full bg-ink-100 px-6 py-4 text-sm font-bold text-ink-500 transition-colors hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-white"
              >
                Discard
              </button>
              <div className="flex gap-2">
                <button
                  disabled={submitting}
                  onClick={() => save("draft")}
                  className="rounded-full bg-ink-600 px-6 py-4 text-sm font-bold text-ink-300 transition-colors hover:bg-ink-900 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  disabled={submitting}
                  onClick={() => save("pending")}
                  className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
                >
                  Save &amp; Send
                </button>
              </div>
            </>
          ) : (
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => router.back()}
                className="rounded-full bg-ink-100 px-6 py-4 text-sm font-bold text-ink-500 transition-colors hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-white"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={() => save(invoice!.status === "draft" ? "draft" : "pending")}
                className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
