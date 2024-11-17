'use client';

import { Calendar } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClassroomStore } from '@/features/classroom/hooks';
import { useStudentStore } from '@/features/students/hooks';
import { PATH_UPLOADS } from '@/lib/config';

export default function AssignmentSubmissions() {
  const { id } = useParams<{ id: string }>();
  const [assignmentId, classId] = id.split('-');
  const {
    classes,
    assignments,
    submissions,
    getClasses,
    getAssignments,
    getSubmissions,
  } = useClassroomStore(
    useShallow((state) => ({
      classes: state.classes,
      assignments: state.assignments,
      submissions: state.submissions,
      getClasses: state.getClasses,
      getAssignments: state.getAssignments,
      getSubmissions: state.getSubmissions,
    }))
  );

  const { students, getStudents } = useStudentStore(
    useShallow((state) => ({
      students: state.students,
      getStudents: state.getStudents,
    }))
  );

  const classroom = useMemo(() => classes[classId], [classes, classId]);

  const assignment = useMemo(
    () => assignments?.[classId]?.find((assign) => assign.id === assignmentId),
    [assignments, classId]
  );

  const classSubmissions = useMemo(
    () => submissions[assignmentId] || [],
    [submissions, assignmentId]
  );

  useEffect(() => {
    if (!classes[classId]) {
      getClasses();
    }
    if (!assignments[classId]) {
      getAssignments(classId);
    }
    if (!submissions[assignmentId]) {
      getSubmissions(assignmentId);
    }

    if (!students.length) {
      getStudents();
    }
  }, []);

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignment Submissions</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{assignment?.title}</CardTitle>
            <CardDescription>
              <div>{classroom?.name}</div>
              <div>{assignment?.description}</div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Due: {moment(assignment?.dueDate).format('DD/MM/YYYY')}
                  </span>
                </div>
                <div>
                  <Badge>{classSubmissions.length} submissions</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              All student submissions for this assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div> */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classroom?.students?.map((studentId) => {
                  const student = students[studentId];
                  const studentSumit = classSubmissions.find(
                    (submission) => submission.studentId === studentId
                  );
                  return (
                    <TableRow key={studentId}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {(student?.name || '')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {moment(studentSumit?.updatedAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={studentSumit ? 'secondary' : 'destructive'}
                        >
                          {studentSumit ? 'Submitted' : 'Not Submitted'}
                        </Badge>
                      </TableCell>
                      <TableCell>{studentSumit?.submission || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `${PATH_UPLOADS}/${studentSumit?.path}`,
                              '_blank'
                            )
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
