import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Quill from "quill";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateMessage } from "../api/use-create-message";
import { useGetMessage } from "../api/use-get-message";
import { useGetMessages } from "../api/use-get-messages";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface ThreadsProps {
  onClose: () => void;
  messageId: Id<"messages">;
}

type CreateMessageValues = {
  channelId: Id<"channels">,
  workspaceId: Id<"workspaces">,
  parentMessageId: Id<"messages">,
  body: string,
  image: Id<"_storage"> | undefined,
}

const formatDateLabel = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if(isToday(date)) return "Today";
  if(isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

const TIME_THRESHOLD = 5;

export const Thread = ({ 
  messageId,
  onClose
}: ThreadsProps) => {

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
  const { loadMore, results, status } = useGetMessages({
    channelId,
    parentMessageId: messageId
  })

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = async ({body, image}: { body: string, image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined
      }

      if(image){
        const url = await generateUploadUrl({}, {throwError: true});

        if(!url){
          throw new Error("URL not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if(!result.ok){
          throw new Error("Failed to upload image")
        }

        const { storageId } = await result.json();

        values.image = storageId
      } 

      await createMessage(values, {
        throwError: true,
      })

      setEditorKey((prev) => prev + 1);
    } catch {
      toast.error("Failed to send message");
    } finally{
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  }

  const groupedMessages = results?.reduce(
      (groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if(!groups[dateKey]){
          groups[dateKey] = [];
        }
        groups[dateKey].unshift(message)
        return groups
      },
      {} as Record<string, typeof results>
    )

  if(loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <Loader className="animate-spin size-6 text-muted-foreground" />
        </div>
      </div>
    )
  }

  if(!message){
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">
            Message not found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onClose}
        >
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto  messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => { 
              
              const prevMessage = messages[index - 1]
              const isCompact = 
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD

              return (
                <Message 
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimestamp={message.threadTimestamp}
                />
              )
            })}
          </div>
        ))}
        <div 
          className="h-1"
          ref={(el) => {
            if(el){
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if(entry.isIntersecting && canLoadMore){
                    loadMore();
                  }
                }
              )
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin"/>
            </span>
          </div>
        )}
        <Message 
          hideThreadButton
          body={message.body}
          createdAt={message._creationTime}
          id={message._id}
          image={message.image}
          isAuthor={message.memberId === currentMember?._id}
          isEditing={editingId === message._id}
          memberId={message.memberId}
          reactions={message.reactions}
          setEditingId={setEditingId}
          updatedAt={message.updatedAt}
          authorImage={message.user.image}
          authorName={message.user.name}
          isCompact={false}
          key={message._id}
        />
      </div>
      <div className="px-4">
        <Editor 
          onSubmit={handleSubmit}
          innerRef={editorRef}
          key={editorKey}
          disabled={isPending}
          placeholder="Reply..."
        />
      </div>
    </div>
  )
}