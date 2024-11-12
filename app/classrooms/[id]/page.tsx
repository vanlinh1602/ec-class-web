'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function ClassDetails() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Grammar Exercise',
      dueDate: '2023-06-15',
      status: 'Active',
    },
    { id: 2, title: 'Essay Writing', dueDate: '2023-06-20', status: 'Active' },
  ]);

  const [students] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState('');

  const addAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      setAssignments([
        ...assignments,
        { id: assignments.length + 1, ...newAssignment, status: 'Active' },
      ]);
      setNewAssignment({ title: '', description: '', dueDate: '' });
    }
  };

  const submitAssignment = () => {
    if (selectedAssignment && submission) {
      setAssignments(
        assignments.map((a) =>
          a.id === selectedAssignment.id ? { ...a, status: 'Submitted' } : a
        )
      );
      setSelectedAssignment(null);
      setSubmission('');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">English 101</h1>
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Assignments</h2>
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
                  <p>Due Date: {assignment.dueDate}</p>
                  <p>Status: {assignment.status}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="mt-2"
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        {assignment.status === 'Submitted'
                          ? 'View Submission'
                          : 'Submit Assignment'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{assignment.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Textarea
                          placeholder="Type your answer here..."
                          value={submission}
                          onChange={(e) => setSubmission(e.target.value)}
                          disabled={assignment.status === 'Submitted'}
                        />
                      </div>
                      {assignment.status !== 'Submitted' && (
                        <Button onClick={submitAssignment}>Submit</Button>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="students">
          <h2 className="text-xl font-semibold mb-6">Students</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <Card key={student.id}>
                <CardContent className="flex items-center space-x-4 pt-6">
                  <Avatar>
                    <AvatarImage
                      src={'/placeholder.svg?height=40&width=40'}
                      alt={student.name}
                    />
                    <AvatarFallback>
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
