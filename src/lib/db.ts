import fs from "fs/promises";
import path from "path";
import type { Invoice } from "@/types/invoice";

const DATA_FILE = path.join(process.cwd(), "src/data/invoices.json");

export async function readInvoices(): Promise<Invoice[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Invoice[];
}

export async function writeInvoices(invoices: Invoice[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(invoices, null, 2), "utf-8");
}

export async function findInvoice(id: string): Promise<Invoice | undefined> {
  const invoices = await readInvoices();
  return invoices.find((inv) => inv.id === id);
}
