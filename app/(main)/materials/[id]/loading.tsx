import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Skeleton className="h-10 w-28 rounded-md" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-2/3" />

            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
            </div>

            <Skeleton className="h-12 w-56 rounded-full" />
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
