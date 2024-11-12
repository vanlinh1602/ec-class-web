'use client';

import _ from 'lodash';
import { Book, Info, Pencil, Users } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Waiting from '@/components/Waiting';
import { ClassroomEditor } from '@/features/classroom/components';
import { useClassroomStore } from '@/features/classroom/hooks';
import { useCourseStore } from '@/features/courses/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { classDays, classStatuses } from '@/lib/options';

export default function ClassroomInfo() {
  const { id } = useParams<{ id: string }>();
  const { classes, getClass, classHandling, updateClass } = useClassroomStore(
    useShallow((state) => ({
      classHandling: state.handling,
      classes: state.classes,
      getClass: state.getClass,
      updateClass: state.updateClass,
    }))
  );
  const { courses, getCourse, courseHandling, allSyllabus, getSyllabus } =
    useCourseStore(
      useShallow((state) => ({
        courseHandling: state.handling,
        courses: state.courses,
        allSyllabus: state.syllabus,
        getCourse: state.getCourse,
        getSyllabus: state.getSyllabus,
      }))
    );

  const { teachers, getTeachers } = useTeacherStore(
    useShallow((state) => ({
      teachers: state.teachers,
      getTeachers: state.getTeachers,
    }))
  );

  const classroom = useMemo(() => classes[id as string], [classes, id]);
  const course = useMemo(
    () => courses[classroom?.course],
    [courses, classroom]
  );
  const courseSyllabus = useMemo(
    () => allSyllabus[course?.id as string],
    [allSyllabus, course]
  );

  const progress = useMemo(() => {
    if (!classroom || !courseSyllabus) return 0;
    const completed = Object.values(classroom.completedSyallbus || {}).filter(
      (v) => !!v
    ).length;
    const total = courseSyllabus.styllabus.length;
    return (completed / total) * 100;
  }, [classroom, courseSyllabus]);

  useEffect(() => {
    if (!classroom) {
      getClass(id);
    }
    if (!course && classroom) {
      getCourse(classroom?.course);
    }
    if (!courseSyllabus && course) {
      getSyllabus(course.id);
    }
    if (!Object.keys(teachers).length) {
      getTeachers();
    }
  }, [id, classes, courses, teachers]);

  const [editClassInfo, setEditClassInfo] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {classHandling || courseHandling ? <Waiting /> : null}
      {editClassInfo ? (
        <ClassroomEditor
          classroom={classroom}
          onSave={(dataUpdate) => {
            updateClass(id, dataUpdate);
            setEditClassInfo(false);
          }}
          onCancel={() => setEditClassInfo(false)}
        />
      ) : null}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{classroom?.name}</CardTitle>
              <CardDescription className="text-lg mt-2">
                <Link href={`/courses/${course?.id}`}>
                  <Button variant="link" className="p-0 text-xl">
                    Course: {course?.name || 'N/A'}
                  </Button>
                </Link>
              </CardDescription>
            </div>
            <Button
              className="flex items-center"
              onClick={() => setEditClassInfo(true)}
            >
              <Pencil className="w-5 h-5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Capacity: {classroom?.students?.length || 0} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {classStatuses[classroom?.status]}
              </Badge>
            </div>
          </div>

          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold">Room:</span>
                <span className="ml-2">{classroom?.room || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">Schedule:</span>
                <span className="ml-2">
                  {classroom?.schedule?.daysInWeek
                    ?.map((v) => classDays[v])
                    .join(', ') || 'N/A'}
                  {': '}
                  <strong>
                    {classroom?.schedule?.hoursInDay?.start || 'N/A'}
                  </strong>
                  {' - '}
                  <strong>
                    {classroom?.schedule?.hoursInDay?.end || 'N/A'}
                  </strong>
                  {'. From '}
                  {moment(classroom?.schedule?.start).format(
                    'DD/MM/YYYY'
                  )} to {moment(classroom?.schedule?.end).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">Teachers:</span>
                <span className="ml-2">
                  {classroom?.teachers
                    ?.map((teacher) => teachers[teacher]?.name)
                    .join(', ')}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Course Syllabus
            </h3>
            <div className="space-y-2">
              {_.sortBy(courseSyllabus?.styllabus, 'week').map(
                (item, index) => (
                  <div className="flex justify-between">
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                          classroom?.completedSyallbus?.[item.id]
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {classroom?.completedSyallbus?.[item.id] && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span
                        className={
                          classroom?.completedSyallbus?.[item.id]
                            ? 'line-through text-muted-foreground'
                            : ''
                        }
                      >
                        Week {item.week}: {item.description}
                      </span>
                    </div>
                    <Button
                      className="text-sm"
                      variant="secondary"
                      onClick={() => {
                        updateClass(id, {
                          completedSyallbus: {
                            ...classroom?.completedSyallbus,
                            [item.id]: !classroom?.completedSyallbus?.[item.id],
                          },
                        });
                      }}
                    >
                      {classroom?.completedSyallbus?.[item.id]
                        ? 'Undo'
                        : 'Complete'}
                    </Button>
                  </div>
                )
              )}
            </div>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {progress.toFixed(0)}% Complete
              </p>
            </div>
          </div>

          <Separator />
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button className="">Add Student</Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  Enrolled: {classroom?.students?.length || 0}/
                  {classroom?.maxStudents || 0}
                </span>
              </div>
              <Progress
                value={
                  ((classroom?.students?.length || 0) /
                    (classroom?.maxStudents || 1)) *
                  100
                }
                className="w-1/2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
