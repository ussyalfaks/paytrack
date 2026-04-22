"use client";

import { Moon, SunDim } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="fixed left-0 top-0 right-0 z-40 flex h-[72px] flex-row items-center justify-between bg-[#373B53] dark:bg-ink-800 lg:right-auto lg:h-screen lg:w-[103px] lg:flex-col lg:justify-between">
      {/* Logo block */}
      <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-br-[20px] lg:h-[103px] lg:w-[103px] lg:rounded-br-none lg:rounded-tr-[20px]">
        <div className="relative z-10 flex h-full items-center justify-center">
          <img src="/pics/logo.svg" alt="Logo" className="h-30 w-30" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center pr-6 lg:flex-col lg:items-center lg:pr-0">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="mr-6 flex h-5 w-5 items-center justify-center text-ink-400 transition-colors hover:text-ink-200 lg:mr-0 lg:mb-8"
        >
          {theme === "light" ? <Moon size={20} /> : <SunDim size={20} />}
        </button>
        <div className="h-8 w-px bg-[#494E6E] lg:h-px lg:w-full" />
        <div className="flex h-[72px] w-[72px] items-center justify-center lg:h-[88px] lg:w-full">
          <img src="/pics/Oval.svg" alt="Avatar" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </aside>
  );
}
