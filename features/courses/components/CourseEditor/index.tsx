import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from '@/hooks/use-toast';
import { courseLevels, courseStatuses } from '@/lib/options';

import { Courses } from '../../types';

type Props = {
  course?: Partial<Courses>;
  onCancel: () => void;
  onSave: (course: Omit<Courses, 'id'>, id?: string) => void;
};

const CourseEditor = ({ course, onCancel, onSave }: Props) => {
  const [edit, setEdit] = useState<Partial<Courses>>(course || {});

  const handleAddCourse = () => {
    if (!edit?.name || !edit?.level || !edit?.duration) {
      toast({
        title: 'Error',
        description: 'Name, level, and duration are required',
        variant: 'destructive',
      });
      return;
    }
    const courseUpdate = {
      name: edit.name,
      level: edit.level,
      duration: edit.duration,
      price: edit.price || 0,
      status: edit.status || 'active',
      description: edit.description || '',
    };
    onSave(courseUpdate, course?.id);
  };
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {course?.id ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the course here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              value={edit?.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
              <span className="text-red-600">*</span>
            </Label>
            <Select
              value={edit?.level}
              onValueChange={(v) => setEdit((pre) => ({ ...pre, level: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(courseLevels).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="duration"
              value={edit?.duration}
              onChange={(e) => {
                if (Number.isNaN(e.target.value)) {
                  toast({
                    title: 'Error',
                    description: 'Duration must be a number',
                    variant: 'destructive',
                  });
                  return;
                }
                setEdit({
                  ...edit,
                  duration: parseInt(e.target.value),
                });
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Price
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="price"
              value={edit?.price}
              onChange={(e) => {
                if (Number.isNaN(Number(e.target.value))) {
                  toast({
                    title: 'Error',
                    description: 'Price must be a number',
                    variant: 'destructive',
                  });
                  return;
                }
                setEdit({
                  ...edit,
                  price: parseInt(e.target.value),
                });
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Status
            </Label>
            <Select
              value={edit?.status}
              onValueChange={(v) => setEdit((pre) => ({ ...pre, status: v }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(courseStatuses).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={edit?.description}
              onChange={(e) => {
                setEdit({
                  ...edit,
                  description: e.target.value,
                });
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddCourse}>
            {course?.id ? 'Save Changes' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditor;
