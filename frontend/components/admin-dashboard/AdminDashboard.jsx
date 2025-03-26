// Hooks & utilities
import { useState } from "react";
import { useInstitution } from "../../context/InstitutionContext";
import { useMutation, useQuery } from "@tanstack/react-query";

// UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Components
import WaitingLobbyTab from "./WaitingLobbyTab";
import MembersTab from "./ManageMembersTab";
import ApplicationFormTab from "./ApplicationFormTab";
import InstitutionProfileTab from "./InstitutionProfileTab";
import { fetchMembers, fetchWaitingLobbyRequests, updateTeacherRequestStatus } from "./admin-utility";

export default function AdminDashboard() {
    const { institution, updateInstitution } = useInstitution();

    // Fetch waiting lobby requests
    const { 
        data: waitingLobbyRequests, 
        isLoading: loadingRequests,
        refetch: refetchRequests
    } = useQuery({
        queryKey: ["waiting-lobby-requests", institution?.inst_id],
        queryFn: async () => await fetchWaitingLobbyRequests(institution?.inst_id),
        enabled: !!(institution?.inst_id)
    });

    // Fetch current members
    const { 
        data: members, 
        isLoading: loadingMembers,
        refetch: refetchMembers
    } = useQuery({
        queryKey: ['institution-members', institution?.inst_id],
        queryFn: async () => await fetchMembers(institution?.inst_id),
        enabled: !!(institution?.inst_id)
    });

    // Mutation for request actions
    const { mutate: handleRequestAction } = useMutation({
        mutationFn: async ({ requestId, action }) => updateTeacherRequestStatus(institution?.inst_id, requestId, action),
        onSuccess: () => refetchRequests() && refetchMembers()
    });

    // Mutation for member actions
    const { mutate: handleMemberAction } = useMutation({
        mutationFn: async ({ userId, action }) => modifyMemberStatus(institution?.inst_id, userId, action),
        onSuccess: () => refetchMembers()
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Institution: {institution?.name}</Badge>
              <Badge variant="outline">Admin: {institution?.createdBy?.displayName}</Badge>
            </div>
          </div>
    
          <Tabs defaultValue="requests" className="space-y-6">
            <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="requests">Waiting Lobby ({waitingLobbyRequests?.length || 0})</TabsTrigger>
              <TabsTrigger value="members">Members ({members?.length || 0})</TabsTrigger>
              <TabsTrigger value="application-form">Application Form</TabsTrigger>
              <TabsTrigger value="profile">Institution Settings</TabsTrigger>
            </TabsList>
            </div>
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