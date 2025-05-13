//hooks & utils
import { useAuth } from '@/context/AuthContext'; // Assuming you have an auth context
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

//icons
import { UserPlus, GraduationCap, ChevronDown } from 'lucide-react';

//ui-components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function InstitutionDetailsDialog({ institution, open, onOpenChange }) {
  if (!institution) return null;

  const { user, userToken, showAuthError } = useAuth(); // Assuming user and userToken are available here
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // State to manage selected role
  const { toast } = useToast();

  // Mutation to join waiting lobby
  const { mutateAsync: joinWaitingLobby, isLoading: isJoining } = useMutation({
    mutationFn: async (role) => {
      const response = await axios.post(
        `/api/institutions/${institution.id}/join-waiting-lobby`,
        {
          role_requested: role,
          form_responses: {}, // Add the form responses if needed
        }
      );
      return response.data; // Return the response for handling success
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully joined waiting lobby as ${data.role_requested} for ${institution.name}`,
        variant: "default",
      });

      onOpenChange(false); // Close the dialog after successful join
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to join waiting lobby.",
        variant: "destructive",
      });
      console.error("Error joining waiting lobby:", error);
    },
  });

  const handleJoin = async () => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role to join.",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      await joinWaitingLobby(selectedRole); //Trigger Mutation
    } else {
      showAuthError();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{institution.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={institution.logoUrl} alt={`${institution.name} logo`} />
            <AvatarFallback className="text-4xl">
              {institution.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-center text-muted-foreground mb-2">
            {institution.description || "No description available."}
          </p>
          <div className="flex gap-4 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1" disabled={isJoining}>
                  {selectedRole ? `Join as ${selectedRole}` : "Select Role"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedRole('teacher')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Teacher
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole('student')}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              className="flex-1" 
              onClick={handleJoin}
              isLoading={isJoining} // Loading state for the button
              disabled={isJoining || !selectedRole} // Disable while request is in progress or no role selected
            >
              Join
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-red-600 text-center">{error}</p> // Display error if any
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}