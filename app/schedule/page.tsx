'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Plus, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ScheduleSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    course: '',
    teacher: '',
    date: new Date(),
    time: '',
    duration: '',
  });

  const upcomingClasses = [
    {
      id: 1,
      title: 'Advanced English - Speaking Practice',
      course: 'Advanced English',
      teacher: 'John Doe',
      date: '2024-10-09',
      time: '10:00 AM',
      duration: '1 hour',
    },
    {
      id: 2,
      title: 'IELTS Writing Workshop',
      course: 'IELTS Preparation',
      teacher: 'Jane Smith',
      date: '2024-10-09',
      time: '2:00 PM',
      duration: '2 hours',
    },
    {
      id: 3,
      title: 'Business English - Negotiation Skills',
      course: 'Business English',
      teacher: 'Mike Johnson',
      date: '2024-10-10',
      time: '11:00 AM',
      duration: '1.5 hours',
    },
    {
      id: 4,
      title: 'Beginner English - Grammar Basics',
      course: 'Beginner English',
      teacher: 'Sarah Brown',
      date: '2024-10-11',
      time: '9:00 AM',
      duration: '1 hour',
    },
  ];

  const handleAddClass = () => {
    // Here you would typically add the new class to your data store
    console.log('New class added:', newClass);
    setIsAddClassOpen(false);
    setNewClass({
      title: '',
      course: '',
      teacher: '',
      date: new Date(),
      time: '',
      duration: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new class here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newClass.title}
                      onChange={(e) =>
                        setNewClass({ ...newClass, title: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="course" className="text-right">
                      Course
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewClass({ ...newClass, course: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advanced-english">
                          Advanced English
                        </SelectItem>
                        <SelectItem value="ielts-preparation">
                          IELTS Preparation
                        </SelectItem>
                        <SelectItem value="business-english">
                          Business English
                        </SelectItem>
                        <SelectItem value="beginner-english">
                          Beginner English
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Teacher
                    </Label>
                    <Input
                      id="teacher"
                      value={newClass.teacher}
                      onChange={(e) =>
                        setNewClass({ ...newClass, teacher: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <div className="col-span-3">
                      <Calendar
                        mode="single"
                        selected={newClass.date}
                        onSelect={(d) =>
                          d && setNewClass({ ...newClass, date: d })
                        }
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newClass.time}
                      onChange={(e) =>
                        setNewClass({ ...newClass, time: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={newClass.duration}
                      onChange={(e) =>
                        setNewClass({ ...newClass, duration: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddClass}>Add Class</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              numberOfMonths={2}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {class_.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {class_.course}
                    </p>
                    <div className="flex items-center pt-2">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {class_.teacher}
                      </span>
                    </div>
                    <div className="flex items-center pt-2">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(class_.date), 'PPP')} at {class_.time}{' '}
                        ({class_.duration})
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
