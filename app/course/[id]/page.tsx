'use client';

import {
  BadgeInfo,
  Book,
  CircleDot,
  Clock,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { courseLevels, courseStatuses } from '@/lib/options';
import { format } from '@/utils/number';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { userhandling, role, user, updateInfo } = useUserStore(
    useShallow((state) => ({
      userhandling: state.handling,
      role: state.role,
      user: state.user,
      updateInfo: state.updateInfo,
    }))
  );

  const { handling, courses, syllabus, getCourse, getCourseSyllabus } =
    useCourseStore(
      useShallow((state) => ({
        handling: state.handling,
        courses: state.courses,
        syllabus: state.syllabus,
        getCourse: state.getCourse,
        getCourseSyllabus: state.getSyllabus,
      }))
    );

  const course = useMemo(() => courses[id], [courses, id]);
  const courseSyllabus = useMemo(() => syllabus[id], [syllabus, id]);

  useEffect(() => {
    if (!course) {
      getCourse(id);
    }
    if (!courseSyllabus) {
      getCourseSyllabus(id);
    }
  }, [id]);

  return (
    <div>
      {handling || userhandling ? <Waiting /> : null}
      <div className="mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{course?.name}</CardTitle>
            {/* <CardDescription>{course?.description}</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {courseLevels[course?.level || '']}
              </Badge>

              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course?.duration} weeks
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <BadgeInfo className="w-4 h-4" />
                Status: {courseStatuses[course?.status || '']}
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Course Description</h2>
              <p>{course?.description}</p>
            </div>
            <div>
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg mb-2 flex items-center ">
                  <Book className="h-5 w-5 mr-2" />
                  Course Syllabus
                </h3>
              </div>
              <div className="space-y-2 mt-2">
                {courseSyllabus ? (
                  courseSyllabus.styllabus.map((item, index) => (
                    <div className="flex justify-between">
                      <div key={index} className="flex items-center ml-4">
                        <CircleDot className="w-5 h-5 mr-2" />
                        <span>
                          Week {item.week}: {item.description}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No syllabus available.</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing
              </h3>
              <p className="font-semibold">
                Full Payment: ${format(course?.price)}
              </p>
            </div>
          </CardContent>

          {role === 'student' && !user?.courses?.includes(id) && (
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      const courseUpdate = user?.courses ?? [];
                      courseUpdate.push(id);
                      updateInfo({ courses: courseUpdate, id: user?.id });
                    }}
                  >
                    Enroll in Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register for {course?.name}</DialogTitle>
                    <DialogDescription>
                      Confirm your registration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    This actions will register you for the course. Please press
                    "Confirm" to continue.
                  </div>
                  <DialogFooter>
                    <Button variant="destructive" onClick={() => {}}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
