'use client';

import { Mail, MoreHorizontal, Phone, Plus, Search } from 'lucide-react';
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
import { TeacherEditor } from '@/features/teachers/components';
import { useTeacherStore } from '@/features/teachers/hooks';
import { Teacher } from '@/features/teachers/types';

export default function TeacherSection() {
  const {
    handling,
    teachers,
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeacherStore(
    useShallow((state) => ({
      handling: state.handling,
      teachers: state.teachers,
      getTeachers: state.getTeachers,
      createTeacher: state.createTeacher,
      updateTeacher: state.updateTeacher,
      deleteTeacher: state.deleteTeacher,
    }))
  );

  useEffect(() => {
    if (!Object.keys(teachers).length) {
      getTeachers();
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = Object.values(teachers).filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [teacherEditor, setTeacherEditor] = useState<Partial<Teacher>>();

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      {teacherEditor ? (
        <TeacherEditor
          teacher={teacherEditor}
          onCancel={() => setTeacherEditor(undefined)}
          onSave={(teacher) => {
            if (teacherEditor.id) {
              updateTeacher(teacherEditor.id, teacher);
            } else {
              createTeacher(teacher);
            }
            setTeacherEditor(undefined);
          }}
        />
      ) : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Teachers</CardTitle>
          <Button onClick={() => setTeacherEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${teacher.name}`}
                        />
                        <AvatarFallback>
                          {teacher.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {teacher.gender.toLocaleUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.phone}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      {/* <Star className="mr-2 h-4 w-4 text-yellow-400" /> */}
                      {teacher.address}
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
                          <Link href={`/teachers/${teacher.id}`}>
                            View teacher
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTeacherEditor(teacher)}
                        >
                          Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Assign courses</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteTeacher(teacher.id)}
                        >
                          Remove teacher
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
