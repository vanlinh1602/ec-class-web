export type Classroom = {
  id: string;
  name: string;
  course: string;
  room: string;
  teachers: string[];
  maxStudents: number;
  status: string;
  schedule: {
    start?: number;
    end?: number;
    daysInWeek?: string[];
    hoursInDay?: {
      start?: string;
      end?: string;
    };
  };
  students?: string[];
  completedSyallbus?: Record<string, boolean>;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: Date;
}

export interface Submission {
  assignmentId: string;
  studentId: string;
  submission: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClassroomState = {
  handling: boolean;
  classes: Record<string, Classroom>;
  assignments: Record<string, Assignment[]>;
  submissions: Record<string, Submission[]>;
};

export type ClassroomActions = {
  getClasses: () => Promise<void>;
  getClass: (id: string) => Promise<void>;
  getFilterClass: (filter: Partial<Classroom>) => Promise<void>;
  createClass: (classroom: Partial<Classroom>) => Promise<void>;
  updateClass: (id: string, classroom: Partial<Classroom>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  // Assignment
  getAssignments: (classId: string) => Promise<void>;
  createAssignment: (assignment: Partial<Assignment>) => Promise<void>;
  updateAssignment: (
    id: string,
    assignment: Partial<Assignment>
  ) => Promise<void>;
  deleteAssignment: (id: string, classId: string) => Promise<void>;
  // Submission
  getSubmissions: (assignmentId: string) => Promise<void>;
  createSubmission: (
    submission: Partial<Submission>,
    files: File[]
  ) => Promise<void>;
  updateSubmission: (
    studentId: string,
    classId: string,
    submission: Partial<Submission>,
    files?: File[]
  ) => Promise<void>;
  deleteSubmission: (studentId: string, classId: string) => Promise<void>;
};
