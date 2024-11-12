export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  birthdate: number;
  gender: string;
  address: string;
  qualifications?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TeacherState = {
  handling: boolean;
  teachers: Record<string, Teacher>;
};

export type TeacherActions = {
  getTeachers: () => void;
  getTeacher: (id: string) => void;
  createTeacher: (teacher: Partial<Teacher>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
};
