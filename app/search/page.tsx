import Link from "next/link";
import { Suspense } from "react";
import { BookCard } from "@/components/BookCard";
import { ExternalSearchLink } from "@/components/ExternalSearchLink";
import { OfferRow } from "@/components/OfferRow";
import { SearchHeader } from "@/components/SearchHeader";
import { StoreTabsList } from "@/components/StoreTabsList";
import { SummaryCards } from "@/components/SummaryCards";
import { buildNaverEbookSearchUrl } from "@/lib/providers/naver";
import { buildRidiSearchUrl } from "@/lib/providers/ridi";
import { search } from "@/lib/search";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;

  return (
    <main className="flex-1 flex flex-col">
      <SearchHeader initialQuery={q} />
      <div className="px-4 sm:px-6 pb-10 max-w-2xl mx-auto w-full">
        <div className="mt-6 sm:mt-8">
          <Suspense key={q} fallback={<LoadingState query={q} />}>
            <Results query={q} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function LoadingState({ query }: { query: string }) {
  return (
    <div className="py-16 text-center text-steel text-[14px]">
      <p>
        &quot;<span className="text-ink font-medium">{query}</span>&quot; 검색 중...
      </p>
    </div>
  );
}

async function Results({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="py-16 text-center text-steel text-[14px]">
        검색어를 입력해주세요.
      </div>
    );
  }

  let result;
  try {
    result = await search(query);
  } catch (e) {
    return (
      <div className="py-12 px-5 rounded-lg bg-canvas border border-hairline text-[14px] text-primary-deep">
        검색 중 오류가 발생했습니다: {(e as Error).message}
      </div>
    );
  }

  if (!result.primary) {
    return (
      <div className="py-16 text-center text-steel text-[14px]">
        &quot;<span className="text-ink font-medium">{query}</span>&quot;에 해당하는 책을 찾지 못했습니다.
      </div>
    );
  }

  const { primary, alternatives } = result;
  const usedOnline = primary.usedOffers
    .filter((o) => o.source === "aladin-online" && o.price > 0)
    .sort((a, b) => a.price - b.price);
  const usedStores = primary.usedOffers.filter(
    (o) => o.source === "aladin-store",
  );
  const ebookSorted = [...primary.ebookOffers].sort(
    (a, b) => a.price - b.price,
  );

  return (
    <div className="space-y-10">
      <section className="bg-cream rounded-xl border border-beige-deep p-6 sm:p-8">
        <BookCard book={primary.book} />
      </section>

      <SummaryCards detail={primary} />

      <Section
        id="used-online"
        eyebrow="중고 · 온라인"
        title="알라딘 중고"
        count={usedOnline.length}
        emptyMessage="등록된 온라인 중고 매물이 없습니다."
      >
        {usedOnline.map((offer, i) => (
          <OfferRow
            key={i}
            label={offer.quality || "알라딘 중고"}
            price={offer.price}
            href={offer.link}
            badge="알라딘"
          />
        ))}
      </Section>

      <section id="used-store" className="scroll-target">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-steel">
              중고 · 매장
            </div>
            <h3 className="display text-[20px] text-ink mt-1">
              알라딘 중고서점
            </h3>
          </div>
          <div className="text-[12px] text-steel tabular">
            {usedStores.length}지점
          </div>
        </div>

        {usedStores.length === 0 ? (
          <p className="text-[13px] text-steel py-4 px-4 bg-canvas rounded-lg border border-hairline-soft">
            매장 재고가 없습니다.
          </p>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4 px-4 py-3 rounded-lg bg-cream border border-beige-deep">
              <span
                aria-hidden="true"
                className="mt-px text-primary text-[14px]"
              >
                ⓘ
              </span>
              <p className="text-[13px] leading-[1.55] text-ink">
                <span className="font-semibold">
                  매장별 가격은 클릭 시 알라딘 페이지에서 확인됩니다.
                </span>
                <span className="block text-steel mt-0.5">
                  지점을 선택하면 해당 매장의 재고와 상품 상태별 가격을 볼 수 있어요.
                </span>
              </p>
            </div>
            <StoreTabsList offers={usedStores} />
          </>
        )}
      </section>

      <section id="ebook" className="scroll-target">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-steel">
              전자책
            </div>
            <h3 className="display text-[20px] text-ink mt-1">eBook</h3>
          </div>
          <div className="text-[12px] text-steel tabular">
            {ebookSorted.length}개
          </div>
        </div>
        <div className="space-y-2">
          {ebookSorted.length === 0 ? (
            <p className="text-[13px] text-steel py-4 px-4 bg-canvas rounded-lg border border-hairline-soft">
              알라딘에 등록된 eBook이 없습니다.
            </p>
          ) : (
            ebookSorted.map((offer, i) => (
              <OfferRow
                key={i}
                label="알라딘 eBook"
                price={offer.price}
                href={offer.link}
                badge="알라딘"
              />
            ))
          )}
          <ExternalSearchLink
            siteName="리디북스"
            href={buildRidiSearchUrl(primary.book.title)}
            badge="외부 검색"
            sublabel="리디북스에서 이 책 검색해보기"
          />
          <ExternalSearchLink
            siteName="네이버 도서"
            href={buildNaverEbookSearchUrl(primary.book.title)}
            badge="외부 검색"
            sublabel="5개 판매처 e북 가격을 한눈에"
          />
        </div>
      </section>

      {alternatives.length > 0 && (
        <section>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-steel mb-3">
            다른 검색 결과
          </div>
          <div className="space-y-2">
            {alternatives.map((book) => (
              <Link
                key={book.itemId}
                href={`/search?q=${encodeURIComponent(book.isbn13 || book.title)}`}
                className="block px-4 py-3 rounded-lg border border-hairline-soft bg-canvas hover:border-primary transition-colors"
              >
                <div className="text-[14px] font-medium text-ink truncate">
                  {book.title}
                </div>
                <div className="text-[12px] text-steel truncate mt-0.5">
                  {book.author} · {book.publisher}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  count,
  countLabel = "개",
  emptyMessage,
  footnote,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  count: number;
  countLabel?: string;
  emptyMessage: string;
  footnote?: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const hasItems = items.length > 0 && count > 0;
  return (
    <section id={id} className={id ? "scroll-target" : undefined}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-steel">
            {eyebrow}
          </div>
          <h3 className="display text-[20px] text-ink mt-1">{title}</h3>
        </div>
        <div className="text-[12px] text-steel tabular">
          {count}
          {countLabel}
        </div>
      </div>
      {hasItems ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="text-[13px] text-steel py-4 px-4 bg-canvas rounded-lg border border-hairline-soft">
          {emptyMessage}
        </p>
      )}
      {footnote && hasItems && (
        <p className="text-[12px] text-stone mt-2">{footnote}</p>
      )}
    </section>
  );
}
