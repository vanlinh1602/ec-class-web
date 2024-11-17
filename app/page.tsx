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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Waiting from '@/components/Waiting';
import { useCourseStore } from '@/features/courses/hooks';
import { useUserStore } from '@/features/user/hooks';
import { courseLevels } from '@/lib/options';

export default function Courses() {
  const { handling, courses, getCourses } = useCourseStore(
    useShallow((state) => ({
      handling: state.handling,
      courses: state.courses,
      getCourses: state.getCourses,
    }))
  );

  const { role } = useUserStore(
    useShallow((state) => ({
      role: state.role,
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
              {role === 'student' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {}}>Register</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Register for {course?.name}</DialogTitle>
                      <DialogDescription>
                        Confirm your registration
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      This actions will register you for the course. Please
                      press "Confirm" to continue.
                    </div>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => {}}>
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
