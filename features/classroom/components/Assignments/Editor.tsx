import moment from 'moment';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useClassroomStore } from '../../hooks';
import { Assignment } from '../../types';

type EditAssignment = {
  title: string;
  description: string;
  dueDate: string;
};

type Props = {
  assignment?: Assignment;
  classId: string;
  onCancel: () => void;
};

export const AssignmentEditor = ({ assignment, classId, onCancel }: Props) => {
  const { createAssignment, updateAssignment } = useClassroomStore(
    useShallow((state) => ({
      createAssignment: state.createAssignment,
      updateAssignment: state.updateAssignment,
    }))
  );

  const [newAssignment, setNewAssignment] = useState<EditAssignment>({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    if (assignment) {
      setNewAssignment({
        title: assignment.title,
        description: assignment.description,
        dueDate: moment(assignment.dueDate).format('YYYY-MM-DD'),
      });
    }
  }, [assignment]);

  const handleSave = async () => {
    const dataUpdate: Omit<Assignment, 'id'> = {
      ...newAssignment,
      classId,
      dueDate: new Date(newAssignment.dueDate),
    };
    if (assignment) {
      await updateAssignment(assignment.id, dataUpdate);
    } else {
      await createAssignment(dataUpdate);
    }
    onCancel();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newAssignment?.title}
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
              value={newAssignment?.description}
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
              value={newAssignment?.dueDate}
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
        <Button onClick={handleSave}>
          {assignment ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
