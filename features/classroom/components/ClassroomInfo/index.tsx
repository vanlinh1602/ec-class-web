import _ from 'lodash';
import { Book } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCourseStore } from '@/features/courses/hooks';
import { useTeacherStore } from '@/features/teachers/hooks';
import { classDays } from '@/lib/options';

import { Classroom } from '../../types';

type Props = {
  classroom: Classroom;
};

const ClassroomInfo = ({ classroom }: Props) => {
  const { id } = classroom;

  const { allSyllabus, getSyllabus } = useCourseStore(
    useShallow((state) => ({
      courseHandling: state.handling,
      courses: state.courses,
      allSyllabus: state.syllabus,
      getCourse: state.getCourse,
      getSyllabus: state.getSyllabus,
    }))
  );

  const { teachers, getTeachers } = useTeacherStore(
    useShallow((state) => ({
      teachers: state.teachers,
      getTeachers: state.getTeachers,
    }))
  );

  const courseSyllabus = useMemo(
    () => allSyllabus[classroom.course as string],
    [allSyllabus, classroom.course]
  );

  const progress = useMemo(() => {
    if (!classroom || !courseSyllabus) return 0;
    const completed = Object.values(classroom.completedSyallbus || {}).filter(
      (v) => !!v
    ).length;
    const total = courseSyllabus.styllabus.length;
    return (completed / total) * 100;
  }, [classroom, courseSyllabus]);

  useEffect(() => {
    if (!courseSyllabus) {
      getSyllabus(classroom.course);
    }
    if (!Object.keys(teachers).length) {
      getTeachers();
    }
  }, [id]);

  return (
    <div className="space-y-4 pt-2">
      <div>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="font-semibold">Room:</span>
            <span className="ml-2">{classroom?.room || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">Schedule:</span>
            <span className="ml-2">
              {classroom?.schedule?.daysInWeek
                ?.map((v) => classDays[v])
                .join(', ') || 'N/A'}
              {': '}
              <strong>{classroom?.schedule?.hoursInDay?.start || 'N/A'}</strong>
              {' - '}
              <strong>{classroom?.schedule?.hoursInDay?.end || 'N/A'}</strong>
              {'. From '}
              {moment(classroom?.schedule?.start).format('DD/MM/YYYY')} to{' '}
              {moment(classroom?.schedule?.end).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">Teachers:</span>
            <span className="ml-2">
              {classroom?.teachers
                ?.map((teacher) => teachers[teacher]?.name)
                .join(', ')}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center">
          <Book className="h-5 w-5 mr-2" />
          Course Syllabus
        </h3>
        <div className="space-y-2">
          {_.sortBy(courseSyllabus?.styllabus, 'week').map((item, index) => (
            <div className="flex justify-between">
              <div key={index} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                    classroom?.completedSyallbus?.[item.id]
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                >
                  {classroom?.completedSyallbus?.[item.id] && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <span
                  className={
                    classroom?.completedSyallbus?.[item.id]
                      ? 'line-through text-muted-foreground'
                      : ''
                  }
                >
                  Week {item.week}: {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress.toFixed(0)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassroomInfo;
