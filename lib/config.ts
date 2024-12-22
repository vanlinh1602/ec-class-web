export const PATH_UPLOADS =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100'
    : 'http://localhost:3100';

export const COURSES_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100/courses'
    : 'http://localhost:3100/courses';

export const CLASSROON_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100/classroom'
    : 'http://localhost:3100/classroom';

export const STUDENTS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3200/students'
    : 'http://localhost:3200/students';

export const TEACHERS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3200/teachers'
    : 'http://localhost:3200/teachers';

export const USERS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3300/'
    : 'http://localhost:3300/';
