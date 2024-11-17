import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Waiting from '@/components/Waiting';
import { useUserStore } from '@/features/user/hooks';

import { useClassroomStore } from '../../hooks';
import { Assignment } from '../../types';
import { AssignmentEditor } from './Editor';

const AssignmentsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [newAssignment, setNewAssignment] = useState<{ value?: Assignment }>();

  const { handling, assignments, getAssignments } = useClassroomStore(
    useShallow((state) => ({
      handling: state.handling,
      assignments: state.assignments,
      getAssignments: state.getAssignments,
    }))
  );

  const { role } = useUserStore(
    useShallow((state) => ({
      role: state.role,
    }))
  );

  const classAssignments = useMemo(
    () => assignments?.[id] || [],
    [assignments, id]
  );

  useEffect(() => {
    if (!classAssignments.length) {
      getAssignments(id);
    }
  }, [id]);

  return (
    <div>
      {handling ? <Waiting /> : null}
      {newAssignment && (
        <AssignmentEditor
          assignment={newAssignment.value}
          classId={id}
          onCancel={() => setNewAssignment(undefined)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Assignments</h2>
        {role === 'teacher' && (
          <Button onClick={() => setNewAssignment({ value: undefined })}>
            Create Assignment
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classAssignments?.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Due Date: {moment(assignment.dueDate).format('DD/MM/YYYY')}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {role === 'student' && (
                <Link href={`/homework/${assignment.id}-${id}`}>
                  <Button>View Detail</Button>
                </Link>
              )}
              {role === 'teacher' && (
                <>
                  <Button
                    onClick={() => setNewAssignment({ value: assignment })}
                  >
                    Edit
                  </Button>
                  <Link href={`/submission/${assignment.id}-${id}`}>
                    <Button>View Result</Button>
                  </Link>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;
