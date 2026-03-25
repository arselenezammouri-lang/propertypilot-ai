/**
 * Resolve H1 / document title for `/blog/[slug]` when slug is not in `knownTitles`.
 */
export function titleFromBlogSlug(slug: string, knownTitles: Record<string, string>): string {
  const known = knownTitles[slug];
  if (known) return known;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
