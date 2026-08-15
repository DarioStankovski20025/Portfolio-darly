"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

const cta = cva(
  "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-[3px] font-medium tracking-[-0.01em] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  {
    variants: {
      tone: {
        ink: "bg-ink text-paper hover:text-white",
        paper: "bg-paper text-ink hover:text-white",
        outline:
          "border border-[var(--hairline-strong)] text-[var(--on-surface)] hover:text-white",
      },
      size: {
        md: "min-h-12 px-6 py-3.5 text-[0.9375rem]",
        lg: "min-h-14 px-8 py-4.5 text-base md:text-lg",
      },
    },
    defaultVariants: { tone: "ink", size: "md" },
  },
);

type CtaProps = {
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
} & VariantProps<typeof cta> &
  Omit<ComponentProps<typeof Link>, "className">;

/**
 * Primary call to action. The signature gradient wipes up from the baseline on
 * hover and the arrow leaves through the top-right while its twin arrives from
 * below. The fill reads `--gradient-signature`, which is re-pointed by
 * `.on-dark`, so one button works on either chapter.
 */
export function CtaButton({
  children,
  className,
  tone,
  size,
  magnetic = true,
  ...linkProps
}: CtaProps) {
  const button = (
    <Link className={cn(cta({ tone, size }), className)} data-cursor="link" {...linkProps}>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[image:var(--gradient-signature)] transition-transform duration-[350ms] group-hover:scale-y-100 group-focus-visible:scale-y-100",
          EASE_CLASS,
        )}
      />
      <span className="relative">{children}</span>
      <ArrowGlyph />
    </Link>
  );

  return magnetic ? <Magnetic strength={0.28}>{button}</Magnetic> : button;
}

/** Two arrows in a 1em window — one exits, one arrives. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative block size-[1.1em] shrink-0 overflow-hidden", className)}
    >
      <ArrowUpRight
        className={cn(
          "absolute inset-0 size-full transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full",
          EASE_CLASS,
        )}
        strokeWidth={1.75}
      />
      <ArrowUpRight
        className={cn(
          "absolute inset-0 size-full -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0",
          EASE_CLASS,
        )}
        strokeWidth={1.75}
      />
    </span>
  );
}

/** Secondary action: type, a hairline that retracts and returns, and an arrow. */
export function TextLink({
  children,
  className,
  ...linkProps
}: { children: ReactNode; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "className"
>) {
  return (
    <Link
      className={cn(
        "group relative inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]",
        className,
      )}
      data-cursor="link"
      {...linkProps}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-0 group-focus-visible:origin-left group-focus-visible:scale-x-0",
            EASE_CLASS,
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent-contextual)] transition-transform delay-150 duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100",
            EASE_CLASS,
          )}
        />
      </span>
      <ArrowGlyph className="size-[0.95em]" />
    </Link>
  );
}
