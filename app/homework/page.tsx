'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea';

export default function HomeworkTeacher() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Grammar Exercise',
      class: 'English 101',
      dueDate: '2023-06-15',
    },
    {
      id: 2,
      title: 'Essay Writing',
      class: 'Advanced Grammar',
      dueDate: '2023-06-20',
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class: '',
    description: '',
    dueDate: '',
  });

  const addAssignment = () => {
    if (newAssignment.title && newAssignment.class) {
      setAssignments([
        ...assignments,
        { id: assignments.length + 1, ...newAssignment },
      ]);
      setNewAssignment({ title: '', class: '', description: '', dueDate: '' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Homework Assignments</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Assignment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewAssignment({ ...newAssignment, class: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English 101">English 101</SelectItem>
                    <SelectItem value="Advanced Grammar">
                      Advanced Grammar
                    </SelectItem>
                    <SelectItem value="Business English">
                      Business English
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addAssignment}>Create Assignment</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Class: {assignment.class}</p>
              <p>Due Date: {assignment.dueDate}</p>
              <Link href={`/homework/${assignment.id}`}>
                <Button className="mt-2" variant="outline">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
