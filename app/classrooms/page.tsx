'use client';

import {
  Book,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Waiting from '@/components/Waiting';
import { ClassroomEditor } from '@/features/classroom/components';
import { useClassroomStore } from '@/features/classroom/hooks';
import { Classroom } from '@/features/classroom/types';
import { useCourseStore } from '@/features/courses/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { classStatuses } from '@/lib/options';

export default function ClassSection() {
  const {
    handling,
    classes,
    getClasses,
    createClass,
    updateClass,
    deleteClass,
  } = useClassroomStore(
    useShallow((state) => ({
      handling: state.handling,
      classes: state.classes,
      getClasses: state.getClasses,
      createClass: state.createClass,
      updateClass: state.updateClass,
      deleteClass: state.deleteClass,
    }))
  );

  const { courses, getCourses } = useCourseStore(
    useShallow((state) => ({
      courses: state.courses,
      getCourses: state.getCourses,
    }))
  );

  const { teachers, getTeachers } = useTeacherStore(
    useShallow((state) => ({
      teachers: state.teachers,
      getTeachers: state.getTeachers,
    }))
  );

  useEffect(() => {
    if (!Object.keys(courses).length) {
      getCourses();
    }
    if (!Object.keys(classes).length) {
      getClasses();
    }
    if (!Object.keys(teachers).length) {
      getTeachers();
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = Object.values(classes).filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [classEditor, setClassEditor] = useState<Partial<Classroom>>();

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      {classEditor ? (
        <ClassroomEditor
          classroom={classEditor}
          onCancel={() => setClassEditor(undefined)}
          onSave={(classroomUpdate, id) => {
            if (id) {
              updateClass(id, classroomUpdate);
            } else {
              createClass(classroomUpdate);
            }
            setClassEditor(undefined);
          }}
        />
      ) : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Classes</CardTitle>
          <Button onClick={() => setClassEditor({})}>
            <Plus className="mr-2 h-4 w-4" />
            Create class
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                      {courses[cls.course]?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${
                            teachers[cls.teachers?.[0]]?.name
                          }`}
                        />
                        <AvatarFallback>
                          {teachers[cls.teachers?.[0]]?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {teachers[cls.teachers?.[0]]?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {moment(cls.schedule.start).format('DD/MM/YYYY')}
                      {' - '}
                      {moment(cls.schedule.end).format('DD/MM/YYYY')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {cls.students?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cls.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {classStatuses[cls.status]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/classrooms/${cls.id}`}>View class</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setClassEditor(cls)}>
                          Edit class
                        </DropdownMenuItem>
                        <DropdownMenuItem>Manage students</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteClass(cls.id)}
                        >
                          Delete class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
