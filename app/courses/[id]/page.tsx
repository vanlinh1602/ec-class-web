'use client';

import _ from 'lodash';
import {
  Book,
  Calendar,
  CircleDot,
  DollarSign,
  Eye,
  GraduationCap,
  Info,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Waiting from '@/components/Waiting';
import { useClassroomStore } from '@/features/classroom/hooks';
import { CourseEditor, SyllabusEditor } from '@/features/courses/components';
import { useCourseStore } from '@/features/courses/hooks';
import { classStatuses, courseLevels, courseStatuses } from '@/lib/options';
import { generateID } from '@/lib/utils';
import { format } from '@/utils/number';

export default function CourseInfo() {
  const { id } = useParams<{ id: string }>();

  const {
    courses,
    syllabus,
    getCourse,
    updateCourse,
    getSyllabus,
    updateSyllabus,
    createSyllabus,
    handling,
  } = useCourseStore(
    useShallow((state) => ({
      handling: state.handling,
      courses: state.courses,
      getCourse: state.getCourse,
      updateCourse: state.updateCourse,
      getSyllabus: state.getSyllabus,
      updateSyllabus: state.updateSyllabus,
      createSyllabus: state.createSyllabus,
      syllabus: state.syllabus,
    }))
  );

  const { classes, getFilterClass } = useClassroomStore(
    useShallow((state) => ({
      classes: state.classes,
      getFilterClass: state.getFilterClass,
    }))
  );

  const course = useMemo(() => courses[id as string], [courses]);
  const courseSyllabus = useMemo(() => {
    // sort syllabus by week
    const syllabusData = syllabus[id as string];
    if (!syllabusData) return null;
    return {
      ...syllabusData,
      styllabus: _.sortBy(syllabusData.styllabus, 'week'),
    };
  }, [syllabus]);

  const classesData = useMemo(() => {
    return Object.values(classes).filter((item) => item.course === id);
  }, [classes]);

  const [editSyllabus, setEditSyllabus] = useState<number>();

  useEffect(() => {
    if (!course) {
      getCourse(id as string);
    }
    if (!courseSyllabus) {
      getSyllabus(id as string);
    }
  }, [id, course, courseSyllabus]);

  useEffect(() => {
    if (id) {
      getFilterClass({ course: id });
    }
  }, []);

  const handleSaveSyllabus = (data: any) => {
    const currentSyllabus = courseSyllabus?.styllabus || [];
    if (editSyllabus === -1) {
      currentSyllabus.push({
        ...data,
        id: generateID(),
      });
    } else {
      _.set(currentSyllabus, [editSyllabus!], {
        ...currentSyllabus[editSyllabus!],
        ...data,
      });
    }
    if (courseSyllabus) {
      updateSyllabus(courseSyllabus.course, {
        styllabus: currentSyllabus,
      });
    } else {
      createSyllabus({
        course: id as string,
        styllabus: currentSyllabus,
      });
    }
    setEditSyllabus(undefined);
  };

  const [editCourseInfo, setEditCourseInfo] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {handling ? <Waiting /> : null}
      {editCourseInfo ? (
        <CourseEditor
          course={course}
          onSave={(data) => {
            updateCourse(id, data);
            setEditCourseInfo(false);
          }}
          onCancel={() => setEditCourseInfo(false)}
        />
      ) : null}
      {editSyllabus !== undefined ? (
        <SyllabusEditor
          initialData={
            editSyllabus !== -1
              ? courseSyllabus?.styllabus[editSyllabus]
              : undefined
          }
          onSave={handleSaveSyllabus}
          onCancel={() => setEditSyllabus(undefined)}
        />
      ) : null}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{course?.name}</CardTitle>
            </div>
            <Button
              className="flex items-center"
              onClick={() => setEditCourseInfo(true)}
            >
              <Pencil className="w-5 h-5" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Infomation
            </h3>
            <div className="grid grid-cols-3">
              <div className="flex items-center">
                <span className="font-semibold">Status:</span>
                <span className="ml-2">
                  {courseStatuses[course?.status || '']}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">Level:</span>
                <span className="ml-2">
                  {courseLevels[course?.level || '']}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">Duration:</span>
                <span className="ml-2">{course?.duration} week</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">Description:</span>
              <span className="ml-2">{course?.description || 'N/A'}</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg mb-2 flex items-center ">
                <Book className="h-5 w-5 mr-2" />
                Course Syllabus
              </h3>
              <Button onClick={() => setEditSyllabus(-1)}>Add Syllabus</Button>
            </div>
            <div className="space-y-2 mt-2">
              {courseSyllabus ? (
                courseSyllabus.styllabus.map((item, index) => (
                  <div className="flex justify-between">
                    <div key={index} className="flex items-center ml-4">
                      <CircleDot className="w-5 h-5 mr-2" />
                      <span>
                        Week {item.week}: {item.description}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Pencil
                        className="w-5 h-5"
                        onClick={() => setEditSyllabus(index)}
                      />
                      <Trash2
                        className="w-5 h-5 text-destructive"
                        onClick={() => {
                          const newSyllabus = courseSyllabus.styllabus.filter(
                            (v, i) => i !== index
                          );
                          updateSyllabus(id, {
                            styllabus: newSyllabus,
                          });
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No syllabus available.</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing
            </h3>
            <p className="font-semibold">
              Full Payment: ${format(course?.price)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Classes
            </h3>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classesData.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {moment(cls.schedule.start).format('DD/MM/YYYY')}
                          {' - '}
                          {moment(cls.schedule.end).format('DD/MM/YYYY')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {cls.students?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            cls.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {classStatuses[cls.status]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={{
                            pathname: `/classrooms/${cls.id}`,
                          }}
                          className="mr-2"
                        >
                          <Button variant="secondary">
                            <Eye className="w-5 h-5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
