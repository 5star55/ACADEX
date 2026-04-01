import CourseSearch from "@/components/course-search"
import { getCourses } from "@/lib/getdata"

export default async function Page() {
  const courses= await getCourses()
  return (
    <div className='mt-10 mb-15 mx-10'>
      <CourseSearch courses={courses}/>
    </div>
  )
}
