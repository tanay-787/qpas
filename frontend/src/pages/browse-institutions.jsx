//hooks & utils
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import { useAuth } from "../context/AuthContext";
import { useInstitution } from "@/context/InstitutionContext";
import axios from "axios";

//icons
import { Search, Ellipsis, Plus, UserPlus } from "lucide-react";

//ui-components
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import JoinStepper from "@/components/stepper-form/join-stepper";
import CreateInstitutionDialog from "@/components/create-institution-dialog";


// Function to fetch all institutions
const fetchInstitutions = async () => {
  try {
    const response = await axios.get("/api/institutions/");
    // Add a check/warning if createdBy might be missing details
    if (response.data && response.data.length > 0 && typeof response.data[0].createdBy === 'string') {
      console.warn("fetchInstitutions: createdBy field seems to be an ID, not an object. DisplayName might be missing.");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch institutions:", error);
    throw new Error("Failed to fetch institutions: " + (error.response?.data?.message || error.message));
  }
};

export default function BrowseInstitutions() {
  const { user } = useAuth();
  const { institution } = useInstitution();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinStepperOpen, setIsJoinStepperOpen] = useState(false);
  const [joiningInstitution, setJoiningInstitution] = useState(null);
  const { isLoggedIn, showAuthError } = useAuth();
  const queryClient = useQueryClient(); // Get query client for error retry

  // Fetch institutions using React Query
  const { data: institutions, isLoading, error } = useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions,
  });


  // Filter institutions based on search query
  const filteredInstitutions = institutions
    ?.filter((institution) =>
      institution.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // --- Handlers (remain the same) ---
  const handleCreateInstitution = () => {
    if (isLoggedIn) {
      setIsCreateDialogOpen(true);
    } else {
      showAuthError();
    }
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleJoinInstitutionClick = (institution) => {
    if (isLoggedIn) {
      setJoiningInstitution(institution);
      setIsJoinStepperOpen(true);
    } else {
      showAuthError();
    }
  };

  const handleJoinStepperClose = () => {
    setIsJoinStepperOpen(false);
    setJoiningInstitution(null);
  };

  // Function to retry fetching
  const retryFetch = () => {
    queryClient.invalidateQueries({ queryKey: ['institutions'] });
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
      {/* Header Section (remains the same) */}
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Browse Institutions</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Discover and connect with educational institutions from around the world.
        </p>
      </div>

      {/* Search Bar and Create Button Row (remains the same) */}
      <div className="flex max-w-2xl mx-auto gap-3 sm:gap-4 mb-10 md:mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
          <Input
            type="text"
            placeholder="Search institutions by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 sm:h-12 text-base"
          />
        </div>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCreateInstitution} disabled={!user || user.member_of} className="h-11 sm:h-12 px-4 sm:px-5 shrink-0">
                <Plus className="w-5 h-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark:bg-foreground">
              <p>Create your own institution</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Loading State (remains the same) */}
      {isLoading && (
        <div className="text-center py-16">
          {/* ... loading indicator ... */}
          <Ellipsis className="h-12 w-12 animate-pulse mx-auto text-primary/80" />
          <p className="mt-4 text-lg text-muted-foreground">Loading institutions...</p>
        </div>
      )}

      {/* Error State (Updated retry button) */}
      {error && (
        <div className="text-center py-16">
          <div className="max-w-lg mx-auto p-6 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-destructive font-medium mb-1">Failed to load institutions</p>
            <p className="text-destructive/80 text-sm mb-4">{error.message}</p>
            <Button variant="destructive" onClick={retryFetch}> {/* Use invalidateQueries */}
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Institutions Grid */}
      {!isLoading && !error && institutions && (
        // Adjusted gap for potentially wider cards
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInstitutions.map((institution) => (
            // NEW CARD LAYOUT START
            <Card
              key={institution.inst_id}
              className="w-full hover:shadow-lg transition-shadow duration-300 border hover:border-primary/20 bg-card flex items-center p-4 space-x-4" // Use flex, center items vertically, add padding & spacing
            >
              {/* 1. Logo */}
              <Avatar className="h-12 w-12 shrink-0"> {/* Fixed size, prevent shrinking */}
                <AvatarImage src={institution.logoUrl || undefined} alt={`${institution.name} logo`} />
                <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                  {institution.name?.substring(0, 2).toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>

              {/* 2. Text Content */}
              <div className="flex-grow overflow-hidden"> {/* Allow text area to grow, hide overflow */}
                <h3 className="text-base font-semibold leading-tight truncate" title={institution.name}> {/* Truncate long names */}
                  {institution.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate"> {/* Truncate long creator names */}
                  Created by: {institution.createdBy?.displayName || 'Unknown User'}
                </p>
              </div>

              {/* 3. Join Button (Icon) */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost" // Or "outline"
                      className="shrink-0 text-muted-foreground hover:text-primary" // Prevent shrinking, style
                      onClick={() => handleJoinInstitutionClick(institution)}
                      aria-label={`Join ${institution.name}`} // Accessibility label
                      disabled={!user || user.member_of}
                    >
                      <UserPlus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join Institution</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>
          ))}
        </div>
      )}

      {/* No Results State (remains the same) */}
      {!isLoading && !error && filteredInstitutions.length === 0 && (
        <div className="text-center py-16">
          {/* ... no results message ... */}
          <p className="text-lg text-muted-foreground">
            {searchQuery ? "No institutions found matching your search." : "No institutions available yet."}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateInstitution} className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Create New Institution
            </Button>
          )}
        </div>
      )}

      {/* Dialogs (remain the same) */}
      <CreateInstitutionDialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogClose} />
      {joiningInstitution && (
        <JoinStepper open={isJoinStepperOpen} onOpenChange={handleJoinStepperClose} institution={joiningInstitution} />
      )}
    </div>


  );
}