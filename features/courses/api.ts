import { toast } from '@/hooks/use-toast';
import formatError from '@/lib/formatError';
import { coursesService } from '@/services';

import { Courses, CourseSyllabus } from './types';

export const getCourses = async (): Promise<Courses[]> => {
  try {
    const result = await coursesService.get<Courses[]>('');
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const getFilteredCourses = async (
  filter: Partial<Courses>
): Promise<Courses[]> => {
  try {
    const result = await coursesService.get<Courses[]>('', filter);
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const createCourse = async (
  course: Partial<Courses>
): Promise<Courses | null> => {
  try {
    const result = await coursesService.post<Courses>('', { course });
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const updateCourse = async (
  id: string,
  course: Partial<Courses>
): Promise<boolean> => {
  try {
    const result = await coursesService.put<{ success: boolean }>('', {
      id,
      course,
    });
    if (result.kind === 'ok') {
      return result.data.success;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const result = await coursesService.delete<{ success: boolean }>('', {
      id,
    });
    if (result.kind === 'ok') {
      return result.data.success;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};

// Syllabus
export const createSyllabus = async (
  syllabus: Partial<CourseSyllabus>
): Promise<CourseSyllabus | null> => {
  try {
    const result = await coursesService.post<CourseSyllabus>(
      '/syllabus',
      syllabus
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const getSyllabus = async (
  courseId: string
): Promise<CourseSyllabus | null> => {
  try {
    const result = await coursesService.get<CourseSyllabus>('/syllabus', {
      courseId,
    });
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch {
    return null;
  }
};

export const updateSyllabus = async (
  courseId: string,
  syllabus: Partial<CourseSyllabus>
): Promise<boolean> => {
  try {
    const result = await coursesService.put<{ success: boolean }>('/syllabus', {
      course: courseId,
      syllabus,
    });
    if (result.kind === 'ok') {
      return result.data.success;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
