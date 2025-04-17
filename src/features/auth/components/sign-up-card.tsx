"use client";

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react"

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
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {

  const [error, setError] = useState<string | undefined>("")
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  const { signIn } = useAuthActions()

  const handleProviderSignIn = (value: "github" | "google") => {
    signIn(value);
  }

  const handleCredentialsSignIn = (values: z.infer<typeof signUpSchema>) => {
    
    const { success } = signUpSchema.safeParse(values);

    if(!success) {
      setError("Invalid credentials")
      return
    }

    signIn("password", {
      name: values.name,
      email: values.email,
      password: values.password,
      flow: "signUp"
    }).catch((error) => setError(error.message))
  }

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
            onSubmit={form.handleSubmit(handleCredentialsSignIn)}
          >
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Full name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {!!error && (
              <div className="bg-destructive/15 flex items-center justify-start p-3 rounded-md gap-1 text-destructive text-sm">
                <TriangleAlert className='size-4' />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={false}>
              Continue
            </Button>
          </form>
        </Form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => handleProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          > 
            <FcGoogle className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
            Continue with google
          </Button>
          <Button
            disabled={false}
            onClick={() => handleProviderSignIn('github')}
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