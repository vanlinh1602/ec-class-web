import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import MultipleSelector from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCourseStore } from '@/features/courses/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { toast } from '@/hooks/use-toast';
import { classDays, classStatuses } from '@/lib/options';
import { cn } from '@/lib/utils';

import { Classroom } from '../../types';

type Props = {
  classroom?: Partial<Classroom>;
  onCancel: () => void;
  onSave: (classroom: Omit<Classroom, 'id'>, id?: string) => void;
};

const ClassroomEditor = ({ classroom, onCancel, onSave }: Props) => {
  const { courses } = useCourseStore(
    useShallow((state) => ({
      courses: state.courses,
    }))
  );
  const { teachers } = useTeacherStore(
    useShallow((state) => ({
      teachers: state.teachers,
    }))
  );

  const [edit, setEdit] = useState<Partial<Classroom>>(classroom || {});
  const [date, setDate] = useState<DateRange | undefined>({
    from: classroom?.schedule?.start
      ? new Date(classroom.schedule.start)
      : new Date(),
    to: classroom?.schedule?.end ? new Date(classroom.schedule.end) : undefined,
  });

  const handleSave = () => {
    if (
      ['name', 'course', 'teachers', 'room', 'maxStudents', 'status'].some(
        (key) => !edit[key as keyof Classroom]
      )
    ) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    const classUpdate: Omit<Classroom, 'id'> = {
      name: edit.name!,
      course: edit.course!,
      room: edit.room || '',
      teachers: edit.teachers || [],
      status: edit.status || 'active',
      maxStudents: edit.maxStudents || 0,
      schedule: {
        daysInWeek: edit.schedule?.daysInWeek || [],
        hoursInDay: {
          start: edit.schedule?.hoursInDay?.start || '00:00',
          end: edit.schedule?.hoursInDay?.end || '00:00',
        },
        start: date?.from?.getTime() || Date.now(),
        end: date?.to?.getTime() || Date.now(),
      },
    };
    onSave(classUpdate, classroom?.id);
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
            {classroom?.id ? 'Edit Class' : 'Add New Class'}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the class here.
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
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course
              <span className="text-red-600">*</span>
            </Label>
            <Select
              value={edit.course}
              onValueChange={(value) => setEdit({ ...edit, course: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(courses).map(([id, course]) => (
                  <SelectItem key={id} value={id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teachers
              <span className="text-red-600">*</span>
            </Label>
            <div className="col-span-3">
              <MultipleSelector
                className="w-full"
                onChange={(value) =>
                  setEdit((pre) => ({
                    ...pre,
                    teachers: value.map((v) => v.value),
                  }))
                }
                value={edit.teachers?.map((tId) => ({
                  label: teachers[tId]?.name,
                  value: tId,
                }))}
                placeholder="Select teachers"
                options={Object.entries(teachers).map(([id, teacher]) => ({
                  id,
                  label: teacher.name,
                  value: id,
                }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              Room
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="room"
              value={edit.room}
              onChange={(e) => setEdit({ ...edit, room: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-students" className="text-right">
              Max Students
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="max-students"
              type="number"
              value={edit.maxStudents}
              onChange={(e) =>
                setEdit({ ...edit, maxStudents: Number(e.target.value) })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Schedule
            </Label>
            <Popover>
              <PopoverTrigger asChild className="col-span-3">
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground col-span-3'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 col-span-3">
                <Calendar
                  className="w-full"
                  mode="range"
                  selected={date}
                  onSelect={(newDate) => setDate(newDate)}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Days in Week
            </Label>
            <div className="col-span-3">
              <MultipleSelector
                className="w-full"
                onChange={(value) =>
                  setEdit((pre) => ({
                    ...pre,
                    schedule: {
                      ...pre.schedule,
                      daysInWeek: value.map((v) => v.value),
                    },
                  }))
                }
                value={edit.schedule?.daysInWeek?.map((day) => ({
                  label: classDays[day],
                  value: day,
                }))}
                placeholder="Select days"
                options={Object.entries(classDays).map(([id, day]) => ({
                  id,
                  label: day,
                  value: id,
                }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Hour In Day
            </Label>
            <div className="flex col-span-3 space-x-2 items-center">
              <Input
                id="start"
                type="time"
                value={edit.schedule?.hoursInDay?.start}
                onChange={(e) =>
                  setEdit((pre) => ({
                    ...pre,
                    schedule: {
                      ...pre.schedule,
                      hoursInDay: {
                        ...pre.schedule?.hoursInDay,
                        start: e.target.value,
                      },
                    },
                  }))
                }
              />
              <div>to</div>
              <Input
                id="end"
                type="time"
                value={edit.schedule?.hoursInDay?.end}
                onChange={(e) =>
                  setEdit((pre) => ({
                    ...pre,
                    schedule: {
                      ...pre.schedule,
                      hoursInDay: {
                        ...pre.schedule?.hoursInDay,
                        end: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Status
              <span className="text-red-600">*</span>
            </Label>
            <Select
              value={edit.status}
              onValueChange={(value) => setEdit({ ...edit, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(classStatuses).map(([id, status]) => (
                  <SelectItem key={id} value={id}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            {classroom?.id ? 'Save Changes' : 'Create Class'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomEditor;
