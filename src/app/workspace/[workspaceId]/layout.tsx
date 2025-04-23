"use client";

import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Thread } from "@/features/messages/components/thread";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { Profile } from "@/features/members/components/profile";

interface WorkspaceIdLayoutProps{ 
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children } : WorkspaceIdLayoutProps) => {

  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return ( 
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup 
          direction="horizontal"
          autoSaveId="slack-clone-workspace-layout"  
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            maxSize={40}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread 
                    onClose={onClose}
                    messageId={parentMessageId as Id<"messages">}
                  />
                ): profileMemberId ? (
                  <Profile 
                    memberId={profileMemberId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground"/>
                  </div>
                )}
              </ResizablePanel>
            </>
            
          )}
        </ResizablePanelGroup>
      </div>
    </div>
   );
}
 
export default WorkspaceIdLayout;