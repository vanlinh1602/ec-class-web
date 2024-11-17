import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useStudentStore } from '@/features/students/hooks';

type Props = {
  classStudents: string[];
};

const Students = ({ classStudents }: Props) => {
  const { students, getStudents } = useStudentStore(
    useShallow((state) => ({
      students: state.students,
      getStudents: state.getStudents,
    }))
  );

  useEffect(() => {
    if (!Object.keys(students).length) {
      getStudents();
    }
  }, []);

  const activeStudent = useMemo(() => {
    return classStudents.map((id) => students[id] || {});
  }, [students, classStudents]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Students</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeStudent.map((student) => (
          <Card key={student.id}>
            <CardContent className="flex items-center space-x-4 pt-6">
              <Avatar>
                <AvatarImage
                  src={'/placeholder.svg?height=40&width=40'}
                  alt={student.name}
                />
                <AvatarFallback>
                  {(student?.name || '')
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
    </div>
  );
};

export default Students;
