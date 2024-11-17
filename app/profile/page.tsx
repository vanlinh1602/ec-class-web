'use client';

import _ from 'lodash';
import {
  Briefcase,
  Calendar,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Save,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

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
import Waiting from '@/components/Waiting';
import { useUserStore } from '@/features/user/hooks';
import { User } from '@/features/user/types';

export default function UserProfile() {
  const { user, handling, updateInfo } = useUserStore(
    useShallow((state) => ({
      handling: state.handling,
      user: state.user,
      updateInfo: state.updateInfo,
    }))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<User>>();

  const handleSave = () => {
    setIsEditing(false);
    updateInfo(editedData!);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      {handling ? <Waiting /> : null}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">Profile Information</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(true);
                  setEditedData({ ...user });
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
          <CardDescription>
            View and manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              {isEditing ? (
                <Input
                  name="name"
                  value={editedData?.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user?.name}</h2>
              )}
              <p className="text-muted-foreground">
                {_.upperFirst(user?.role)}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              {isEditing ? (
                <Input
                  name="phone"
                  value={editedData?.phone}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{user?.phone || 'No phone number provided'}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span>{_.upperFirst(user?.role)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Joined {moment(user?.createdAt).format('DD/MM/YYYY')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              {isEditing ? (
                <Input
                  name="address"
                  value={editedData?.address}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{user?.address || 'No location provided'}</span>
              )}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter>
            <Button onClick={handleSave} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
