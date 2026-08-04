/**
 * 404-style fallback when a user navigates to `#/demos/{unknown}`.
 */
export function DemoNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Not found
        </div>
        <h1 className="mt-2 text-2xl font-semibold">No such demo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The demo you tried to open doesn't exist.
        </p>
        <a
          href="#/demos"
          className="mt-6 inline-flex h-9 items-center rounded-md border border-border bg-secondary px-4 text-sm font-medium hover:bg-secondary/80"
        >
          Back to demos
        </a>
      </div>
    </div>
  );
}
