'use client';

import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Waiting from '@/components/Waiting';
import { useCourseStore } from '@/features/courses/hooks';
import { courseLevels } from '@/lib/options';

export default function Courses() {
  const { handling, courses, getCourses } = useCourseStore(
    useShallow((state) => ({
      handling: state.handling,
      courses: state.courses,
      getCourses: state.getCourses,
    }))
  );

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div>
      {handling && <Waiting />}
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(courses || {}).map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription className="h-10 text-ellipsis">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{course.duration} weeks</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>Level: {courseLevels[course.level]}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`course/${course.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
