export type Courses = {
  id: string;
  name: string;
  description: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CourseSyllabus = {
  course: string;
  styllabus: {
    id: string;
    week: number;
    description: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type CoursesState = {
  handling: boolean;
  courses: Record<string, Courses>;
  syllabus: Record<string, CourseSyllabus>;
};

export type CoursesActions = {
  getCourses: () => void;
  getCourse: (id: string) => void;
  createCourse: (course: Partial<Courses>) => void;
  updateCourse: (id: string, course: Partial<Courses>) => void;
  deleteCourse: (id: string) => void;
  // Syllabus
  createSyllabus: (syllabus: Partial<CourseSyllabus>) => void;
  getSyllabus: (courseId: string) => void;
  updateSyllabus: (courseId: string, syllabus: Partial<CourseSyllabus>) => void;
  deleteSyllabus: (courseId: string) => void;
};
