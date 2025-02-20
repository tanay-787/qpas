import { useState } from "react";
import { useInstitution } from "../context/InstitutionContext";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

import WaitingLobbyTab from "./admin-tabs/WaitingLobbyTab";
import QuestionPaperView from "./teacher-tabs/QuestionPaperView";
import QuestionPaperCreate from "./teacher-tabs/QuestionPaperCreate";
import QuestionPaperManage from "./teacher-tabs/QuestionPaperManage";
import InstitutionMembers from "./admin-tabs/InstitutionMembers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TDSidebar from "./TDSidebar";

//Implement SideBar here

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { institution, updateInstitution } = useInstitution();
  const [activeKey, setActiveKey] = useState("waiting-lobby");

  // Fetch waiting lobby requests
  const {
    data: waitingLobbyRequests,
    isLoading: loadingRequests,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["waiting-lobby-requests", institution?.inst_id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/waiting-lobby/${institution.inst_id}/students`,
      );
      return response.data;
    },
    enabled: !!institution?.inst_id,
  });

  // Fetch current members
  const {
    data: members,
    isLoading: loadingMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["institution-members", institution?.inst_id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/institutions/${institution.inst_id}/members/students`,
      );
      return response.data;
    },
    enabled: !!institution?.inst_id,
  });

  // Mutation for request actions
  const { mutate: handleRequestAction } = useMutation({
    mutationFn: async ({ requestId, action }) => {
      const response = await axios.patch(
        `/api/waiting-lobby/${institution.inst_id}/students/${requestId}/${action}`,
      );
      return response.data;
    },
    onSuccess: () => refetchRequests() && refetchMembers(),
  });

  // Mutation for member actions
  const { mutate: handleMemberAction } = useMutation({
    mutationFn: async ({ userId, action }) => {
      const response = await axios.post(`/api/members/${userId}/${action}`);
      return response.data;
    },
    onSuccess: () => refetchMembers(),
  });

  const {
    data: questionPapers,
    isLoading: fetchingPapers,
    refetch: refetchPapers,
    isSuccess: papersFetched,
  } = useQuery({
    queryFn: async () => {
      const response = await axios.get(`/api/question-papers/public`);
      return response.data.questionPapers;
    },
    queryKey: ["questionPapers"],
  });

  const renderContent = () => {
    console.log(activeKey);
    switch (activeKey) {
      case "waiting-lobby":
        return (
          <WaitingLobbyTab
            requests={waitingLobbyRequests}
            loading={loadingRequests}
            onRequestAction={handleRequestAction}
          />
        );
      case "view-qp":
        return (
          <QuestionPaperView
            questionPapers={questionPapers}
            loading={fetchingPapers}
            refetch={refetchPapers}
          />
        );
      case "create-qp":
        return <QuestionPaperCreate />;
      case "manage-qp":
        return <QuestionPaperManage />;
      case "institution-members":
        return <InstitutionMembers />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider className="">
      <TDSidebar
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        className=""
      />
      <main className="w-full p-6">
        <SidebarTrigger />
        {renderContent()}
      </main>
    </SidebarProvider>
  );
}
