"use client"

import { useMemo, useState } from "react"
import CourseCard from "@/components/course-card"
import { Input } from "@/components/ui/input"
import type { CourseSearchProps } from "@/lib/data"

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export default function CourseSearch({ courses }: CourseSearchProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return courses
    return courses.filter((course) => {
      const haystack = [
        course.courseCode,
        course.latestTitle,
      ]
      return haystack.some((value) => normalize(value).includes(q))
    })
  }, [courses, query])

  return (
    <>    
      <form action="" className="mb-10 flex items-center justify-center">
        <Input
          placeholder="search for courses"
          className="w-full max-w-md"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      <ul className="list-none flex flex-col gap-4 md:grid grid-cols-2">
        {filtered.map((course) => (
          <li key={course._id}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No matches found.</p>
      ) : null}
    </>
  )
}
