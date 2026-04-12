import MaterialsSearch from "@/components/materials-search"

const PAGE_SIZE = 12

function readFilter(value: string | string[] | undefined) {
  return typeof value === "string" ? value : ""
}

function readPage(value: string | string[] | undefined) {
  const pageValue = typeof value === "string" ? Number(value) : Number.NaN
  return Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const searchQuery = readFilter(params.q)
  const category = readFilter(params.category)
  const courseCode = readFilter(params.course)
  const currentPage = readPage(params.page)

  return (
    <div className="my-2 px-5">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-slate-850 mb-5 text-zinc-600 font-extrabold">What are we studying today?</h1>
        <MaterialsSearch
          pageSize={PAGE_SIZE}
          initialPage={currentPage}
          initialQuery={searchQuery}
          initialCategory={category}
          initialCourse={courseCode}
        />
      </div>
    </div>
  )
}
