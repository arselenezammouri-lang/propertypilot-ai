import { titleFromBlogSlug } from '@/lib/i18n/blog-post-slug';

describe('titleFromBlogSlug', () => {
  it('uses knownTitles when present', () => {
    expect(
      titleFromBlogSlug('foo', { foo: 'Bar Baz' })
    ).toBe('Bar Baz');
  });

  it('title-cases unknown slug', () => {
    expect(titleFromBlogSlug('hello-world-test', {})).toBe('Hello World Test');
  });
});
