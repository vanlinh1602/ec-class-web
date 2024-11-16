'use client';

import { Calendar, Clock, FileText, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Submitted';
  classId: number;
  className: string;
}

export default function AssignmentDetail() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the assignment data from an API
    // For this example, we'll use mock data
    const mockAssignment: Assignment = {
      id: 1,
      title: 'Essay on English Literature',
      description:
        'Write a 1000-word essay on your favorite English novel, discussing its themes, characters, and impact on literature.',
      dueDate: '2023-06-30',
      status: 'Not Started',
      classId: 1,
      className: 'English 101',
    };

    setAssignment(mockAssignment);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the submission and files to your backend
    // Update assignment status
    if (assignment) {
      setAssignment({ ...assignment, status: 'Submitted' });
    }
  };

  if (!assignment) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>
              Assignment for {assignment.className}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due: {assignment.dueDate}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Status: {assignment.status}
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Assignment Description
              </h2>
              <p>{assignment.description}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="submission">Your Submission</Label>
                <Textarea
                  id="submission"
                  placeholder="Type your answer here..."
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  className="mt-1"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="file-upload">Attach Files or Images</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Attached Files:</h3>
                  <ul className="space-y-1">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="submit" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Submit Assignment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
