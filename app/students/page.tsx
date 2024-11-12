'use client';

import { MoreHorizontal, Plus, Search } from 'lucide-react';
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
import { StudentEditor } from '@/features/students/components';
import { useStudentStore } from '@/features/students/hooks';
import { Student } from '@/features/students/types';

export default function StudentSection() {
  const {
    handling,
    students,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudentStore(
    useShallow((state) => ({
      handling: state.handling,
      students: state.students,
      getStudents: state.getStudents,
      createStudent: state.createStudent,
      updateStudent: state.updateStudent,
      deleteStudent: state.deleteStudent,
    }))
  );

  useEffect(() => {
    if (!Object.keys(students).length) {
      getStudents();
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = Object.values(students).filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [studentEditor, setStudentEditor] = useState<Partial<Student>>();

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      {studentEditor ? (
        <StudentEditor
          student={studentEditor}
          onCancel={() => setStudentEditor(undefined)}
          onSave={(student, id) => {
            if (id) {
              updateStudent(id, student);
            } else {
              createStudent(student);
            }
            setStudentEditor(undefined);
          }}
        />
      ) : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Students</CardTitle>
          <Button onClick={() => setStudentEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
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
                <TableHead>Address</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.name}`}
                        />
                        <AvatarFallback>
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {student.name}
                    </div>
                  </TableCell>
                  <TableCell>{student.gender.toUpperCase()}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {student.address}
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
                          <Link href={`/students/${student.id}`}>
                            View student
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStudentEditor(student)}
                        >
                          Edit student
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete student
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
