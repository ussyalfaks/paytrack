import { NextRequest, NextResponse } from "next/server";
import { readInvoices, writeInvoices } from "@/lib/db";
import { addDays, generateInvoiceId } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

export async function GET() {
  const invoices = await readInvoices();
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const invoices = await readInvoices();

  const items = (body.items || []).map((i: any) => ({
    name: i.name,
    quantity: Number(i.quantity) || 0,
    price: Number(i.price) || 0,
    total: (Number(i.quantity) || 0) * (Number(i.price) || 0),
  }));

  const total = items.reduce((sum: number, i: any) => sum + i.total, 0);
  const createdAt = body.createdAt || new Date().toISOString().split("T")[0];
  const paymentTerms = Number(body.paymentTerms) || 30;

  const newInvoice: Invoice = {
    id: generateInvoiceId(),
    createdAt,
    paymentDue: addDays(createdAt, paymentTerms),
    description: body.description || "",
    paymentTerms,
    clientName: body.clientName || "",
    clientEmail: body.clientEmail || "",
    status: body.status === "draft" ? "draft" : "pending",
    senderAddress: body.senderAddress,
    clientAddress: body.clientAddress,
    items,
    total,
  };

  invoices.push(newInvoice);
  await writeInvoices(invoices);
  return NextResponse.json(newInvoice, { status: 201 });
}
