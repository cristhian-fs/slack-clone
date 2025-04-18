import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createWorkspaceSchema as renameWorkspaceSchema } from "@/features/workspaces/schemas";
// API
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";

// Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";


interface PreferencesModalProps {
  open: boolean
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  initialValue,
  open,
  setOpen
}: PreferencesModalProps) => {

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, _setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const form = useForm<z.infer<typeof renameWorkspaceSchema>>({
    resolver: zodResolver(renameWorkspaceSchema),
    defaultValues: { name: "" }
  })

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();


  const handleSubmit = (values: z.infer<typeof renameWorkspaceSchema>) => {
    updateWorkspace({ id: workspaceId, name: values.name }, {
      onSuccess: () => {
        setEditOpen(false);
        toast.success("Workspace name updated");
      },
      onError: () => {
        toast.error("Something went wrong");
      }
    })
  }

  const handleRemove = async () => {
    const ok = await confirm();
    if(!ok) return

    removeWorkspace({
      id: workspaceId,
    }, {
      onSuccess: () => {
        toast.success("Workspace removed");
        router.replace('/');
      },
      onError: () => {
        toast.error("Failed to remove workspace");
      }
    })
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="bg-white border-b p-4">
            <DialogTitle>
              {initialValue}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                  </div>
                  <p className="text-sm">{initialValue}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Rename this workspace
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Workspace name e.g. 'Work', 'Home'" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant={"outline"}>Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={isUpdatingWorkspace}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={() => handleRemove()}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4"/>
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
    
  )
}