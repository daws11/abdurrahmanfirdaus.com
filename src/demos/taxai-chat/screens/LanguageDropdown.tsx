// src/demos/taxai-chat/screens/LanguageDropdown.tsx
//
// Globe icon dropdown — EN/AR language picker. Matches production
// LanguageSwitcher (language-switcher.tsx).

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../mocks";
import { cn } from "@/lib/utils";

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"en" | "ar">("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === active)!;

  return (
    <div ref={ref} className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-between w-full h-9 rounded-md px-2.5 text-xs",
          "hover:opacity-80",
        )}
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--fg)",
        }}
        aria-label="Select language"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4" style={{ color: "var(--muted)" }} />
          {current.nativeName}
        </span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-md shadow-lg z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === active;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setActive(lang.code);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:opacity-80"
                style={{
                  backgroundColor: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "var(--accent-fg)" : "var(--fg)",
                }}
                aria-pressed={isActive}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-[10px] opacity-75">{lang.name}</span>
                </div>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
