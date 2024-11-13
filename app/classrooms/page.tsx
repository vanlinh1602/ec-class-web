'use client';

import moment from 'moment';
import Link from 'next/link';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Waiting from '@/components/Waiting';
import { useClassroomStore } from '@/features/classroom/hooks';
import { useCourseStore } from '@/features/courses/hooks';

export default function Classrooms() {
  const { handling, classes, getClasses } = useClassroomStore(
    useShallow((state) => ({
      handling: state.handling,
      classes: state.classes,
      getClasses: state.getClasses,
    }))
  );
  const { courses, getCourses } = useCourseStore(
    useShallow((state) => ({
      courses: state.courses,
      getCourses: state.getCourses,
    }))
  );

  useEffect(() => {
    getClasses();
    getCourses();
  }, []);

  return (
    <div>
      {handling && <Waiting />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classrooms</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(classes || {}).map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Course: <strong>{courses[cls.course]?.name}</strong>
              </p>
              <p>
                Date:{' '}
                <strong>
                  {moment(cls.schedule.start).format('DD/MM/YYYY')} -{' '}
                  {moment(cls.schedule.end).format('DD/MM/YYYY')}
                </strong>
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/classrooms/${cls.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
