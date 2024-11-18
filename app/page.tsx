'use client';

import { CalendarIcon, Clock, Users } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClassroomStore } from '@/features/classroom/hooks';
import { useCourseStore } from '@/features/courses/hooks';
import { useStudentStore } from '@/features/students/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { useUserStore } from '@/features/user/hooks';

export default function Home() {
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

  const { getStudents } = useStudentStore(
    useShallow((state) => ({
      students: state.students,
      getStudents: state.getStudents,
    }))
  );

  const { role, user } = useUserStore(
    useShallow((state) => ({
      role: state.role,
      user: state.user,
    }))
  );

  useEffect(() => {
    getCourses();
    getClasses();
    getTeachers();
    getStudents();
  }, []);

  // const stats = useMemo(() => {
  //   return [
  //     {
  //       title: 'Total Students',
  //       value: Object.keys(students || {}).length,
  //       icon: Users,
  //     },
  //     {
  //       title: 'Active Courses',
  //       value: Object.values(courses || {}).filter((c) => c.status === 'active')
  //         .length,
  //       icon: BookOpen,
  //     },
  //     {
  //       title: 'Teachers',
  //       value: Object.keys(teachers || {}).length,
  //       icon: Users,
  //     },
  //     {
  //       title: 'All Classes',
  //       value: Object.keys(classes).length,
  //       icon: CalendarIcon,
  //     },
  //   ];
  // }, [courses, classes, teachers, students]);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcomingClasses = useMemo(() => {
    const dateMoment = moment(date?.valueOf());
    const filteredClasses = Object.values(classes || {}).filter((cls) => {
      if (
        (cls?.schedule?.start || 0) > dateMoment.valueOf() &&
        (cls?.schedule?.end || 0) < dateMoment.valueOf()
      ) {
        return false;
      }
      if (
        !cls.schedule.daysInWeek?.includes(
          dateMoment.format('dddd').toLocaleLowerCase()
        )
      ) {
        return false;
      }
      if (role === 'teacher' && !cls.teachers.includes(user!.id)) {
        return false;
      }
      if (role === 'student' && !cls.students?.includes(user!.id)) {
        return false;
      }
      return true;
    });
    return filteredClasses;
  }, [classes, date]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4">
                    <p className="text-sm font-medium leading-none">
                      {cls.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {courses[cls.course]?.name}
                    </p>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {cls.teachers.map((t) => teachers[t]?.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {cls.schedule.hoursInDay?.start} to{' '}
                        {cls.schedule.hoursInDay?.end}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
