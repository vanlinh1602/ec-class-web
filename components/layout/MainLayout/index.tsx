'use client';
import { onAuthStateChanged } from 'firebase/auth';
import { Home, LogOut, Menu, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/features/user/hooks';
import { auth } from '@/lib/firebase';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const pathName = usePathname();
  const [currentTab, setCurrentTab] = useState('/');
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, login, singOut } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      role: state.role,
      login: state.login,
      singOut: state.signOut,
    }))
  );

  const activeTab = useMemo(() => {
    const tab = pathName.split('/')[1];
    return tab;
  }, [pathName]);

  useEffect(() => {
    if (!user && activeTab !== 'login') {
      router.push('/login');
      setCurrentTab(pathName);
    }
    return onAuthStateChanged(auth, (userData) => {
      if (userData) {
        login();
      }
    });
  }, [activeTab]);

  useEffect(() => {
    if (user && activeTab === 'login') {
      router.push(currentTab);
    }
  }, [user]);

  if (activeTab === 'login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">English Center</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  activeTab === '' ? 'text-primary' : ''
                }`}
              >
                <Home className="mr-2 h-5 w-5" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="/classrooms"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  activeTab === 'classrooms' ? 'text-primary' : ''
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Classrooms
              </Link>
            </li>
            <li>
              <Link
                href="/chat"
                className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                  activeTab === 'chat' ? 'text-primary' : ''
                }`}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Ai Chat
              </Link>
            </li>
            {/* <li>
              <Link
                href="/homework"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Homework
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex md:ml-64 flex-col overflow-hidden">
        <header className="flex items-center justify-end px-6 py-4 bg-white border-b h-16">
          <div className="flex items-center justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              {/* <Input
                type="search"
                placeholder="Search..."
                className="w-full max-w-sm"
              /> */}
              {/* <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt="User" />
                      <AvatarFallback>
                        {user?.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={async () => {
                      await singOut();
                      router.replace('/login');
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-scroll bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
