import { toast } from '@/hooks/use-toast';
import formatError from '@/lib/formatError';
import { classroomsService } from '@/services';

import { Assignment, Classroom, Submission } from './types';

export const getClassroomes = async (): Promise<Classroom[]> => {
  try {
    const result = await classroomsService.get<Classroom[]>('');
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

export const getFilterClassroom = async (
  filter: Partial<Classroom>
): Promise<Classroom[]> => {
  try {
    const result = await classroomsService.get<Classroom[]>('', filter);
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

export const createClassroom = async (
  classroom: Partial<Classroom>
): Promise<Classroom | null> => {
  try {
    const result = await classroomsService.post<Classroom>('', {
      classroom,
    });
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

export const updateClassroom = async (
  id: string,
  classroom: Partial<Classroom>
): Promise<boolean> => {
  try {
    const result = await classroomsService.put<{ success: boolean }>('', {
      id,
      classroom,
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

export const deleteClassroom = async (id: string): Promise<boolean> => {
  try {
    const result = await classroomsService.delete<{ success: boolean }>('', {
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

// Assignment

export const getFilterAssignment = async (filter: {
  classId: string;
}): Promise<Assignment[]> => {
  try {
    const result = await classroomsService.get<Assignment[]>(
      'assignment',
      filter
    );
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

export const createAssignment = async (
  assignment: Partial<Assignment>
): Promise<Assignment | null> => {
  try {
    const result = await classroomsService.post<Assignment>('assignment', {
      assignment,
    });
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

export const updateAssignment = async (
  id: string,
  assignment: Partial<Assignment>
): Promise<boolean> => {
  try {
    const result = await classroomsService.put<{ success: boolean }>(
      'assignment',
      {
        id,
        assignment,
      }
    );
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

export const deleteAssignment = async (id: string): Promise<boolean> => {
  try {
    const result = await classroomsService.delete<{ success: boolean }>(
      'assignment',
      {
        id,
      }
    );
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

// Submission

export const getFilterSubmission = async (filter: {
  assignmentId: string;
}): Promise<Submission[]> => {
  try {
    const result = await classroomsService.get<Submission[]>(
      'submission',
      filter
    );
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

export const createSubmission = async (
  submission: Partial<Submission>,
  files: File[]
): Promise<Submission | null> => {
  try {
    const result = await classroomsService.upload<Submission>(
      'submission',
      files,
      submission
    );
    if (result.kind !== 'ok') {
      throw result;
    }
    const data = result.data;
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const updateSubmission = async (
  studentId: string,
  assignmentId: string,
  submission: Partial<Submission>,
  files?: File[]
): Promise<boolean> => {
  try {
    if (files) {
      const uploadFiles = await classroomsService.upload<string>(
        'upload',
        files,
        {
          assignmentId,
          studentId,
        }
      );
      if (uploadFiles.kind !== 'ok') {
        throw uploadFiles;
      }
      submission.path = uploadFiles.data;
    }

    const result = await classroomsService.put<{ success: boolean }>(
      'submission',
      {
        studentId,
        assignmentId,
        submission,
      }
    );
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

export const deleteSubmission = async (
  studentId: string,
  assignmentId: string
): Promise<boolean> => {
  try {
    const result = await classroomsService.delete<{ success: boolean }>(
      'submission',
      {
        studentId,
        assignmentId,
      }
    );
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
