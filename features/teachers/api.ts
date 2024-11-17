import { toast } from '@/hooks/use-toast';
import formatError from '@/lib/formatError';
import { teachersService } from '@/services';

import { Teacher } from './types';

export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const result = await teachersService.get<Teacher[]>('');
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

export const getFilterTeacher = async (
  filter: Partial<Teacher>
): Promise<Teacher[]> => {
  try {
    const result = await teachersService.get<Teacher[]>('', filter);
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

export const createTeacher = async (
  teacher: Partial<Teacher>
): Promise<Teacher | null> => {
  try {
    const result = await teachersService.post<Teacher>('', { teacher });
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

export const updateTeacher = async (
  id: string,
  teacher: Partial<Teacher>
): Promise<boolean> => {
  try {
    const result = await teachersService.put<{ success: boolean }>('', {
      id,
      teacher,
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

export const deleteTeacher = async (id: string): Promise<boolean> => {
  try {
    const result = await teachersService.delete<{ success: boolean }>('', {
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
