export function ExternalSearchLink({
  siteName,
  href,
  badge,
  sublabel,
}: {
  siteName: string;
  href: string;
  badge?: string;
  sublabel: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-beige-deep bg-cream-soft hover:border-primary hover:bg-cream-deeper transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-ink truncate">
            {siteName}
          </span>
          {badge && (
            <span className="shrink-0 text-[10px] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded-md bg-canvas text-steel">
              {badge}
            </span>
          )}
        </div>
        <div className="text-[12px] text-steel truncate mt-1">
          {sublabel}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 text-[13px] font-medium text-primary">
        <span>검색하러 가기</span>
        <span aria-hidden="true" className="text-[12px]">
          ↗
        </span>
      </div>
    </a>
  );
}
