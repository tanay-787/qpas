//ui-components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

//icons
import { ChevronRight } from "lucide-react";
import { Users } from "lucide-react";
import { FileQuestion } from "lucide-react";
import { Clock } from "lucide-react";
import { Building2 } from "lucide-react";

//hooks
import { useInstitution } from "@/context/InstitutionContext";

export default function TDSidebar({ activeKey, setActiveKey }) {
  const { institution } = useInstitution();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              {/* Add logo of institution */}
              <Building2 className=" h-4 w-4" />
              <span>{institution?.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                key="waiting-lobby"
                onClick={() => setActiveKey("waiting-lobby")}
                className={activeKey === "waiting-lobby" ? "active" : ""}
              >
                <SidebarMenuButton
                  isActive={activeKey === "waiting-lobby"}
                  onClick={() => setActiveKey("waiting-lobby")}
                >
                  <Clock className=" h-4 w-4" />
                  <span>Waiting Lobby</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={
                        activeKey === "view-qp" ||
                        activeKey === "create-qp" ||
                        activeKey === "manage-qp"
                      }
                    >
                      <FileQuestion className=" h-4 w-4" />
                      <span>Question Papers</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="view-qp">
                        <SidebarMenuSubButton
                          isActive={activeKey === "view-qp"}
                          onClick={() => setActiveKey("view-qp")}
                        >
                          View
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="create-qp">
                        <SidebarMenuSubButton
                          isActive={activeKey === "create-qp"}
                          onClick={() => setActiveKey("create-qp")}
                        >
                          Create
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="manage-qp">
                        <SidebarMenuSubButton
                          isActive={activeKey === "manage-qp"}
                          onClick={() => setActiveKey("manage-qp")}
                        >
                          Manage
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              <SidebarMenuItem
                key="institution-members"
                onClick={() => setActiveKey("institution-members")}
                className={activeKey === "institution-members" ? "active" : ""}
              >
                <SidebarMenuButton
                  isActive={activeKey === "institution-members"}
                  onClick={() => setActiveKey("institution-members")}
                >
                  <Users className="h-4 w-4" />
                  <span>Institution Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
