import { Star } from "lucide-react"
import getdata from "@/lib/getdata"
import MaterialsSearch from "@/components/materials-search"

export default async function Page() {
  const materials = await getdata()
  return (
    <div className="my-2 px-5">
      <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-slate-850 mb-5 text-zinc-600 font-extrabold">What are we studying today?</h1>
      <MaterialsSearch materials={materials}/>
      </div>
    </div>
  )
}
