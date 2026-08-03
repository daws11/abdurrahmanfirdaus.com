import { useEffect, useState } from "react";
import { type DemoTheme, getTheme } from "./theme";

export function useTheme(id: DemoTheme["id"]): DemoTheme {
  const [theme, setTheme] = useState(() => getTheme(id));
  useEffect(() => {
    const next = getTheme(id);
    setTheme(next);
    const root = document.documentElement;
    // remove any previous .demo-* classes
    Array.from(root.classList)
      .filter((c) => c.startsWith("demo-"))
      .forEach((c) => root.classList.remove(c));
    root.classList.add(`demo-${id}`);
    for (const [k, v] of Object.entries(next.tokens)) {
      root.style.setProperty(k, v);
    }
  }, [id]);
  return theme;
}
