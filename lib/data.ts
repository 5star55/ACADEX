import type { Id } from "@/convex/_generated/dataModel"


export type CourseMaterial = {
  _id: Id<"materials">,
  title: string
  category: string
  uploaderName: string
  courseCode: string
  date: string
  downloads: number
  upvotes: number
  fileId: string
}

type CourseSummary = {
  _id: Id<"courses">
  courseCode: string
  latestTitle: string
  count: number
}

export type CourseSearchProps = {
  courses: CourseSummary[]
}

export type CourseCardProps = {
  course: CourseSummary
}


// export const demoCourseMaterials: CourseMaterial[] = [
//   {
//     id: "MAT-001",
//     title: "Calculus I Lecture Notes",
//     category: "Lecture Notes",
//     uploaderName: "Amina Bello",
//     courseCode: "MTH101",
//     date: "2026-02-11",
//     downloads: 412,
//     upvotes: 138,
//   },
//   {
//     id: "MAT-002",
//     title: "Organic Chemistry Past Questions",
//     category: "Past Questions",
//     uploaderName: "David Okafor",
//     courseCode: "CHM201",
//     date: "2026-01-29",
//     downloads: 287,
//     upvotes: 96,
//   },
//   {
//     id: "MAT-003",
//     title: "Data Structures Cheat Sheet",
//     category: "Cheat Sheet",
//     uploaderName: "Zainab Yusuf",
//     courseCode: "CSC202",
//     date: "2026-02-04",
//     downloads: 531,
//     upvotes: 221,
//   },
//   {
//     id: "MAT-004",
//     title: "Microeconomics Summary Slides",
//     category: "Slides",
//     uploaderName: "Samuel Adeyemi",
//     courseCode: "ECO102",
//     date: "2026-02-18",
//     downloads: 199,
//     upvotes: 74,
//   },
//   {
//     id: "MAT-005",
//     title: "Physics Mechanics Formula Guide",
//     category: "Lecture Notes",
//     uploaderName: "Grace Nwosu",
//     courseCode: "PHY103",
//     date: "2026-03-01",
//     downloads: 355,
//     upvotes: 129,
//   },
//   {
//     id: "MAT-006",
//     title: "Research Methods Past questions",
//     category: "Past questions",
//     uploaderName: "Ibrahim Sani",
//     courseCode: "GST301",
//     date: "2026-02-23",
//     downloads: 164,
//     upvotes: 58,
//   },
// ]

