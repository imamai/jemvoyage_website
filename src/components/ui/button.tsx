import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-wide transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    // Focus styling is inherited from the global :focus-visible ring so it
    // stays consistent across links, buttons and form controls.
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-sand-50 hover:bg-brand-500 shadow-subtle hover:shadow-raised",
        gold: "bg-gold-500 text-brand-900 hover:bg-gold-400 shadow-subtle hover:shadow-raised",
        outline:
          "border border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-sand-50",
        ghost: "text-brand-700 hover:bg-brand-50",
        onDark:
          "bg-sand-50/95 text-brand-800 hover:bg-sand-50 backdrop-blur-sm shadow-raised",
        onDarkOutline:
          "border border-sand-50/70 text-sand-50 hover:bg-sand-50 hover:text-brand-800 backdrop-blur-sm",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-sm",
        md: "h-11 px-6 text-sm rounded-sm",
        lg: "h-13 px-8 text-base rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof button> & { className?: string };

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  ...props
}: ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className">) {
  return (
    <Link
      href={href}
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  );
}

export { button as buttonVariants };
