import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function MembersTab({ members, loading, onMemberAction }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Members</CardTitle>
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members?.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(member.joined_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onMemberAction({
                                                    userId: member.id,
                                                    action: 'change-role'
                                                })}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Change Role
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => onMemberAction({
                                                    userId: member.id,
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
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}