'use client';

import {
  Book,
  BookUser,
  Cake,
  Calendar,
  DollarSign,
  Mail,
  Phone,
} from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useClassroomStore } from '@/features/classroom/hooks';
import { useCourseStore } from '@/features/courses/hooks';
import { useStudentStore } from '@/features/students/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { classDays } from '@/lib/options';

export default function StudentInfo() {
  const { id } = useParams<{ id: string }>();
  const { students, getStudent } = useStudentStore(
    useShallow((state) => ({
      students: state.students,
      getStudent: state.getStudent,
    }))
  );

  const { courses, getCourses } = useCourseStore(
    useShallow((state) => ({
      courses: state.courses,
      getCourses: state.getCourses,
    }))
  );

  const { classes, getClasses } = useClassroomStore(
    useShallow((state) => ({
      classes: state.classes,
      getClasses: state.getClasses,
    }))
  );

  const { teachers, getTeachers } = useTeacherStore(
    useShallow((state) => ({
      teachers: state.teachers,
      getTeachers: state.getTeachers,
    }))
  );

  const student = useMemo(() => students[id], [students, id]);

  const studentCourses = useMemo(
    () => student?.courses?.map((courseId) => courses[courseId]),
    [student, courses]
  );

  const studentClasses = useMemo(
    () => student?.classes?.map((classId) => classes[classId]),
    [student, classes]
  );

  const totalAmountPaid = useMemo(() => {
    if (!Object.keys(studentCourses || {}).length) return 0;
    return studentCourses?.reduce((acc, course) => acc + course.price, 0);
  }, [studentCourses]);

  useEffect(() => {
    if (!student) {
      getStudent(id);
    }
    if (!Object.keys(courses).length) {
      getCourses();
    }
    if (!Object.keys(classes).length) {
      getClasses();
    }
    if (!Object.keys(teachers).length) {
      getTeachers();
    }
  }, [student, studentCourses, studentClasses]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={
                student?.avatar ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${student?.name}`
              }
              alt={student?.name}
            />
            <AvatarFallback>
              {student?.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{student?.name}</CardTitle>
            <CardDescription>Student ID: {student?.id}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{student?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{student?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <span>{moment(student?.birthdate).format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookUser className="h-4 w-4 text-muted-foreground" />
              <span>{student?.address}</span>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Registered Courses
            </h3>
            <div className="grid gap-4">
              {studentCourses ? (
                studentCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {course.name}
                          </CardTitle>
                          <CardDescription>
                            Level: {course.level}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Complete</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <div>No courses found</div>
              )}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Registered Classes
            </h3>
            <div className="grid gap-4">
              {studentClasses ? (
                studentClasses.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">{cls.name}</CardTitle>
                      <CardDescription>
                        <div>
                          <span className="ml-2">
                            {cls?.schedule?.daysInWeek
                              ?.map((v) => classDays[v])
                              .join(', ') || 'N/A'}
                            {': '}
                            <strong>
                              {cls?.schedule?.hoursInDay?.start || 'N/A'}
                            </strong>
                            {' - '}
                            <strong>
                              {cls?.schedule?.hoursInDay?.end || 'N/A'}
                            </strong>
                            {'. From '}
                            {moment(cls?.schedule?.start).format(
                              'DD/MM/YYYY'
                            )}{' '}
                            to {moment(cls?.schedule?.end).format('DD/MM/YYYY')}
                          </span>
                        </div>
                        <div>
                          Teacher:{' '}
                          {cls.teachers
                            .map((v) => teachers[v]?.name)
                            .join(', ')}
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <div>No classes found</div>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">Total Amount Paid</span>
            </div>
            <span className="text-2xl font-bold">${totalAmountPaid}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
