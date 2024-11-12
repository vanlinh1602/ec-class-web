'use client';

import './globals.css';

import { Bell, BookOpen, Home, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div
            className={`bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold">English Center</h1>
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
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/classrooms"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Classrooms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/homework"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Homework
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 md:ml-64">
            <header className="bg-white shadow-sm">
              <div className="flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="flex items-center space-x-4">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full max-w-sm"
                  />
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
