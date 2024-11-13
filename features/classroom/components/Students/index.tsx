import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const Students = () => {
  const [students] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ]);

  return (
    <div>
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
    </div>
  );
};

export default Students;
