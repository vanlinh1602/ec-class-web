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

export default function Classrooms() {
  const [classes, setClasses] = useState([
    { id: 1, name: 'English 101', students: 15 },
    { id: 2, name: 'Advanced Grammar', students: 12 },
    { id: 3, name: 'Business English', students: 8 },
  ]);

  const [newClassName, setNewClassName] = useState('');

  const addClass = () => {
    if (newClassName) {
      setClasses([
        ...classes,
        { id: classes.length + 1, name: newClassName, students: 0 },
      ]);
      setNewClassName('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classrooms</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Class Name
                </Label>
                <Input
                  id="name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addClass}>Add Class</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{cls.students} students</p>
              <Link href={`/classrooms/${cls.id}`}>
                <Button className="mt-2" variant="outline">
                  Manage Class
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
