'use client';

import {
  Bell,
  BookOpen,
  Calendar,
  Layout,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-2xl font-bold text-primary">
            English Center
          </span>
        </div>
        <nav className="flex-grow">
          {[
            'Dashboard',
            // 'Schedule',
            'Courses',
            'Classrooms',
            'Students',
            'Teachers',
            'Reports',
            // 'Revenue',
          ].map((item) => (
            <Link
              href={item === 'Dashboard' ? '/' : `/${item.toLowerCase()}`}
              key={item}
              className={`flex items-center px-6 py-3 text-gray-700 w-full ${
                activeTab === item ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item === 'Dashboard' && <Layout className="mr-3 h-5 w-5" />}
              {item === 'Students' && <Users className="mr-3 h-5 w-5" />}
              {item === 'Courses' && <BookOpen className="mr-3 h-5 w-5" />}
              {item === 'Teachers' && <Users className="mr-3 h-5 w-5" />}
              {item === 'Schedule' && <Calendar className="mr-3 h-5 w-5" />}
              {item === 'Reports' && <Layout className="mr-3 h-5 w-5" />}
              {item === 'Classrooms' && <Layout className="mr-3 h-5 w-5" />}
              {item === 'Revenue' && <Layout className="mr-3 h-5 w-5" />}
              {item}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/07/24/15884296/d36e559a0a718d050fc2c911fa3d3365_8529512733030822447.png"
                      alt="User"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};
