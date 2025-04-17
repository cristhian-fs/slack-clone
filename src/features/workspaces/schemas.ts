import * as z from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, {
    message: "3 or more characters required"
  })
})