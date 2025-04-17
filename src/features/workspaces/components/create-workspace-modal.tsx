import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "../schemas";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();
  const { mutate } = useCreateWorkspace()

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" }
  })

  const handleClose = () => {
    setOpen(false);
    form.reset();
  }

  const handleCreateWorkspace = (values: z.infer<typeof createWorkspaceSchema>) => {
    mutate({ name: values.name }, {
      onSuccess: (data) => {
        router.push(`/workspace/${data}`);
        handleClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a workspace
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateWorkspace)} className="space-y-6">
            <FormField
              name="name"
              control={form.control} 
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Workspace name e.g. 'Work', 'Home'"
                      type="text"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create workspace</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}