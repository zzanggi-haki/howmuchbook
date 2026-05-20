import { toRidiSearchQuery } from "./ridi";

const NAVER_BOOK_SEARCH_BASE = "https://search.shopping.naver.com/book/search";

export function buildNaverEbookSearchUrl(title: string): string {
  const params = new URLSearchParams({
    bookType: "ebook",
    query: toRidiSearchQuery(title),
  });
  return `${NAVER_BOOK_SEARCH_BASE}?${params.toString()}`;
}
