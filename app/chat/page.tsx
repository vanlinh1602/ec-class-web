'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { createMessage, Message } from '../../lib/ai';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    setMessages([
      ...messages,
      { content: input, role: 'user' },
      { content: 'Typing...', role: 'system' },
    ]);
    setInput('');
    createMessage(input, messages).then((result) => {
      const newMessages: Message[] = [
        ...messages,
        { content: input, role: 'user' },
        { content: result, role: 'system' },
      ];
      setMessages(newMessages);
    });
  };

  return (
    <div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with AI Assistant</CardTitle>
          <CardDescription>
            Ask questions or practice your English with our AI tutor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 mb-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role !== 'user' && (
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="AI Avatar"
                    />
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <Markdown className="text-sm" remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </div>
                {message.role === 'user' && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="User Avatar"
                    />
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="space-x-2">
          <Input
            id="message"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button type="submit" size="icon" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
