import { useState } from "react";
import { ChevronDown, ChevronUp, UserCheck, UserX, Pencil, Trash2 } from "lucide-react";
import { useInstitution } from "../context/InstitutionContext";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import FormBuilder from "./FormStructureBuilder";
import axios from "axios";

import WaitingLobbyTab from "./admin-tabs/WaitingLobbyTab";
import MembersTab from "./admin-tabs/MembersTab";
import ApplicationFormTab from "./admin-tabs/ApplicationFormTab";
import InstitutionProfileTab from "./admin-tabs/InstitutionProfileTab";

export default function AdminDashboard() {
    const { user } = useAuth();
    const { institution, updateInstitution } = useInstitution();
    const [expandedRequestId, setExpandedRequestId] = useState(null); // Track expanded row

    // Fetch waiting lobby requests
    const { 
        data: waitingLobbyRequests, 
        isLoading: loadingRequests,
        refetch: refetchRequests
    } = useQuery({
        queryKey: ["waiting-lobby-requests", institution?.inst_id],
        queryFn: async () => {
            const response = await axios.get(`/api/waiting-lobby/${institution.inst_id}/teachers`);
            return response.data;
        },
        enabled: !!(institution?.inst_id)
    });

    // Fetch current members
    const { 
        data: members, 
        isLoading: loadingMembers,
        refetch: refetchMembers
    } = useQuery({
        queryKey: ['institution-members'],
        queryFn: () => {
            let response = [];
            response = institution?.teacher_list;
            return response;
        },
        enabled: !!institution
    });

    // Mutation for request actions
    const { mutate: handleRequestAction } = useMutation({
        mutationFn: async ({ requestId, action }) => {
            const response = await axios.post(`/api/waiting-lobby/${institution.inst_id}/requests/${requestId}/${action}`);
            return response.data;
        },
        onSuccess: () => refetchRequests()
    });

    // Mutation for member actions
    const { mutate: handleMemberAction } = useMutation({
        mutationFn: async ({ userId, action }) => {
            const response = await axios.post(`/api/members/${userId}/${action}`);
            return response.data;
        },
        onSuccess: () => refetchMembers()
    });

    // Toggle expanded row
    const toggleExpand = (requestId) => {
        setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Institution: {institution?.name}</Badge>
              <Badge variant="outline">Admin: {user?.displayName}</Badge>
            </div>
          </div>
    
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList>
              <TabsTrigger value="requests">Waiting Lobby ({waitingLobbyRequests?.length || 0})</TabsTrigger>
              <TabsTrigger value="members">Members ({members?.length || 0})</TabsTrigger>
              <TabsTrigger value="application-form">Application Form</TabsTrigger>
              <TabsTrigger value="profile">Institution Settings</TabsTrigger>
            </TabsList>
    
            <TabsContent value="requests">
              <WaitingLobbyTab
                requests={waitingLobbyRequests}
                loading={loadingRequests}
                onRequestAction={handleRequestAction}
              />
            </TabsContent>
    
            <TabsContent value="members">
              <MembersTab
                members={members}
                loading={loadingMembers}
                onMemberAction={handleMemberAction}
              />
            </TabsContent>
    
            <TabsContent value="application-form">
              <ApplicationFormTab />
            </TabsContent>
    
            <TabsContent value="profile">
              <InstitutionProfileTab
                institution={institution}
                onUpdate={updateInstitution}
              />
            </TabsContent>
          </Tabs>
        </div>
      );
}