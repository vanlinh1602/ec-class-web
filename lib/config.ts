export const PATH_UPLOADS =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100'
    : 'https://be-english-courses.kuma.id.vn';

export const COURSES_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100/courses'
    : 'https://be-english-courses.kuma.id.vn/courses';

export const CLASSROON_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3100/classroom'
    : 'https://be-english-courses.kuma.id.vn/classroom';

export const STUDENTS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3200/students'
    : 'https://be-english-person.kuma.id.vn/students';

export const TEACHERS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3200/teachers'
    : 'https://be-english-person.kuma.id.vn/teachers';

export const USERS_BACKEND =
  process.env.NEXT_PUBLIC_STAGE === 'development'
    ? 'http://localhost:3300/'
    : 'https://be-english-auth.kuma.id.vn/';
