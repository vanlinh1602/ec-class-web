// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createAssignment,
  createClassroom,
  createSubmission,
  deleteAssignment,
  deleteClassroom,
  deleteSubmission,
  getClassroomes,
  getFilterAssignment,
  getFilterClassroom,
  getFilterSubmission,
  updateAssignment,
  updateClassroom,
  updateSubmission,
} from './api';
import { ClassroomActions, ClassroomState } from './types';

export const defaultInitState: ClassroomState = {
  handling: false,
  classes: {},
  assignments: {},
  submissions: {},
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
    // Assignment
    getAssignments: async (classId) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/getAssignments',
      });
      const assignments = await getFilterAssignment({ classId: classId });
      set(
        (s) => ({
          assignments: {
            ...s.assignments,
            [classId]: assignments,
          },
          handling: false,
        }),
        false,
        {
          type: 'classes/getAssignments',
        }
      );
    },
    createAssignment: async (assignment) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/createAssignment',
      });
      const newAssignment = await createAssignment(assignment);
      if (!newAssignment) {
        set(() => ({ handling: false }), false, {
          type: 'classes/createAssignment',
        });
        return;
      }
      set(
        (s) => ({
          assignments: {
            ...s.assignments,
            [assignment.classId!]: [
              ...(s.assignments[assignment.classId!] || []),
              newAssignment,
            ],
          },
          handling: false,
        }),
        false,
        {
          type: 'classes/createAssignment',
        }
      );
    },
    updateAssignment: async (id, assignment) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/updateAssignment',
      });
      const assignments = { ...assignment };
      const success = await updateAssignment(id, assignments);
      if (success) {
        set(
          (s) => ({
            assignments: {
              ...s.assignments,
              [assignments.classId!]: s.assignments[assignments.classId!].map(
                (a) => (a.id === id ? { ...a, ...assignments } : a)
              ),
            },
            handling: false,
          }),
          false,
          {
            type: 'classes/updateAssignment',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/updateAssignment',
        });
      }
    },
    deleteAssignment: async (id, classId) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/deleteAssignment',
      });
      const success = await deleteAssignment(id);
      if (success) {
        set(
          (s) => ({
            assignments: {
              ...s.assignments,
              [classId]: s.assignments[classId].filter((a) => a.id !== id),
            },
            handling: false,
          }),
          false,
          {
            type: 'classes/deleteAssignment',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/deleteAssignment',
        });
      }
    },
    // Submission
    getSubmissions: async (assignmentId) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/getSubmissions',
      });
      const submissions = await getFilterSubmission({ assignmentId });
      set(
        (s) => ({
          submissions: {
            ...s.submissions,
            [assignmentId]: submissions,
          },
          handling: false,
        }),
        false,
        {
          type: 'classes/getSubmissions',
        }
      );
    },
    createSubmission: async (submission, files) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/createSubmission',
      });
      const newSubmission = await createSubmission(submission, files);
      if (!newSubmission) {
        set(() => ({ handling: false }), false, {
          type: 'classes/createSubmission',
        });
        return;
      }
      set(
        (s) => ({
          submissions: {
            ...s.submissions,
            [submission.assignmentId!]: [
              ...(s.submissions[submission.assignmentId!] || []),
              newSubmission,
            ],
          },
          handling: false,
        }),
        false,
        {
          type: 'classes/createSubmission',
        }
      );
    },
    updateSubmission: async (studentId, classId, submission, files) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/updateSubmission',
      });
      const success = await updateSubmission(
        studentId,
        classId,
        submission,
        files
      );
      if (success) {
        set(
          (s) => ({
            submissions: {
              ...s.submissions,
              [classId]: s.submissions[classId].map((a) =>
                a.assignmentId === classId ? { ...a, ...submission } : a
              ),
            },
            handling: false,
          }),
          false,
          {
            type: 'classes/updateSubmission',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/updateSubmission',
        });
      }
    },
    deleteSubmission: async (studentId, classId) => {
      set(() => ({ handling: true }), false, {
        type: 'classes/deleteSubmission',
      });
      const success = await deleteSubmission(studentId, classId);
      if (success) {
        set(
          (s) => ({
            submissions: {
              ...s.submissions,
              [classId]: s.submissions[classId].filter(
                (a) => a.studentId !== studentId
              ),
            },
            handling: false,
          }),
          false,
          {
            type: 'classes/deleteSubmission',
          }
        );
      } else {
        set(() => ({ handling: false }), false, {
          type: 'classes/deleteSubmission',
        });
      }
    },
  }))
);
