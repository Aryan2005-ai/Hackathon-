import { useState } from "react";
import { cn } from "@/lib/utils";

function domainOf(url?: string) {
  if (!url) return "";
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className,
}: {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
}) {
  const key = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;

  const domain = domainOf(websiteUrl);

  const sources = [
    ...(key && domain ? [`https://img.logo.dev/${domain}?token=${key}&size=128`] : []),
    ...(logoUrl ? [logoUrl] : []),
  ];

  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card",
        className,
      )}
    >
      {src ? (
        <img
          key={src}
          src={src}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-1.5"
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <span className="font-heading text-lg font-semibold text-link">
          {name?.charAt(0)?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
