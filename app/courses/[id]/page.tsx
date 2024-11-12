'use client';

import { Calendar, Clock, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Instructor {
  id: number;
  name: string;
  title: string;
  avatar: string;
}

interface CourseDetails {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  instructor: Instructor;
  startDate: string;
  duration: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  level: string;
  topics: string[];
}

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<CourseDetails | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the course data from an API
    // For this example, we'll use mock data
    const mockCourse: CourseDetails = {
      id: 1,
      name: 'English 101',
      description: 'Introductory English course',
      longDescription:
        'This comprehensive course is designed for beginners who want to build a strong foundation in English. Covering grammar, vocabulary, and basic conversation skills, English 101 will help you gain confidence in your ability to communicate in English.',
      instructor: {
        id: 1,
        name: 'Dr. Jane Smith',
        title: 'Senior English Instructor',
        avatar: '/placeholder.svg?height=80&width=80',
      },
      startDate: '2023-09-01',
      duration: '12 weeks',
      schedule: 'Mon, Wed, Fri 10:00 AM - 12:00 PM',
      capacity: 20,
      enrolled: 15,
      level: 'Beginner',
      topics: [
        'Basic Grammar',
        'Vocabulary Building',
        'Pronunciation',
        'Simple Conversations',
        'Reading Comprehension',
      ],
    };

    setCourse(mockCourse);
  }, []);

  if (!course) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {course.level}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Starts {course.startDate}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrolled}/{course.capacity} enrolled
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Course Description</h2>
              <p>{course.longDescription}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Schedule</h2>
              <p>{course.schedule}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Topics Covered</h2>
              <ul className="list-disc list-inside">
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Instructor</h2>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                  />
                  <AvatarFallback>
                    {course.instructor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor.title}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">
              Enroll in Course
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
