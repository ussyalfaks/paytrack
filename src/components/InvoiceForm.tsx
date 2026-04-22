"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invoice } from "@/types/invoice";
import { useInvoices } from "@/context/InvoicesContext";

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

const isValidEmail = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export function InvoiceForm({ invoice, mode }: Props) {
  const router = useRouter();
  const { createInvoice, updateInvoice } = useInvoices();
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
  const isPositive = (val: string) => Number(val) > 0;

  const save = (status: "draft" | "pending") => {
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
        !isValidEmail(clientEmail) ||
        hasBlank(description) ||
        items.length === 0 ||
        items.some(
          (it) => hasBlank(it.name) || !isPositive(it.quantity) || !isPositive(it.price)
        );

      if (hasEmptyField) {
        setShowErrors(true);
        return;
      }
    }

    const input = {
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

    if (mode === "create") {
      createInvoice(input);
      router.push("/");
    } else {
      updateInvoice(invoice!.id, input);
      router.push(`/invoices/${invoice!.id}`);
    }
  };

  // Returns red border when field is invalid and errors are shown
  const errorBorder = (invalid: boolean) =>
    showErrors && invalid
      ? "border-danger focus:border-danger"
      : "border-ink-200 focus:border-brand dark:border-ink-700";

  // Renders an inline error message below a field
  const fieldError = (invalid: boolean, message: string) =>
    showErrors && invalid ? (
      <p role="alert" className="mt-1 text-xs font-semibold text-danger">{message}</p>
    ) : null;

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
      <div className="fixed left-0 top-0 z-50 flex h-screen w-full flex-col bg-white animate-slideIn dark:bg-ink-900 lg:left-[103px] lg:max-w-[719px] lg:rounded-r-[20px]">
        <div className="drawer-scroll flex-1 overflow-y-auto px-6 pb-8 pt-10 lg:px-14 lg:pt-14">
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
              className={`${inputBase} ${errorBorder(hasBlank(sender.street))}`}
            />
            {fieldError(hasBlank(sender.street), "can't be empty")}
          </div>
          <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-3">
            <div>
              <label className={labelBase}>City</label>
              <input
                value={sender.city}
                onChange={(e) => setSender({ ...sender, city: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(sender.city))}`}
              />
              {fieldError(hasBlank(sender.city), "can't be empty")}
            </div>
            <div>
              <label className={labelBase}>Post Code</label>
              <input
                value={sender.postCode}
                onChange={(e) => setSender({ ...sender, postCode: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(sender.postCode))}`}
              />
              {fieldError(hasBlank(sender.postCode), "can't be empty")}
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className={labelBase}>Country</label>
              <input
                value={sender.country}
                onChange={(e) => setSender({ ...sender, country: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(sender.country))}`}
              />
              {fieldError(hasBlank(sender.country), "can't be empty")}
            </div>
          </div>

          {/* Bill To */}
          <h2 className="mb-6 text-sm font-bold text-brand">Bill To</h2>
          <div className="mb-6">
            <label className={labelBase}>Client&apos;s Name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`${inputBase} ${errorBorder(hasBlank(clientName))}`}
            />
            {fieldError(hasBlank(clientName), "can't be empty")}
          </div>
          <div className="mb-6">
            <label className={labelBase}>Client&apos;s Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="e.g. email@example.com"
              className={`${inputBase} ${errorBorder(hasBlank(clientEmail) || !isValidEmail(clientEmail))}`}
            />
            {fieldError(hasBlank(clientEmail), "can't be empty")}
            {fieldError(!hasBlank(clientEmail) && !isValidEmail(clientEmail), "invalid email format")}
          </div>
          <div className="mb-6">
            <label className={labelBase}>Street Address</label>
            <input
              value={client.street}
              onChange={(e) => setClient({ ...client, street: e.target.value })}
              className={`${inputBase} ${errorBorder(hasBlank(client.street))}`}
            />
            {fieldError(hasBlank(client.street), "can't be empty")}
          </div>
          <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-3">
            <div>
              <label className={labelBase}>City</label>
              <input
                value={client.city}
                onChange={(e) => setClient({ ...client, city: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(client.city))}`}
              />
              {fieldError(hasBlank(client.city), "can't be empty")}
            </div>
            <div>
              <label className={labelBase}>Post Code</label>
              <input
                value={client.postCode}
                onChange={(e) => setClient({ ...client, postCode: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(client.postCode))}`}
              />
              {fieldError(hasBlank(client.postCode), "can't be empty")}
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className={labelBase}>Country</label>
              <input
                value={client.country}
                onChange={(e) => setClient({ ...client, country: e.target.value })}
                className={`${inputBase} ${errorBorder(hasBlank(client.country))}`}
              />
              {fieldError(hasBlank(client.country), "can't be empty")}
            </div>
          </div>

          {/* Dates */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              className={`${inputBase} ${errorBorder(hasBlank(description))}`}
            />
            {fieldError(hasBlank(description), "can't be empty")}
          </div>

          {/* Item List */}
          <h2 className="mb-6 text-lg font-bold text-[#777F98]">Item List</h2>

          {items.length > 0 && (
            <div className="mb-4 hidden lg:grid grid-cols-[1fr_60px_100px_80px_40px] gap-4 text-xs text-ink-500 dark:text-ink-200">
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
          )}

          {items.map((it, idx) => (
            <div key={idx} className="mb-6 lg:mb-4">
              {/* Mobile layout */}
              <div className="lg:hidden space-y-3">
                <div>
                  <label className={labelBase}>Item Name</label>
                  <input
                    value={it.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    className={`${inputBase} !py-3 ${errorBorder(hasBlank(it.name))}`}
                  />
                  {fieldError(hasBlank(it.name), "can't be empty")}
                </div>
                <div className="grid grid-cols-[60px_100px_1fr_40px] items-end gap-4">
                  <div>
                    <label className={labelBase}>Qty.</label>
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      className={`${inputBase} !py-3 ${errorBorder(!isPositive(it.quantity))}`}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Price</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={it.price}
                      onChange={(e) => updateItem(idx, "price", e.target.value)}
                      className={`${inputBase} !py-3 ${errorBorder(!isPositive(it.price))}`}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Total</label>
                    <span className="flex h-[46px] items-center text-sm font-bold text-ink-400">
                      {itemTotal(it).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex h-[46px] items-center justify-center">
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
                </div>
                {showErrors && (!isPositive(it.quantity) || !isPositive(it.price)) && (
                  <p role="alert" className="text-xs font-semibold text-danger">
                    qty and price must be greater than 0
                  </p>
                )}
              </div>

              {/* Desktop layout */}
              <div className="hidden lg:grid grid-cols-[1fr_60px_100px_80px_40px] items-start gap-4">
                <div>
                  <input
                    value={it.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    className={`${inputBase} !py-3 ${errorBorder(hasBlank(it.name))}`}
                  />
                  {fieldError(hasBlank(it.name), "can't be empty")}
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                    className={`${inputBase} !py-3 ${errorBorder(!isPositive(it.quantity))}`}
                  />
                  {fieldError(!isPositive(it.quantity), "must be > 0")}
                </div>
                <div>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={it.price}
                    onChange={(e) => updateItem(idx, "price", e.target.value)}
                    className={`${inputBase} !py-3 ${errorBorder(!isPositive(it.price))}`}
                  />
                  {fieldError(!isPositive(it.price), "must be > 0")}
                </div>
                <span className="flex h-[46px] items-center text-sm font-bold text-ink-400">
                  {itemTotal(it).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  aria-label="Remove item"
                  className="mt-3 text-ink-400 transition-colors hover:text-danger"
                >
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                    <path
                      d="M8.47 0l.935.936H12.2v1.871H0V.936h2.795L3.73 0h4.74zM2.336 14.13c0 1.03.84 1.87 1.87 1.87H8c1.03 0 1.87-.84 1.87-1.87V3.738h-7.534V14.13z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
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
            <p role="alert" className="mt-4 text-xs font-bold text-danger">- An item must be added</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 bg-white px-6 py-6 dark:bg-ink-900 lg:px-14">
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
                  disabled={false}
                  onClick={() => save("draft")}
                  className="rounded-full bg-ink-600 px-6 py-4 text-sm font-bold text-ink-300 transition-colors hover:bg-ink-900 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  disabled={false}
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
                disabled={false}
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
