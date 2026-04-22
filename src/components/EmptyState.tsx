export function EmptyState() {
  return (
    <div className="mx-auto mt-20 flex max-w-sm flex-col items-center text-center">
      {/* Illustration */}
      <img
        src="/pics/Email campaign_Flatline.svg"
        alt="Empty state illustration"
        className="mb-16 w-60"
      />

      <h2 className="mb-6 text-2xl font-bold text-ink-900 dark:text-white">
        There is nothing here
      </h2>
      <p className="text-sm leading-[1.25rem] text-ink-400">
        <span className="lg:hidden">Create an invoice by clicking the <span className="font-bold">New</span> button and get started</span>
        <span className="hidden lg:inline">Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started</span>
      </p>
    </div>
  );
}
