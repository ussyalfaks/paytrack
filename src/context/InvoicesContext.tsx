"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { generateInvoiceId, addDays } from "@/lib/format";
import seedData from "@/data/invoices.json";

const STORAGE_KEY = "paytrack_invoices";

type ItemInput = { name: string; quantity: number; price: number };

export interface InvoiceInput {
  senderAddress: Invoice["senderAddress"];
  clientAddress: Invoice["clientAddress"];
  clientName: string;
  clientEmail: string;
  createdAt: string;
  paymentTerms: number;
  description: string;
  status: "draft" | "pending";
  items: ItemInput[];
}

interface Ctx {
  invoices: Invoice[];
  initialized: boolean;
  createInvoice: (input: InvoiceInput) => Invoice;
  updateInvoice: (id: string, input: InvoiceInput) => void;
  deleteInvoice: (id: string) => void;
  markPaid: (id: string) => void;
}

const InvoicesCtx = createContext<Ctx | null>(null);

function buildItems(raw: ItemInput[]) {
  return raw.map((i) => ({ ...i, total: i.quantity * i.price }));
}

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setInvoices(stored ? (JSON.parse(stored) as Invoice[]) : (seedData as Invoice[]));
    setInitialized(true);
  }, []);

  const persist = (list: Invoice[]) => {
    setInvoices(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createInvoice = (input: InvoiceInput): Invoice => {
    const items = buildItems(input.items);
    const inv: Invoice = {
      id: generateInvoiceId(),
      createdAt: input.createdAt,
      paymentDue: addDays(input.createdAt, input.paymentTerms),
      description: input.description,
      paymentTerms: input.paymentTerms,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      status: input.status,
      senderAddress: input.senderAddress,
      clientAddress: input.clientAddress,
      items,
      total: items.reduce((s, i) => s + i.total, 0),
    };
    persist([...invoices, inv]);
    return inv;
  };

  const updateInvoice = (id: string, input: InvoiceInput) => {
    const items = buildItems(input.items);
    persist(
      invoices.map((inv) =>
        inv.id !== id
          ? inv
          : {
              ...inv,
              createdAt: input.createdAt,
              paymentDue: addDays(input.createdAt, input.paymentTerms),
              description: input.description,
              paymentTerms: input.paymentTerms,
              clientName: input.clientName,
              clientEmail: input.clientEmail,
              status: input.status,
              senderAddress: input.senderAddress,
              clientAddress: input.clientAddress,
              items,
              total: items.reduce((s, i) => s + i.total, 0),
            }
      )
    );
  };

  const deleteInvoice = (id: string) => {
    persist(invoices.filter((inv) => inv.id !== id));
  };

  const markPaid = (id: string) => {
    persist(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, status: "paid" as InvoiceStatus } : inv
      )
    );
  };

  return (
    <InvoicesCtx.Provider
      value={{ invoices, initialized, createInvoice, updateInvoice, deleteInvoice, markPaid }}
    >
      {children}
    </InvoicesCtx.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoicesCtx);
  if (!ctx) throw new Error("useInvoices must be used within InvoicesProvider");
  return ctx;
}
