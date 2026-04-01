"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Doc } from "@/convex/_generated/dataModel"
import MaterialCard from "@/components/card"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "./ui/button"

type MaterialsSearchProps = {
  materials: Doc<"materials">[]
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export default function MaterialsSearch({ materials }: MaterialsSearchProps) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const categories = useMemo(() => {
    const categoryList = materials.map((material) => material.category)
    const uniqueCategories = [...new Set(categoryList)]
    return ["all", ...uniqueCategories]
  }, [materials])

  const courses = useMemo(() => {
    const courseList = materials.map((material) => material.courseCode)
    const uniqueCourses = [...new Set(courseList)]
    return ["all", ...uniqueCourses]
  }, [materials])

  const filtered = useMemo(() => {
    const q = normalize(query)

    const matchingMaterials = materials.filter((material) => {
      const haystack = [
        material.title,
        material.courseCode,
        material.category,
        material.uploaderName,
      ]

      const matchesSearch =
        !q || haystack.some((value) => normalize(value).includes(q))

      const matchesCategory =
        selectedCategory === "all" || material.category === selectedCategory

      const matchesCourse =
        selectedCourse === "all" || material.courseCode === selectedCourse

      return matchesSearch && matchesCategory && matchesCourse
    })

    const sortedMaterials = [...matchingMaterials].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return sortedMaterials
  }, [materials, query, selectedCategory, selectedCourse])

  return (
    <>
      <p className="mb-10 inline-flex items-center gap-2">
        <Star className="size-4" />
        <span>Recommended</span>
      </p>
      <div className="mb-10 flex flex-col gap-8">
        <div className="flex gap-4 justify-between">
          <form action="" className="flex w-full items-center justify-center">
            <Input
              placeholder="Search for PDFs, notes, course codes, or uploaders"
              className="w-full max-w-md"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <Button asChild type="button">
            <Link href="/upload">Upload</Link>
          </Button>
        </div>
<div className="flex gap-3 sm:flex-row sm:grid sm:grid-cols-2 ">
  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
    <SelectTrigger className="w-full sm:flex-1">
      <SelectValue placeholder="Filter by category" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category) => (
        <SelectItem key={category} value={category}>
          {category === "all" ? "All categories" : category}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
    <SelectTrigger className="w-full sm:flex-1">
      <SelectValue placeholder="Filter by course" />
    </SelectTrigger>
    <SelectContent>
      {courses.map((course) => (
        <SelectItem key={course} value={course}>
          {course === "all" ? "All courses" : course}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

</div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {materials.length} materials
        </p>
      </div>

      <ul className="list-none flex flex-col gap-4 md:grid grid-cols-2">
        {filtered.map((material) => (
          <li key={material._id}>
            <MaterialCard material={material} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No matches found.</p>
      ) : null}
    </>
  )
}
