'use client';

import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  DollarSign,
  GraduationCap,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportSection() {
  const [timeRange, setTimeRange] = useState('This Month');

  const summaryData = [
    {
      title: 'Total Students',
      icon: Users,
      value: '2,345',
      change: '+5.2%',
      trend: 'up',
    },
    {
      title: 'Total Courses',
      icon: BookOpen,
      value: '48',
      change: '+2.1%',
      trend: 'up',
    },
    {
      title: 'Graduation Rate',
      icon: GraduationCap,
      value: '94.2%',
      change: '+1.2%',
      trend: 'up',
    },
    {
      title: 'Revenue',
      icon: DollarSign,
      value: '$234,500',
      change: '-2.5%',
      trend: 'down',
    },
  ];

  const enrollmentData = [
    { name: 'Jan', students: 150 },
    { name: 'Feb', students: 180 },
    { name: 'Mar', students: 220 },
    { name: 'Apr', students: 240 },
    { name: 'May', students: 280 },
    { name: 'Jun', students: 310 },
  ];

  const coursePerformanceData = [
    { name: 'Advanced English', rating: 4.8, students: 120 },
    { name: 'IELTS Preparation', rating: 4.6, students: 95 },
    { name: 'Business English', rating: 4.7, students: 85 },
    { name: 'Beginner English', rating: 4.5, students: 150 },
    { name: 'Conversational English', rating: 4.9, students: 70 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold">Reports & Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="This Quarter">This Quarter</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p
                className={`text-xs ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.trend === 'up' ? (
                  <ArrowUp className="inline mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="inline mr-1 h-4 w-4" />
                )}
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment Trends</TabsTrigger>
          <TabsTrigger value="coursePerformance">
            Course Performance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Trends</CardTitle>
              <CardDescription>
                Number of new students enrolled per month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coursePerformance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>
                Average rating and number of students per course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformanceData.map((course, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-[200px]">
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rating: {course.rating}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-blue-100 rounded">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{ width: `${(course.students / 150) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-[100px] text-right">
                      <p className="text-sm font-medium">
                        {course.students} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
