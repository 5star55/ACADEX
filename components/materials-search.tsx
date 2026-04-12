"use client"

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import MaterialCard from "@/components/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Star } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "./ui/button"

type MaterialsSearchProps = {
  pageSize: number
  initialPage: number
  initialQuery: string
  initialCategory: string
  initialCourse: string
}

function readPage(value: string | null, fallback: number) {
  const pageValue = value ? Number(value) : Number.NaN
  return Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : fallback
}

export default function MaterialsSearch({
  pageSize,
  initialPage,
  initialQuery,
  initialCategory,
  initialCourse,
}: MaterialsSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [draftQuery, setDraftQuery] = useState<string | null>(null)
  const pendingPageRef = useRef<number | null>(null)

  const currentPage = readPage(searchParams.get("page"), initialPage)
  const categories = useQuery(api.materials.listMaterialCategories) ?? []
  const coursesData = useQuery(api.materials.listCourses) ?? []
  const courses = [...new Set(coursesData.map((course) => course.courseCode))].sort()

  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.materials.listMaterialsPaginated,
    {
      searchQuery: initialQuery || undefined,
      category: initialCategory || undefined,
      courseCode: initialCourse || undefined,
    },
    { initialNumItems: pageSize }
  )

  const loadedItems = results.length
  const loadedPages = Math.max(1, Math.ceil(Math.max(loadedItems, 1) / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const visibleMaterials = results.slice(startIndex, startIndex + pageSize)
  const showingFrom = loadedItems === 0 ? 0 : startIndex + 1
  const showingTo = loadedItems === 0 ? 0 : startIndex + visibleMaterials.length
  const hasLoadedNextPage = currentPage < loadedPages
  const hasMoreFromServer = status === "CanLoadMore" || status === "LoadingMore"
  const canGoNext = loadedItems > 0 && (hasLoadedNextPage || hasMoreFromServer)
  const queryValue = draftQuery ?? initialQuery

  const navigateWithParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key)
        return
      }

      params.set(key, value)
    })

    const queryString = params.toString()

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const goToPage = (page: number) => {
    navigateWithParams({ page: String(page) })
  }

  const syncPageInUrl = useEffectEvent((page: number) => {
    goToPage(page)
  })

  const goToNextPage = () => {
    const nextPage = currentPage + 1

    if (nextPage <= loadedPages) {
      goToPage(nextPage)
      return
    }

    if (status === "CanLoadMore") {
      pendingPageRef.current = nextPage
      loadMore(pageSize)
    }
  }

  useEffect(() => {
    const pendingPage = pendingPageRef.current

    if (pendingPage === null) {
      return
    }

    const pendingStartIndex = (pendingPage - 1) * pageSize

    if (results.length > pendingStartIndex) {
      pendingPageRef.current = null
      syncPageInUrl(pendingPage)
      return
    }

    if (status === "Exhausted") {
      pendingPageRef.current = null
    }
  }, [pageSize, results.length, status])

  useEffect(() => {
    const requiredItems = currentPage * pageSize

    if (currentPage > 1 && results.length < requiredItems && status === "CanLoadMore" && pendingPageRef.current === null) {
      pendingPageRef.current = currentPage
      loadMore(pageSize)
      return
    }

    if (currentPage > loadedPages && status === "Exhausted" && loadedItems > 0) {
      syncPageInUrl(loadedPages)
    }
  }, [currentPage, loadedItems, loadedPages, pageSize, results.length, status, loadMore])

  return (
    <>
      <p className="mb-10 inline-flex items-center gap-2">
        <Star className="size-4" />
        <span>Recommended</span>
      </p>
      <div className="mb-10 flex flex-col gap-8">
        <div className="flex gap-4 justify-between">
          <form
            className="flex w-full items-center justify-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              navigateWithParams({
                q: queryValue.trim() || null,
                page: "1",
              })
            }}
          >
            <Input
              placeholder="Search for PDFs, notes, course codes, or uploaders"
              className="w-full max-w-md"
              value={queryValue}
              onChange={(event) => setDraftQuery(event.target.value)}
            />
            <Button type="submit" size="icon-sm" aria-label="Search materials">
              <Search className="size-4" />
            </Button>
          </form>

          <Button asChild type="button">
            <Link href="/upload">Upload</Link>
          </Button>
        </div>
        <div className="flex gap-3 sm:grid sm:grid-cols-2">
          <Select
            value={initialCategory || "all"}
            onValueChange={(value) => {
              navigateWithParams({
                category: value === "all" ? null : value,
                page: "1",
              })
            }}
          >
            <SelectTrigger className="w-full sm:flex-1">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={initialCourse || "all"}
            onValueChange={(value) => {
              navigateWithParams({
                course: value === "all" ? null : value,
                page: "1",
              })
            }}
          >
            <SelectTrigger className="w-full sm:flex-1">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {showingFrom}-{showingTo} of {status === "Exhausted" ? loadedItems : `${loadedItems}+`} materials
        </p>
      </div>

      <ul className="list-none flex flex-col gap-4 md:grid grid-cols-2">
        {visibleMaterials.map((material) => (
          <li key={material._id}>
            <MaterialCard material={material} />
          </li>
        ))}
      </ul>

      {!isLoading && visibleMaterials.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No matches found.</p>
      ) : null}

      {isLoading && loadedItems === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading materials...</p>
      ) : null}

      {loadedItems > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-2 justify-center mb-15">
          <Button
            type="button"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <span className="px-2 text-sm text-muted-foreground">Page {currentPage}</span>

          <Button
            type="button"
            variant="outline"
            disabled={!canGoNext || status === "LoadingMore"}
            onClick={goToNextPage}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>

          {status === "LoadingMore" ? (
            <span className="text-sm text-muted-foreground">Loading next page...</span>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
