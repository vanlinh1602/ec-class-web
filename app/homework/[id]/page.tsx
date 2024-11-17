'use client';

import { Calendar, FileText, Upload, X } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

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
import Waiting from '@/components/Waiting';
import { useClassroomStore } from '@/features/classroom/hooks';
import { Submission } from '@/features/classroom/types';
import { useUserStore } from '@/features/user/hooks';
import { toast } from '@/hooks/use-toast';
import { PATH_UPLOADS } from '@/lib/config';

export default function AssignmentDetail() {
  const [submission, setSubmission] = useState('');
  const [editSubmission, setEditSubmission] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { id } = useParams<{ id: string }>();
  const [assignmentId, classId] = id.split('-');
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const {
    handling,
    assignments,
    submissions,
    classes,
    createSubmission,
    getClassroomes,
    getAssignments,
    getSubmissions,
  } = useClassroomStore(
    useShallow((state) => ({
      handling: state.handling,
      classes: state.classes,
      assignments: state.assignments,
      submissions: state.submissions,
      getClassroomes: state.getClasses,
      getSubmissions: state.getSubmissions,
      getAssignments: state.getAssignments,
      createSubmission: state.createSubmission,
    }))
  );

  const homeWork = useMemo(
    () => assignments?.[classId]?.find((assign) => assign.id === assignmentId),
    [assignments, classId]
  );

  const classroom = useMemo(() => classes[classId], [classes, classId]);

  const userSubmission = useMemo(
    () => submissions[assignmentId]?.find((sub) => sub.studentId === user?.id),
    [submissions, assignmentId, user]
  );

  useEffect(() => {
    if (!classroom) {
      getClassroomes();
    }
    if (!assignments[classId]) {
      getAssignments(classId);
    }
    if (!submissions[assignmentId]) {
      getSubmissions(assignmentId);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!files.length) {
      toast({
        title: 'Error',
        description: 'Please attach a file to submit',
        variant: 'destructive',
      });
      return;
    }
    const data: Partial<Submission> = {
      studentId: user?.id,
      assignmentId,
      submission,
    };
    createSubmission(data, files);
  };

  return (
    <div>
      {handling ? <Waiting /> : null}
      <div className="mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{homeWork?.title}</CardTitle>
            <CardDescription>Assignment for {classroom?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due: {moment(homeWork?.dueDate).format('DD/MM/YYYY')}
              </Badge>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Assignment Description
              </h2>
              <p>{homeWork?.description}</p>
            </div>
            {!userSubmission || editSubmission ? (
              <div className="space-y-2">
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
                  <Label htmlFor="file-upload">
                    Attach Files or Images (Max 1)
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    disabled={files.length >= 1}
                    onChange={handleFileChange}
                    className="mt-1"
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
                <div className="flex space-x-2">
                  {editSubmission ? (
                    <Button
                      type="submit"
                      className="w-full"
                      variant="destructive"
                      onClick={() => setEditSubmission(false)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold">Your Submission</h3>
                <p>{userSubmission?.submission}</p>
                {userSubmission?.path && (
                  <li
                    key={userSubmission?.path}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Submited
                    </span>
                    <a
                      href={`${PATH_UPLOADS}/${userSubmission.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </li>
                )}
                <Button
                  onClick={() => {
                    setEditSubmission(true);
                    setSubmission(userSubmission?.submission || '');
                  }}
                  className="w-full"
                >
                  Edit Submission
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
