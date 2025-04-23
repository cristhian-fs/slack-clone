"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberPage = () => {

  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({
      memberId,
      workspaceId
    }, {
      onSuccess(data) {
        setConversationId(data);
      },
      onError(){
        toast.error("Failed to get or create the conversation");
      }
    })
  }, [memberId, workspaceId, mutate]);

  if(isPending){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col-gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if(!conversationId){
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center flex-col-gap-2">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    )
  }

  return ( 
    <Conversation 
      id={conversationId}
    />
   );
}
 
export default MemberPage;