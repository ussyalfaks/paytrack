"use client";

import { useEffect, useRef } from "react";

interface Props {
  invoiceId: string;
  onCancel: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

export function DeleteModal({ invoiceId, onCancel, onConfirm, pending }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus Cancel button on mount
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onCancel]);

  // Focus trap: keep Tab/Shift+Tab inside the modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    modal.addEventListener("keydown", trap);
    return () => modal.removeEventListener("keydown", trap);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg bg-white p-12 shadow-modal dark:bg-ink-800"
      >
        <h2
          id="delete-modal-title"
          className="mb-3 text-2xl font-bold text-ink-900 dark:text-white"
        >
          Confirm Deletion
        </h2>
        <p className="mb-6 text-sm leading-[1.4rem] text-ink-400">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full bg-ink-100 px-6 py-4 text-sm font-bold text-ink-500 transition-colors hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="rounded-full bg-danger px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-danger-light disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
