import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGetMember } from "../api/use-get-member";

import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-user";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">
  onClose: () => void;
}

export const Profile = ({
  memberId,
  onClose
}: ProfileProps) => {

  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [RemoveDialog, removeConfirm] = useConfirm(
    "Are you sure you want to remove this member?",
    "This action cannot be undone.",
  );
  const [LeaveDialog, leaveConfirm] = useConfirm(
    "Are you sure you want to leave this workspace?",
    "This action cannot be undone.",
  );
  const [UpdateRoleDialog, updateRoleConfirm] = useConfirm(
    "Are you sure you want to update this member's role?",
    "This action cannot be undone.",
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
    workspaceId
  })
  const { data: member, isLoading: isMemberLoading } = useGetMember({id: memberId});

  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember();

  const onLeave = async () => {
    const ok = await leaveConfirm();

    if(!ok) return;

    removeMember({id: memberId}, {
      onSuccess(){
        toast.success("Left workspace");
        onClose();
        router.replace("/");
      },
      onError(){
        toast.error("Failed to leave workspace");
      }
    });
  }
  const onRemove = async () => {
    const ok = await removeConfirm();

    if(!ok) return;

    removeMember({ id: memberId }, {
      onSuccess(){
        toast.success("Member removed");
        onClose();
      },
      onError(){
        toast.error("Failed to remove member");
      }
    });
  }

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await updateRoleConfirm();

    if(!ok) return;

    updateMember({ id: memberId, role }, {
      onSuccess(){
        toast.success("Member's role updated");
        onClose();
      },
      onError(){
        toast.error("Failed to update member's role");
      }
    });
  }

  if(isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
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

  if(!member){
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
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
            No members available
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <RemoveDialog />
      <UpdateRoleDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user?.image} alt={member.user?.name} />
            <AvatarFallback className="aspect-square text-6xl">
              {member.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" && 
            currentMember?._id !== memberId ? (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isUpdatingMember} className="w-full shrink capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) => onUpdate(role as "admin" | "member")}
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  onClick={onRemove}
                  disabled={isRemovingMember}
                  variant="outline" 
                  className="w-full shrink"
                >
                  Remove
                </Button>
              </div>
            ) : currentMember?._id === memberId &&
              currentMember?.role !== "admin" ? (
                <div className="mt-4">
                  <Button
                    onClick={onLeave}
                    disabled={isRemovingMember}
                    variant="outline" 
                    className="w-full"
                  >
                    Leave
                  </Button>
                </div>
              ): null
          }
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">Email adress</p>
              <Link 
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}