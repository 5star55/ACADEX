import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {CourseCardProps} from '@/lib/data';




export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{course.courseCode}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full justify-between text-left">
          <Link href={`/courses/${course.courseCode}`}>
            <span className="font-semibold">{course.courseCode}</span>
            <span className="truncate">
              Latest: {course.latestTitle}
            </span>
            <span className="text-sm text-muted-foreground">
              {course.count} material{course.count === 1 ? "" : "s"}
            </span>
          </Link>
        </Button>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Browse all materials for this course.
      </CardFooter>
    </Card>
  )
}
