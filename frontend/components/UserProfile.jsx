import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '../context/AuthContext';
import { Mail, User, Building, ShieldCheck, UserCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DoorOpen } from 'lucide-react';
import { useInstitution } from '../context/InstitutionContext';

const UserProfile = () => {
  // Retrieve user data from AuthContext
  const { user } = useAuth();
  const { institution } = useInstitution();

  // const user = {
  //   firstName: "Tanay",
  //   lastName: "Gupte",
  //   email: "tanay@gmail.com",
  //   member_of: "12334",
  //   institutionName: "Royal College",
  //   role: "student",
  //   institutionAdminEmail: "smita-nair@gmail.com",
  //   institutionCreatedBy: "Smita Nair",
  //   institutionAvatar: "https://picsum.photos/50",
  // }

  // // Check if user data exists
  // if (!user) {
  //   return <p>No user data found. Please log in.</p>;
  // }
   // Check if user data exists
   if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md p-8 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">No Profile Found</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {/* User Profile Section */}
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl flex items-center gap-2">
                      <User className="h-5 w-5 text-primary-foreground dark:text-primary" />
                      Personal Information
                    </CardTitle>
          </CardHeader>
          <CardContent className="grid py-6 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4 text-primary-foreground dark:text-primary" />
                <span className='font-medium'>Name</span>
              </Label>

              <Input id="name" value={user?.displayName} disabled className="cursor-not-allowed" />
              <p className="text-sm text-muted-foreground">Your full name as registered.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-foreground dark:text-primary" />
                <span>Email</span>
              </Label>
              <Input id="email" value={user?.email} disabled className="cursor-not-allowed" />
              <p className="text-sm text-muted-foreground">Your registered email address.</p>
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button
              variant="destructive"
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </Button>
          </CardFooter>
        </Card>

        {/* Member Of Section */}
        {user?.member_of && institution && (user?.member_of === institution?.inst_id) && (
          <Card className="shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Member Of</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={institution?.logoUrl || "https://via.placeholder.com/50"} alt="Institution Avatar" className="rounded-full" />
                    <AvatarFallback>{user.institutionName ? user.institutionName[0] : ''}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="institutionName" className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-primary-foreground dark:text-primary" />
                      <span>Institution Name</span>
                    </Label>
                    <Input id="institutionName" value={institution?.name} disabled className="cursor-not-allowed" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center space-x-2">
                  <UserCircle className="h-4 w-4 text-primary-foreground dark:text-primary" />
                  <span>Your Role</span>
                </Label>
                <Input id="role" value={user.role} disabled className="cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary-foreground dark:text-primary" />
                  <span>Admin Name</span>
                </Label>
                <Input id="adminEmail" value={institution.createdBy?.displayName} disabled className="cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary-foreground dark:text-primary" />
                  <span>Admin Email</span>
                </Label>
                <Input id="adminEmail" value={institution.createdBy?.email} disabled className="cursor-not-allowed" />
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
            <Button
              variant="destructive"
            >
              <DoorOpen className="h-5 w-5" />
              Leave Institution
            </Button>
          </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;