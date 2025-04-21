import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createChannelSchema } from "../schemas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal();

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateChannel();
  const form = useForm<z.infer<typeof createChannelSchema>>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
    }
  })

  const handleClose = () => {
    form.reset();
    setOpen(false);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, "-").toLowerCase();

    form.setValue("name", raw);
  };

  const handleSubmit = (values: z.infer<typeof createChannelSchema>) => {
    mutate({
      name: values.name,
      workspaceId
    }, {
      onSuccess: (id) => {
        router.push(`/workspace/${workspaceId}/channel/${id}`);
        toast.success("Channel created successfully");
        handleClose();
      },
      onError: () => {
        toast.error("Failed to create a channel");
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="name"
              control={form.control} 
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Channel name e.g. 'Work', 'Home'"
                      type="text"
                      onChange={handleNameChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full"
            >
              Create channel
            </Button> 
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}