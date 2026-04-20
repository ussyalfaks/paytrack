"use client";

import { Moon } from 'lucide-react';
import { SunDim } from 'lucide-react';
import { useTheme } from "./ThemeProvider";

export function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[103px] flex-col justify-between bg-[#373B53] dark:bg-ink-800">
      {/* Logo block */}
      <div className="relative h-[103px] w-[103px] overflow-hidden rounded-br-[20px] rounded-tr-[20px] bg-brand">
        <div className="absolute inset-0 rounded-br-[20px] bg-brand-light [clip-path:polygon(0_50%,100%_50%,100%_100%,0_100%)]" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <img src="/pics/logo.svg" alt="Logo" className="h-10 w-10" />
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="mb-8 flex h-5 w-5 items-center justify-center text-ink-400 transition-colors hover:text-ink-200"
        >
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <SunDim size={20} />
          )}
        </button>
        <div className="h-px w-full bg-[#494E6E]" />
        <div className="flex h-[88px] items-center justify-center">
          <img src="/pics/Oval.svg" alt="Avatar" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </aside>
  );
}
