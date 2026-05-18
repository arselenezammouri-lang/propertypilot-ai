/**
 * Next.js Instrumentation — runs once at server startup (before any route loads).
 * Polyfills globalThis.File for environments where it's missing (Node < 20).
 * Required by OpenAI SDK v5 which calls `typeof File` at module scope.
 */
export async function register() {
  if (typeof globalThis.File === "undefined") {
    try {
      const { File } = await import("node:buffer");
      globalThis.File = File as unknown as typeof globalThis.File;
    } catch {
      // Fallback: minimal File shim so the OpenAI SDK doesn't throw
      // @ts-expect-error — intentional polyfill for Node 18 compat
      globalThis.File = class File extends Blob {
        name: string;
        lastModified: number;
        constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
          super(bits, options);
          this.name = name;
          this.lastModified = options?.lastModified ?? Date.now();
        }
      };
    }
  }
}
