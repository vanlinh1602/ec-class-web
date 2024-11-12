import {
  CLASSROON_BACKEND,
  COURSES_BACKEND,
  STUDENTS_BACKEND,
  TEACHERS_BACKEND,
} from '@/lib/config';

import Api from './api';

export const coursesService = new Api({
  baseURL: COURSES_BACKEND,
  withCredentials: true,
});

export const classroomsService = new Api({
  baseURL: CLASSROON_BACKEND,
  withCredentials: true,
});

export const studentsService = new Api({
  baseURL: STUDENTS_BACKEND,
  withCredentials: true,
});

export const teachersService = new Api({
  baseURL: TEACHERS_BACKEND,
  withCredentials: true,
});
