import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  level = 2,
}: SectionHeaderProps) => {
  const Heading = `h${level}` as "h1" | "h2" | "h3";

  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-ink/40" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-ink/40" aria-hidden="true" />
        </div>
      )}
      <Heading className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
