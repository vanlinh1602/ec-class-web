import { toast } from '@/hooks/use-toast';
import formatError from '@/lib/formatError';
import { studentsService } from '@/services';

import { Student } from './types';

export const getStudents = async (): Promise<Student[]> => {
  try {
    const result = await studentsService.get<Student[]>('');
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const getFilterStudents = async (
  filter: Partial<Student>
): Promise<Student[]> => {
  try {
    const result = await studentsService.get<Student[]>('', filter);
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const createStudent = async (
  student: Partial<Student>
): Promise<Student | null> => {
  try {
    const result = await studentsService.post<Student>('', { student });
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const updateStudent = async (
  id: string,
  student: Partial<Student>
): Promise<boolean> => {
  try {
    const result = await studentsService.put<{ success: boolean }>('', {
      id,
      student,
    });
    if (result.kind === 'ok') {
      return result.data.success;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    const result = await studentsService.delete<{ success: boolean }>('', {
      id,
    });
    if (result.kind === 'ok') {
      return result.data.success;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
