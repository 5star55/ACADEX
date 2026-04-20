"use client"

export default function Error() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center justify-center px-6">
      <div className="rounded-xl border border-border bg-card px-6 py-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-foreground">
          Error loading material
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    </div>
  )
}
