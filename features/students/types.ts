export type Student = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  birthdate: number;
  gender: string;
  address?: string;
  courses?: string[];
  classes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type StudentState = {
  handling: boolean;
  students: Record<string, Student>;
};

export type StudentActions = {
  getStudents: () => void;
  getStudent: (id: string) => void;
  createStudent: (student: Partial<Student>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
};
