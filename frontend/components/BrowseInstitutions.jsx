import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import NavBar from './shared-components/NavBar';
import { InstitutionDetailsDialog } from './institution-details-dialog';
import CreateInstitutionDialog from './create-institution-dialog';
import { useAuth } from '../context/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from 'axios';

const fetchInstitutions = async () => {
  try {
    const response = await axios.get('/api/institutions/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch institutions: ' + error.message);
  }
};

export default function BrowseInstitutions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isLoggedIn, showAuthError } = useAuth();


  const { data, isLoading, error } = useQuery({
    queryKey: ['institutions'],
    queryFn: fetchInstitutions,
  });

  const handleInstitutionClick = (institution) => {
    setSelectedInstitution(institution);
  };

  const handleCloseDialog = () => {
    setSelectedInstitution(null);
  };

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

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Browse Institutions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover and connect with educational institutions from around the world
          </p>

          {/* Search Bar and Create Button */}
          <div className="flex max-w-2xl mx-auto gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />

              {/* Input with placeholder visible only on small screens */}
              <Input
                type="text"
                placeholder="Search institutions by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 hidden sm:block"
              />

              {/* Input without placeholder visible on larger screens */}
              <Input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 sm:hidden"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCreateInstitution}
                    className="h-12 px-6"
                  >
                    <Plus className="w-7 h-7" />
                    <p className='hidden sm:block'>Create</p>
                  </Button>
                </TooltipTrigger>
                {!isLoggedIn && (
                  <TooltipContent>
                    <p>Create your own institution</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Building2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Loading institutions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto p-4 bg-destructive/10 rounded-lg">
              <p className="text-destructive">Error: {error.message}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Institutions Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.filter(institution =>
              institution.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((institution) => (
              <Card
                key={institution.inst_id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleInstitutionClick(institution)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4 ring-2 ring-primary/10">
                      <AvatarImage
                        src={institution.logoUrl}
                        alt={`${institution.name} logo`}
                      />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {institution.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold text-center mb-2">
                      {institution.name}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center">
                      Created by: {institution.createdBy.displayName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && data?.filter(institution =>
          institution.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No institutions found matching your search.
              </p>
            </div>
          )}

        {/* Institution Details Dialog */}
        <InstitutionDetailsDialog
          institution={selectedInstitution}
          open={!!selectedInstitution}
          onOpenChange={handleCloseDialog}
        />

        {/* Create Institution Dialog */}
        <CreateInstitutionDialog
          open={isCreateDialogOpen}
          onOpenChange={handleCreateDialogClose}
        />
      </div>
    </div>
  );
}

