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

export type ClassroomState = {
  handling: boolean;
  classes: Record<string, Classroom>;
};

export type ClassroomActions = {
  getClasses: () => void;
  getClass: (id: string) => void;
  getFilterClass: (filter: Partial<Classroom>) => void;
  createClass: (classroom: Partial<Classroom>) => void;
  updateClass: (id: string, classroom: Partial<Classroom>) => void;
  deleteClass: (id: string) => void;
};
