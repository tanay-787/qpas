import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Mail, User, Building, ShieldCheck, UserCircle, Trash2, DoorOpen } from 'lucide-react';
import axios from "axios";

import { useAuth } from '../context/AuthContext';
import { useInstitution } from '../context/InstitutionContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";


const UserProfile = () => {
  const { user, logout } = useAuth();
  const { institution } = useInstitution();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  const makeRequest = async (url, successMessage) => {
    try {
      setLoading(true);
      const res = await axios.delete(url);
      toast.success(successMessage); // 🔄 replaced alert
  
      if (url.includes("delete-user-profile")) {
        await firebaseSignOut(getAuth());
        toast.success("Signed out successfully.");
        navigate("/");
      }
  
      if (url.includes("delete-institution") || url.includes("leave-institution")) {
        navigate("/");
      }
  
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message); // 🔄 replaced alert
    } finally {
      setLoading(false);
    }
  };
  
  
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
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {/* Personal Info */}
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
                <User className="h-4 w-4" />
                <span className='font-medium'>Name</span>
              </Label>
              <Input id="name" value={user?.displayName} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input id="email" value={user?.email} disabled />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your user account will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => makeRequest("/api/profile/delete-user-profile", "Account deleted successfully.")}
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        {/* Institution Info */}
        {user?.member_of && institution && user?.member_of === institution?.inst_id && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Member Of</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={institution?.logoUrl || "https://via.placeholder.com/50"} />
                  <AvatarFallback>{institution?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Label htmlFor="institutionName" className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Institution Name</span>
                  </Label>
                  <Input id="institutionName" value={institution?.name} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center space-x-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Your Role</span>
                </Label>
                <Input id="role" value={user.role} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Admin Name</span>
                </Label>
                <Input id="adminName" value={institution.createdBy?.displayName} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Admin Email</span>
                </Label>
                <Input id="adminEmail" value={institution.createdBy?.email} disabled />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* Leave Institution Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={loading}>
                    <DoorOpen className="h-5 w-5 mr-2" />
                    Leave Institution
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will no longer be associated with this institution. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    variant="destructive"
                      onClick={() => makeRequest("/api/profile/leave-institution", "Left institution successfully.")}
                    >
                      Yes, leave institution
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Delete Institution Button (for Admin only) */}
              {user.role === 'admin' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete Institution
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the institution and all associated data. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => makeRequest("/api/profile/delete-institution", "Institution deleted successfully.")}
                      >
                        Yes, delete institution
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
