"use client";

import { useEffect, useRef, useState } from "react";
import type { InvoiceStatus } from "@/types/invoice";

const OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

interface Props {
  selected: InvoiceStatus[];
  onChange: (next: InvoiceStatus[]) => void;
}

export function FilterDropdown({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = (v: InvoiceStatus) => {
    if (selected.includes(v)) onChange(selected.filter((s) => s !== v));
    else onChange([...selected, v]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 text-sm font-bold text-ink-900 dark:text-white"
      >
        <span className="hidden lg:inline">Filter by status</span>
        <span className="lg:hidden">Filter</span>
          <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-6 w-48 rounded-lg bg-white p-6 shadow-modal dark:bg-ink-700">
          {OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="group flex cursor-pointer items-center gap-3 py-1.5"
            >
              <span className="relative flex h-4 w-4 shrink-0">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="sr-only peer"
                />
                <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-ink-200 bg-ink-100 transition-colors group-hover:border-brand peer-checked:border-brand peer-checked:bg-brand dark:border-ink-700 dark:bg-ink-800 dark:group-hover:border-brand dark:peer-checked:bg-brand">
                  {selected.includes(opt.value) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1.2 3.8l2.6 2.6L8.8 1.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </span>
              </span>
              <span className="text-sm font-bold text-ink-900 dark:text-white">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
