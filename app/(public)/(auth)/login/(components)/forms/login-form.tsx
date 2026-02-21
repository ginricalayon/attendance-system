"use client";

import { useAuth } from "@/app/hooks/auth/use-auth";
import { LoginFormData, loginSchema } from "@/app/schema/forms/auth";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

function SearchParamHandler({ setError }: { setError: (msg: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("expired") === "true") {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams, setError]);

  return null;
}

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
        setError(err.message || "Invalid credentials. Please try again.");
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
        <React.Suspense fallback={null}>
          <SearchParamHandler setError={setError} />
        </React.Suspense>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {error && (
            <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80 font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      type="email" 
                      autoCapitalize="none" 
                      autoComplete="email" 
                      autoCorrect="off" 
                      disabled={isPending}
                      className="h-12 rounded-xl border-border bg-background/50 px-4 transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 shadow-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between pb-1">
                    <FormLabel className="text-foreground/80 font-semibold">Password</FormLabel>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={isPending}
                      className="h-12 rounded-xl border-border bg-background/50 px-4 transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 shadow-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="remember_me"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-1 pb-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    className="rounded-md border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl font-bold tracking-wide shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-[0.98]" 
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {isPending ? "Authenticating..." : "Log in to Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
