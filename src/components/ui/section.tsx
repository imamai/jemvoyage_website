import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "onDark";
}) {
  return (
    <p
      className={cn(
        "text-eyebrow uppercase",
        tone === "onDark" ? "text-gold-300" : "text-gold-600",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Standard vertical rhythm for a homepage band. `tone` swaps the whole surface
 * so alternating sections read as distinct without any per-section colour
 * decisions leaking into page code.
 */
export function Section({
  children,
  className,
  tone = "canvas",
  as: Tag = "section",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "canvas" | "surface" | "sunken" | "inverse";
  as?: "section" | "div" | "aside";
  id?: string;
}) {
  const tones = {
    canvas: "bg-canvas text-fg",
    surface: "bg-surface text-fg",
    sunken: "bg-surface-sunken text-fg",
    inverse: "bg-brand-800 text-sand-100",
  } as const;

  return (
    <Tag id={id} className={cn("py-16 md:py-24", tones[tone], className)}>
      {children}
    </Tag>
  );
}

/** Eyebrow + heading + optional standfirst, used at the top of every band. */
export function SectionHeader({
  eyebrow,
  heading,
  subheading,
  align = "left",
  tone = "default",
  className,
  action,
}: {
  eyebrow?: string | null;
  heading: string;
  subheading?: string | null;
  align?: "left" | "center";
  tone?: "default" | "onDark";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow ? (
          <Eyebrow tone={tone} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={cn(
            "text-h2",
            tone === "onDark" ? "text-sand-50" : "text-brand-800",
          )}
        >
          {heading}
        </h2>
        {subheading ? (
          <p
            className={cn(
              "mt-4 text-lead",
              tone === "onDark" ? "text-sand-200" : "text-fg-muted",
            )}
          >
            {subheading}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
