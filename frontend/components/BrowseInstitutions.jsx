import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const fetchInstitutions = async () => {
  const response = await fetch('/api/institutions/');
  if (!response.ok) {
    throw new Error('Failed to fetch institutions');
  }
  return response.json();
};

export default function BrowseInstitutions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['institutions'],
    queryFn: fetchInstitutions,
  });

  if (isLoading) {
    return <div className="text-center">Loading institutions...</div>;
  }

  if (error) {
    return <div className="text-center text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Institutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((institution) => (
          <Card key={institution.id}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={institution.logoUrl} alt={`${institution.name} logo`} />
                  <AvatarFallback>{institution.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center mb-2">{institution.name}</h2>
                <p className="text-sm text-muted-foreground text-center">Created by: {institution.createdBy.displayName}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

