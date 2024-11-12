'use client';

import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Courses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'English 101',
      description: 'Introductory English course',
      capacity: 20,
      enrolled: 15,
    },
    {
      id: 2,
      name: 'Advanced Grammar',
      description: 'In-depth study of English grammar',
      capacity: 15,
      enrolled: 12,
    },
    {
      id: 3,
      name: 'Business English',
      description: 'English for professional settings',
      capacity: 18,
      enrolled: 8,
    },
    {
      id: 4,
      name: 'IELTS Preparation',
      description: 'Prepare for the IELTS exam',
      capacity: 25,
      enrolled: 20,
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const registerForCourse = () => {
    if (selectedCourse && studentName && studentEmail) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, enrolled: course.enrolled + 1 }
            : course
        )
      );
      setSelectedCourse(null);
      setStudentName('');
      setStudentEmail('');
      // In a real application, you would send this data to your backend
      console.log(
        `Registered ${studentName} (${studentEmail}) for ${selectedCourse.name}`
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>
                    {course.enrolled}/{course.capacity} students
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>{course.id * 4} lessons</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    disabled={course.enrolled >= course.capacity}
                  >
                    {course.enrolled >= course.capacity
                      ? 'Course Full'
                      : 'Register'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      Register for {selectedCourse?.name}
                    </DialogTitle>
                    <DialogDescription>
                      Enter your details to register for this course.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={registerForCourse}>Register</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Link href="/courses/id">
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
