import { useState } from "react";
import { Pencil, Trash2, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageMembersTab({ members, loading, onMemberAction, onRefresh }) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Handle refresh with minimum loading time
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();

        // Ensure loading state shows for at least 500ms for better UX
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    // Determine if we should show loading state
    const showLoading = loading || isRefreshing;

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No members yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
                When users join this institution, they will appear here for management.
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={showLoading}
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${showLoading ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Current Members</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={showLoading}
                        className="ml-2 h-8 w-8"
                    >
                        <RefreshCw className={`h-4 w-4 ${showLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[100vh] w-100">
                    {showLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-[73px] w-full" />
                            ))}
                        </div>
                    ) : members?.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members?.map(member => (
                                    <TableRow key={member.uid}>
                                        <TableCell>{member.displayName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {member.email}
                                        </TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => onMemberAction({
                                                    userId: member.uid,
                                                    action: 'remove'
                                                })}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState />
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}