import { useState } from "react";
import { ChevronDown, ChevronUp, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WaitingLobby({ requests, loading, onRequestAction }) {
    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const toggleExpand = (requestId) => {
        setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px]">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-[73px] w-full" />
                            ))}
                        </div>
                    ) : (
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
                                {requests?.map(request => (
                                    <>
                                        <TableRow
                                            key={`${request.request_id} - ${request.created_at}`}
                                            onClick={() => toggleExpand(request.request_id)}
                                            className="cursor-pointer"
                                        >
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
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}