"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Courses() {
  const courses = useQuery(api.materials.listCourses);

  if (!courses) return <div>Loading...</div>;

  return (
    <div>
      {courses.map((course) => (
        <div key={course._id}>
          {course.courseCode} ({course.count})
        </div>
      ))}
    </div>
  );
}