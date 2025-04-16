import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Local components
import { Form, 
  FormControl, 
  FormMessage, 
  FormField,
  FormItem
} from "@/components/ui/form";

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardTitle,
  CardHeader
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SignInFlow } from "../types"
import { signUpSchema } from '../schemas';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          Sign up to continue
        </CardTitle>
        <CardDescription>
          User your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
      <Form {...form}>
          <form  
            className="space-y-2.5"
            onSubmit={form.handleSubmit(() => {})}
          >
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Confirm password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={false}>
              Continue
            </Button>
          </form>
        </Form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          > 
            <FcGoogle className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
            Continue with google
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          > 
            <FaGithub className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}   
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}