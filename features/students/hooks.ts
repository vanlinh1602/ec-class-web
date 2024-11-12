import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createStudent,
  deleteStudent,
  getFilterStudents,
  getStudents,
  updateStudent,
} from './api';
import { StudentActions, StudentState } from './types';

export const defaultInitState: StudentState = {
  handling: false,
  students: {},
};

export const useStudentStore = create<StudentState & StudentActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getStudents: async () => {
      set(() => ({ handling: true }), false, { type: 'students/getStudent' });
      const students = await getStudents();
      const studentsMap = students.reduce((acc, student) => {
        acc[student.id] = student;
        return acc;
      }, {} as StudentState['students']);

      set(() => ({ students: studentsMap, handling: false }), false, {
        type: 'students/getStudent',
      });
    },
    getStudent: async (id) => {
      set(() => ({ handling: true }), false, { type: 'students/getStudent' });
      const result = await getFilterStudents({ id });
      const student = result[0];
      if (student) {
        set(
          (s) => ({
            students: { ...s.students, [student.id]: student },
            handling: false,
          }),
          false,
          {
            type: 'students/getStudent',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'students/getStudent',
        });
      }
    },
    createStudent: async (student) => {
      set(() => ({ handling: true }), false, {
        type: 'students/createStudent',
      });
      const newStudent = await createStudent(student);
      if (!newStudent) {
        set(() => ({ handling: false }), false, {
          type: 'students/createStudent',
        });
        return;
      }
      set(
        (s) => ({
          students: { ...s.students, [newStudent.id]: newStudent },
          handling: false,
        }),
        false,
        { type: 'students/createStudent' }
      );
    },
    updateStudent: async (id, student) => {
      set(() => ({ handling: true }), false, {
        type: 'students/updateStudent',
      });
      const updatedStudent = await updateStudent(id, student);
      if (!updatedStudent) {
        set(() => ({ handling: false }), false, {
          type: 'students/updateStudent',
        });
        return;
      }
      set(
        (s) => ({
          students: {
            ...s.students,
            [id]: {
              ...s.students[id],
              ...student,
            },
          },
          handling: false,
        }),
        false,
        { type: 'students/updateStudent' }
      );
    },
    deleteStudent: async (id) => {
      set(() => ({ handling: true }), false, {
        type: 'students/deleteStudent',
      });
      const success = await deleteStudent(id);
      if (!success) {
        set(() => ({ handling: false }), false, {
          type: 'students/deleteStudent',
        });
        return;
      }
      set(
        (s) => {
          const newStudent = { ...s.students };
          delete newStudent[id];
          return { students: newStudent, handling: false };
        },
        false,
        { type: 'students/deleteStudent' }
      );
    },
  }))
);
