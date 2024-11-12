'use client';

import { cloneDeep, set } from 'lodash';
import {
  Book,
  BookUser,
  Cake,
  Calendar,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Waiting from '@/components/Waiting';
import { useClassroomStore } from '@/features/classroom/hooks';
import { QualificationsEditor } from '@/features/teachers/components';
import { useTeacherStore } from '@/features/teachers/hooks';
import { classDays } from '@/lib/options';

export default function TeacherInfo() {
  const { id } = useParams<{ id: string }>();

  const { handling, teachers, getTeachers, updateTeacher } = useTeacherStore(
    useShallow((state) => ({
      handling: state.handling,
      teachers: state.teachers,
      getTeachers: state.getTeachers,
      updateTeacher: state.updateTeacher,
    }))
  );

  const { classrooms, getClassrooms } = useClassroomStore(
    useShallow((state) => ({
      classrooms: state.classes,
      getClassrooms: state.getClasses,
    }))
  );

  const teacher = useMemo(() => teachers[id], [teachers, id]);
  const teacherClasses = useMemo(
    () =>
      Object.values(classrooms ?? {}).filter((cls) =>
        cls.teachers.includes(id)
      ),
    [classrooms, id]
  );
  useEffect(() => {
    if (!teacher) {
      getTeachers();
    }
    if (!Object.keys(classrooms).length) {
      getClassrooms();
    }
  }, [teacher, classrooms]);

  const [editQualifications, setEditQualifications] = useState<number>();

  return (
    <div className="container mx-auto p-4 space-y-6">
      {handling ? <Waiting /> : null}
      {editQualifications !== undefined ? (
        <QualificationsEditor
          initialData={teacher?.qualifications?.[editQualifications]}
          onSave={(data) => {
            const newQualifications = cloneDeep(teacher?.qualifications || []);
            if (editQualifications === -1) {
              newQualifications.push(data);
            } else {
              set(newQualifications, [editQualifications], data);
            }
            updateTeacher(id, { qualifications: newQualifications });
            setEditQualifications(undefined);
          }}
          onCancel={() => setEditQualifications(undefined)}
        />
      ) : null}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={
                    teacher?.avatar ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${teacher?.name}`
                  }
                  alt={teacher?.name}
                />
                <AvatarFallback>
                  {teacher?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{teacher?.name}</CardTitle>
                <CardDescription className="text-lg">
                  Teacher ID: {teacher?.id}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{teacher?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{teacher?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <span>{moment(teacher?.birthdate).format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookUser className="h-4 w-4 text-muted-foreground" />
              <span>{teacher?.address}</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Qualifications & Specializations
              </h3>
              <Button onClick={() => setEditQualifications(-1)}>
                Add Qualification
              </Button>
            </div>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {teacher?.qualifications?.map((qual, index) => (
                <div className="flex justify-between">
                  <span className="font-semibold">- {qual}</span>
                  <div className="flex space-x-2">
                    <Pencil
                      className="w-5 h-5"
                      onClick={() => setEditQualifications(index)}
                    />
                    <Trash2
                      className="w-5 h-5 text-destructive"
                      onClick={() => {
                        const newQualifications = cloneDeep(
                          teacher?.qualifications || []
                        );
                        newQualifications.splice(index, 1);
                        updateTeacher(id, {
                          qualifications: newQualifications,
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Courses Taught
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherClasses?.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.room}</TableCell>
                    <TableCell>{cls.students?.length} students</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Teaching Schedule
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Days In Week</TableHead>
                  <TableHead>Time Slots</TableHead>
                  <TableHead>Schedule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherClasses?.map((cls, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {cls.schedule.daysInWeek
                        ?.map((v) => classDays[v])
                        .join(', ') || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {cls.schedule?.hoursInDay?.start}
                      {' - '}
                      {cls.schedule?.hoursInDay?.end}
                    </TableCell>
                    <TableCell>
                      {moment(cls.schedule.start).format('DD/MM/YYYY')}
                      {' - '}
                      {moment(cls.schedule.end).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />
        </CardContent>
      </Card>
    </div>
  );
}
