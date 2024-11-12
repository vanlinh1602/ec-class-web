// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createClassroom,
  deleteClassroom,
  getClassroomes,
  getFilterClassroom,
  updateClassroom,
} from './api';
import { ClassroomActions, ClassroomState } from './types';

export const defaultInitState: ClassroomState = {
  handling: false,
  classes: {},
};

export const useClassroomStore = create<ClassroomState & ClassroomActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getClasses: async () => {
      set(() => ({ handling: true }), false, { type: 'classes/getClasses' });
      const classes = await getClassroomes();
      const classesMap = classes.reduce((acc, classroom) => {
        acc[classroom.id] = classroom;
        return acc;
      }, {} as ClassroomState['classes']);

      set(() => ({ classes: classesMap, handling: false }), false, {
        type: 'classes/getClasses',
      });
    },
    getClass: async (id) => {
      set(() => ({ handling: true }), false, { type: 'classes/getClass' });
      const result = await getFilterClassroom({ id });
      const classroom = result[0];
      if (classroom) {
        set(
          (s) => ({
            classes: { ...s.classes, [classroom.id]: classroom },
            handling: false,
          }),
          false,
          {
            type: 'classes/getClass',
          }
        );
      } else {
        set(() => ({ handling: false }), false, { type: 'classes/getClass' });
      }
    },
    createClass: async (classroom) => {
      set(() => ({ handling: true }), false, { type: 'classes/createClass' });
      const newClass = await createClassroom(classroom);
      if (!newClass) {
        set(() => ({ handling: false }), false, {
          type: 'classes/createClass',
        });
        return;
      }
      set(
        (s) => ({
          classes: { ...s.classes, [newClass.id]: newClass },
          handling: false,
        }),
        false,
        {
          type: 'classes/createClass',
        }
      );
    },
    updateClass: async (id, classroom) => {
      set(() => ({ handling: true }), false, { type: 'classes/updateClass' });
      const success = await updateClassroom(id, classroom);
      if (success) {
        set(
          (s) => ({
            classes: {
              ...s.classes,
              [id]: { ...s.classes[id], ...classroom },
            },
            handling: false,
          }),
          false,
          {
            type: 'classes/updateClass',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/updateClass',
        });
      }
    },
    deleteClass: async (id) => {
      set(() => ({ handling: true }), false, { type: 'classes/deleteClass' });
      const success = await deleteClassroom(id);
      if (success) {
        set(
          (s) => {
            const classes = { ...s.classes };
            delete classes[id];
            return { classes, handling: false };
          },
          false,
          { type: 'classes/deleteClass' }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/deleteClass',
        });
      }
    },
    getFilterClass: async (filter) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/getFilterClass',
      });
      const classes = await getFilterClassroom(filter);
      const classesMap = classes.reduce((acc, classroom) => {
        acc[classroom.id] = classroom;
        return acc;
      }, {} as ClassroomState['classes']);

      set(
        (s) => ({
          classes: {
            ...s.classes,
            ...classesMap,
          },
          handling: false,
        }),
        false,
        {
          type: 'classes/getFilterClass',
        }
      );
    },
  }))
);
