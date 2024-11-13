'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Assignments,
  ClassroomInfo,
  Students,
} from '@/features/classroom/components';
import { useClassroomStore } from '@/features/classroom/hooks';
import { Classroom } from '@/features/classroom/types';

export default function ClassDetails() {
  const { id } = useParams<{ id: string }>();

  const { classes, getClass } = useClassroomStore(
    useShallow((state) => ({
      classes: state.classes,
      getClass: state.getClass,
    }))
  );

  const classroom = useMemo(() => classes[id], [classes, id]);
  useEffect(() => {
    if (!classroom) {
      getClass(id);
    }
  }, [id]);

  return (
    <div className="bg-white rounded p-6 h-full">
      <h1 className="text-2xl font-bold mb-6">English 101</h1>
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Infomation</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <ClassroomInfo classroom={classroom || ({} as Classroom)} />
        </TabsContent>
        <TabsContent value="assignments">
          <Assignments />
        </TabsContent>
        <TabsContent value="students">
          <Students />
        </TabsContent>
      </Tabs>
    </div>
  );
}
