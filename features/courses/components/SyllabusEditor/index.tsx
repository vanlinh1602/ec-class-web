'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  week: z.string(),
  description: z.string(),
});

type Syllabus = {
  week: number;
  description: string;
};

type Props = {
  initialData?: Syllabus;
  onCancel: () => void;
  onSave: (data: Syllabus) => void;
};

export default function SyllabusEditor({
  initialData,
  onCancel,
  onSave,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      onSave({
        week: parseInt(values.week),
        description: values.description,
      });
      form.reset();
    } catch (error) {
      console.error('Form submission error', error);
    }
  }

  useEffect(() => {
    if (initialData) {
      form.setValue('week', initialData.week.toString());
      form.setValue('description', initialData.description);
    }
  }, [initialData]);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Syllabus Editor</DialogTitle>
          <DialogDescription>
            Enter the details of the course here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week</FormLabel>
                  <FormControl>
                    <Input placeholder="Week" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Input week</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Learn something"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Input discription</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
