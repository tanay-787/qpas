import { useState } from "react";
import { ChevronDown, ChevronUp, UserCheck, UserX, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WaitingLobbyTab({ requests, loading, onRequestAction, onRefresh }) {
    const [expandedRequestId, setExpandedRequestId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const toggleExpand = (requestId) => {
        setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
    };

    // Handle refresh with minimum loading time
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();

        // Ensure loading state shows for at least 500ms for better UX
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    // Empty state component with refresh button
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
                <InboxIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No pending requests</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
                When users request to join this institution, they will appear here for approval.
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
        </div>
    );

    // Determine if we should show loading state
    const showLoading = loading || isRefreshing;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Pending Requests</span>
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
                <ScrollArea className="h-[600px]">
                    {showLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-[73px] w-full" />
                            ))}
                        </div>
                    ) : requests?.length > 0 ? (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role Requested</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Existing table content */}
                                {requests?.map(request => (
                                    <>
                                        <TableRow
                                            key={request.request_id}
                                            onClick={() => toggleExpand(request.request_id)}
                                            className="cursor-pointer"
                                        >
                                            {/* Existing row content */}
                                            <TableCell>
                                                {expandedRequestId === request.request_id ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </TableCell>
                                            <TableCell>{request.user.displayName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {request.role_requested}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="flex space-x-2">
                                                {/* Existing buttons */}
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRequestAction({
                                                            requestId: request.request_id,
                                                            action: 'approve'
                                                        });
                                                    }}
                                                >
                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRequestAction({
                                                            requestId: request.request_id,
                                                            action: 'reject'
                                                        });
                                                    }}
                                                >
                                                    <UserX className="mr-2 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                            </TableCell>
                                        </TableRow>
                                        {/* Expanded row content */}
                                        {expandedRequestId === request.request_id && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <div className="p-4 rounded-lg">
                                                        <h3 className="font-semibold mb-2">Form Responses</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {request.form_responses.map((response, index) => (
                                                                <div key={index} className="space-y-1">
                                                                    <Label className="font-medium">
                                                                        {response.field_id}
                                                                    </Label>
                                                                    <Input
                                                                        value={response.value}
                                                                        readOnly
                                                                        className="bg-muted"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
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