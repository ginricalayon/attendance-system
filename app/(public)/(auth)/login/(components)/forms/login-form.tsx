"use client";

import { useAuth } from "@/app/hooks/auth/use-auth";
import { LoginFormData, loginSchema } from "@/app/schema/forms/auth";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsPending(true);
    try {
      await login(data);
    } catch (err: any) {
      if (err instanceof Error) {
        // Firebase or API errors
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    type="email" 
                    autoCapitalize="none" 
                    autoComplete="email" 
                    autoCorrect="off" 
                    disabled={isPending}
                    {...field} 
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium leading-none text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    disabled={isPending}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remember_me"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2 pb-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}
