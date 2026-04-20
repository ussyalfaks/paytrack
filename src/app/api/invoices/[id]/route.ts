import { NextRequest, NextResponse } from "next/server";
import { readInvoices, writeInvoices } from "@/lib/db";
import { addDays } from "@/lib/format";

type Ctx = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  const invoices = await readInvoices();
  const invoice = invoices.find((i) => i.id === params.id);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const body = await req.json();
  const invoices = await readInvoices();
  const idx = invoices.findIndex((i) => i.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = (body.items || []).map((i: any) => ({
    name: i.name,
    quantity: Number(i.quantity) || 0,
    price: Number(i.price) || 0,
    total: (Number(i.quantity) || 0) * (Number(i.price) || 0),
  }));
  const total = items.reduce((sum: number, i: any) => sum + i.total, 0);
  const createdAt = body.createdAt || invoices[idx].createdAt;
  const paymentTerms = Number(body.paymentTerms) || invoices[idx].paymentTerms;

  invoices[idx] = {
    ...invoices[idx],
    createdAt,
    paymentDue: addDays(createdAt, paymentTerms),
    description: body.description ?? invoices[idx].description,
    paymentTerms,
    clientName: body.clientName ?? invoices[idx].clientName,
    clientEmail: body.clientEmail ?? invoices[idx].clientEmail,
    status: body.status ?? invoices[idx].status,
    senderAddress: body.senderAddress ?? invoices[idx].senderAddress,
    clientAddress: body.clientAddress ?? invoices[idx].clientAddress,
    items,
    total,
  };

  await writeInvoices(invoices);
  return NextResponse.json(invoices[idx]);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const body = await req.json();
  const invoices = await readInvoices();
  const idx = invoices.findIndex((i) => i.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.status) invoices[idx].status = body.status;
  await writeInvoices(invoices);
  return NextResponse.json(invoices[idx]);
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const invoices = await readInvoices();
  const filtered = invoices.filter((i) => i.id !== params.id);
  if (filtered.length === invoices.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeInvoices(filtered);
  return NextResponse.json({ success: true });
}
