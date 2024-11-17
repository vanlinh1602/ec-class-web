import { getAuth, signOut as logOut } from 'firebase/auth';

import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import formatError from '@/lib/formatError';
import { usersService } from '@/services';

import { User } from './types';

export const login = async (): Promise<{
  user: User;
  role: string;
} | null> => {
  try {
    const user = getAuth().currentUser;
    const data: Partial<User> = {
      email: user?.email || '',
      // name: user?.displayName || '',
      avatar: user?.photoURL || '',
      // phone: user?.phoneNumber || '',
    };
    const token = await user?.getIdToken();
    const result = await usersService.post<{
      user: User;
      role: string;
    }>('/auth', {
      token,
      user: data,
      server: 'client',
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

export const updateUser = async (
  id: string,
  role: string,
  user: Partial<User>
): Promise<boolean> => {
  try {
    const result = await usersService.put<{ success: boolean }>('/update', {
      id,
      user,
      role,
      server: 'client',
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

export const signOut = async (): Promise<void> => {
  try {
    await logOut(auth);
    await usersService.post<{ success: boolean }>('/signOut');
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
  }
};
