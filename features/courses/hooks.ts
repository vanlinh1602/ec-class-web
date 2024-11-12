import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createCourse,
  createSyllabus,
  deleteCourse,
  getCourses,
  getFilteredCourses,
  getSyllabus,
  updateCourse,
  updateSyllabus,
} from './api';
import { CoursesActions, CoursesState } from './types';

export const defaultInitState: CoursesState = {
  handling: false,
  courses: {},
  syllabus: {},
};

export const useCourseStore = create<CoursesState & CoursesActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getCourses: async () => {
      set(() => ({ handling: true }), false, { type: 'courses/getCourses' });
      const courses = await getCourses();
      const coursesMap = courses.reduce((acc, course) => {
        acc[course.id] = course;
        return acc;
      }, {} as CoursesState['courses']);

      set(() => ({ courses: coursesMap, handling: false }), false, {
        type: 'courses/getCourses',
      });
    },
    getCourse: async (id) => {
      set(() => ({ handling: true }), false, { type: 'courses/getCourse' });
      const result = await getFilteredCourses({ id });
      const course = result[0];
      if (course) {
        set(
          (s) => ({
            courses: { ...s.courses, [course.id]: course },
            handling: false,
          }),
          false,
          {
            type: 'courses/getCourse',
          }
        );
      } else {
        set(() => ({ handling: false }), false, { type: 'courses/getCourse' });
      }
    },
    createCourse: async (course) => {
      set(() => ({ handling: true }), false, { type: 'courses/createCourse' });
      const newCourse = await createCourse(course);
      if (!newCourse) {
        set(() => ({ handling: false }), false, {
          type: 'courses/createCourse',
        });
        return;
      }
      set(
        (s) => ({
          courses: { ...s.courses, [newCourse.id]: newCourse },
          handling: false,
        }),
        false,
        { type: 'courses/createCourse' }
      );
    },
    updateCourse: async (id, course) => {
      set(() => ({ handling: true }), false, { type: 'courses/updateCourse' });
      const updatedCourse = await updateCourse(id, course);
      if (!updatedCourse) {
        set(() => ({ handling: false }), false, {
          type: 'courses/updateCourse',
        });
        return;
      }
      set(
        (s) => ({
          courses: {
            ...s.courses,
            [id]: {
              ...s.courses[id],
              ...course,
            },
          },
          handling: false,
        }),
        false,
        { type: 'courses/updateCourse' }
      );
    },
    deleteCourse: async (id) => {
      set(() => ({ handling: true }), false, { type: 'courses/deleteCourse' });
      const success = await deleteCourse(id);
      if (!success) {
        set(() => ({ handling: false }), false, {
          type: 'courses/deleteCourse',
        });
        return;
      }
      set(
        (s) => {
          const newCourses = { ...s.courses };
          delete newCourses[id];
          return { courses: newCourses, handling: false };
        },
        false,
        { type: 'courses/deleteCourse' }
      );
    },
    // Syllabus
    createSyllabus: async (syllabus) => {
      set(() => ({ handling: true }), false, {
        type: 'courses/createSyllabus',
      });
      const newSyllabus = await createSyllabus(syllabus);
      if (!newSyllabus) {
        set(() => ({ handling: false }), false, {
          type: 'courses/createSyllabus',
        });
        return;
      }
      set(
        (s) => ({
          syllabus: { ...s.syllabus, [newSyllabus.course]: newSyllabus },
          handling: false,
        }),
        false,
        { type: 'courses/createSyllabus' }
      );
    },
    getSyllabus: async (courseId) => {
      set(() => ({ handling: true }), false, { type: 'courses/getSyllabus' });
      const syllabus = await getSyllabus(courseId);
      if (!syllabus) {
        set(() => ({ handling: false }), false, {
          type: 'courses/getSyllabus',
        });
        return;
      }
      set(
        (s) => ({
          handling: false,
          syllabus: { ...s.syllabus, [syllabus.course]: syllabus },
        }),
        false,
        { type: 'courses/getSyllabus' }
      );
    },
    updateSyllabus: async (courseId, syllabus) => {
      set(() => ({ handling: true }), false, {
        type: 'courses/updateSyllabus',
      });
      const success = await updateSyllabus(courseId, syllabus);
      if (!success) {
        set(() => ({ handling: false }), false, {
          type: 'courses/updateSyllabus',
        });
        return;
      }
      set(
        (s) => ({
          syllabus: { ...s.syllabus, [courseId]: syllabus as any },
          handling: false,
        }),
        false,
        { type: 'courses/updateSyllabus' }
      );
    },
    deleteSyllabus: async (courseId) => {
      set(() => ({ handling: true }), false, {
        type: 'courses/deleteSyllabus',
      });
      const success = await updateSyllabus(courseId, {} as any);
      if (!success) {
        set(() => ({ handling: false }), false, {
          type: 'courses/deleteSyllabus',
        });
        return;
      }
      set(
        (s) => {
          const newSyllabus = { ...s.syllabus };
          delete newSyllabus[courseId];
          return { syllabus: newSyllabus, handling: false };
        },
        false,
        { type: 'courses/deleteSyllabus' }
      );
    },
  }))
);
