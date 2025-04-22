import { useState } from "react"
import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FaChevronDown } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useUpdateChannel } from "@/features/channels/api/use-update-channel"
import { useChannelId } from "@/hooks/use-channel-id"
import { toast } from "sonner"
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCurrentMember } from "@/features/members/api/use-current-member"

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps) => {

  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delele this channel. This action is irreversible.",
  );
  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatingChannel } = useUpdateChannel();
  const { mutate: deleteChannel, isPending: deletingChannel } = useRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-")
    setValue(value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel({ id: channelId, name: value }, {
      onSuccess: () => {
        toast.success("Channel name updated");
        setEditOpen(false);
      },
      onError: () => {
        toast.error("Failed to update channel");
      }
    });
  }

  const handleOpen = (value: boolean) => {
    if(member?.role !== "admin") return;
    setEditOpen(value);
  }

  const handleDelete = async () => {
    const ok = await confirm();

    if(!ok) return;

    deleteChannel({ id: channelId }, {
      onSuccess: () => {
        toast.success("Channel deleted");
        router.push(`/workspace/${workspaceId}`)
      },
      onError: () => {
        toast.error("Failed to delete channel");
      }
    })
  }

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden h-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
              # {title}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#126fa3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-left"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Rename this channel
                  </DialogTitle>
                </DialogHeader>
                <form 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <Input 
                    value={value}
                    disabled={updatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. Plan bugget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={updatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={updatingChannel}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button 
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                onClick={handleDelete}
                disabled={deletingChannel}
              >
                <TrashIcon className="size-4"/>
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  )
}