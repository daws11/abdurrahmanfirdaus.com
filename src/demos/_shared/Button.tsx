// src/demos/_shared/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-[var(--accent-fg)] hover:opacity-90",
        secondary: "border bg-transparent hover:bg-[var(--surface)]",
        ghost: "hover:bg-[var(--surface)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, style, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    const base: Record<string, string> = {};
    if (variant === "primary") {
      base.backgroundColor = "var(--accent)";
    } else if (variant === "secondary") {
      base.borderColor = "var(--border)";
      base.color = "var(--fg)";
    } else if (variant === "ghost") {
      base.color = "var(--fg)";
    }
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={{ ...base, ...style }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
