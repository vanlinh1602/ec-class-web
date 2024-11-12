import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createTeacher,
  deleteTeacher,
  getFilterTeacher,
  getTeachers,
  updateTeacher,
} from './api';
import { TeacherActions, TeacherState } from './types';

export const defaultInitState: TeacherState = {
  handling: false,
  teachers: {},
};

export const useTeacherStore = create<TeacherState & TeacherActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getTeachers: async () => {
      set(() => ({ handling: true }), false, { type: 'teachers/getTeacher' });
      const teachers = await getTeachers();
      const teachersMap = teachers.reduce((acc, teacher) => {
        acc[teacher.id] = teacher;
        return acc;
      }, {} as TeacherState['teachers']);

      set(() => ({ teachers: teachersMap, handling: false }), false, {
        type: 'teachers/getTeacher',
      });
    },
    getTeacher: async (id) => {
      set(() => ({ handling: true }), false, { type: 'teachers/getTeacher' });
      const result = await getFilterTeacher({ id });
      const teacher = result[0];
      if (teacher) {
        set(
          (s) => ({
            teachers: { ...s.teachers, [teacher.id]: teacher },
            handling: false,
          }),
          false,
          {
            type: 'teachers/getTeacher',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'teachers/getTeacher',
        });
      }
    },
    createTeacher: async (teacher) => {
      set(() => ({ handling: true }), false, {
        type: 'teachers/createTeacher',
      });
      const newTeacher = await createTeacher(teacher);
      if (!newTeacher) {
        set(() => ({ handling: false }), false, {
          type: 'teachers/createTeacher',
        });
        return;
      }
      set(
        (s) => ({
          teachers: { ...s.teachers, [newTeacher.id]: newTeacher },
          handling: false,
        }),
        false,
        { type: 'teachers/createTeacher' }
      );
    },
    updateTeacher: async (id, teacher) => {
      set(() => ({ handling: true }), false, {
        type: 'teachers/updateTeacher',
      });
      const updatedTeacher = await updateTeacher(id, teacher);
      if (!updatedTeacher) {
        set(() => ({ handling: false }), false, {
          type: 'teachers/updateTeacher',
        });
        return;
      }
      set(
        (s) => ({
          teachers: {
            ...s.teachers,
            [id]: {
              ...s.teachers[id],
              ...teacher,
            },
          },
          handling: false,
        }),
        false,
        { type: 'teachers/updateTeacher' }
      );
    },
    deleteTeacher: async (id) => {
      set(() => ({ handling: true }), false, {
        type: 'teachers/deleteTeacher',
      });
      const success = await deleteTeacher(id);
      if (!success) {
        set(() => ({ handling: false }), false, {
          type: 'teachers/deleteTeacher',
        });
        return;
      }
      set(
        (s) => {
          const newTeacher = { ...s.teachers };
          delete newTeacher[id];
          return { teachers: newTeacher, handling: false };
        },
        false,
        { type: 'teachers/deleteTeacher' }
      );
    },
  }))
);
