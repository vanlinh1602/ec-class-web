'use client';

import {
  Book,
  Clock,
  DollarSign,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Badge } from '@/components/ui/badge';
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
import { CourseEditor } from '@/features/courses/components';
import { useCourseStore } from '@/features/courses/hooks';
import { Courses } from '@/features/courses/types';
import { courseLevels, courseStatuses } from '@/lib/options';
import { format } from '@/utils/number';

export default function CoursesSection() {
  const {
    courses,
    getCourses,
    createCourse,
    updateCourse,
    handing,
    deleteCourse,
  } = useCourseStore(
    useShallow((state) => ({
      handing: state.handling,
      courses: state.courses,
      getCourses: state.getCourses,
      createCourse: state.createCourse,
      updateCourse: state.updateCourse,
      deleteCourse: state.deleteCourse,
    }))
  );

  useEffect(() => {
    if (!Object.keys(courses).length) getCourses();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = Object.values(courses).filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [editCourse, setEditCourse] = useState<Partial<Courses>>();

  return (
    <div className="container mx-auto px-4 py-8">
      {handing ? <Waiting /> : null}
      {editCourse ? (
        <CourseEditor
          course={editCourse}
          onCancel={() => setEditCourse(undefined)}
          onSave={(courseUpdate, id) => {
            if (id) {
              updateCourse(id, courseUpdate);
            } else {
              createCourse(courseUpdate);
            }
            setEditCourse(undefined);
          }}
        />
      ) : null}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Courses</CardTitle>
          <Button onClick={() => setEditCourse({})}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                      {course.name}
                    </div>
                  </TableCell>
                  <TableCell>{courseLevels[course.level]}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {course.duration} weeks
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(course.price || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === 'active'
                          ? 'default'
                          : course.status === 'upcoming'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {courseStatuses[course.status]}
                    </Badge>
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
                          <Link href={`/courses/${course.id}`}>
                            View course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditCourse(course)}>
                          Edit course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteCourse(course.id)}
                        >
                          Delete course
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
