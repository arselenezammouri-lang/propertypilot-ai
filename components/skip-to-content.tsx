"use client";

/**
 * Skip link for accessibility: first focusable element, jumps to main content.
 * Place at the start of the body (e.g. inside layout). Target must have id="main-content".
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:[clip:auto]"
    >
      Skip to main content
    </a>
  );
}
