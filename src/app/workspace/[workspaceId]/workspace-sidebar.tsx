import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Hash, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { UserItem } from "./user-item";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar = () => {

  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const {data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const {data: workspace, isLoading: workspaceLoading } = useGetWorkspace({id: workspaceId});
  const { data: channels} = useGetChannels({ workspaceId});
  const { data: members } = useGetMembers({ workspaceId});

  // channel modal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateChannelModal();

  if(memberLoading || workspaceLoading){
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="text-white size-4 animate-spin"/>
      </div>
    )
  };

  if(!member || !workspace){
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="text-white size-4 "/>
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  };

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
      <div className="flex flex-col px-2 mt-3 gap-0.5">
        <SidebarItem 
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant="active"
        />
        <SidebarItem 
          label="Drafts & Sent"
          icon={SendHorizonal}
          id="drafts"
        />
      </div>
      <WorkspaceSection
          label="Channels"
          hint="Create a new channel"
          onNew={
            member.role === "admin" ? () => setOpen(true) : undefined}
        >
          {channels?.map((item) => (
            <SidebarItem 
              key={item._id}
              id={item._id}
              label={item.name}
              icon={Hash}
              variant={channelId === item._id ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>
        <WorkspaceSection
          label="Direct messages"
          hint="New direct message"
        >
          {members?.map((item) => (
            <UserItem 
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>
        
    </div>
  )
}