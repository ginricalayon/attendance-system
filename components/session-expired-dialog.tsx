"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LockKeyhole } from "lucide-react";

export function SessionExpiredDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginClick = () => {
    setIsOpen(false);
    
    // Use window.location instead of router.push to force a full reload 
    // and clear out any stale React Query cache or client state.
    window.location.href = "/login?expired=true";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[340px] rounded-[16px] p-5 sm:max-w-[380px] sm:p-6">
        <AlertDialogHeader className="flex flex-row items-start gap-4 space-y-0 relative text-left">
          <div className="flex shrink-0 mt-0.5 h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
            <LockKeyhole className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1.5">
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">
              Session Expired
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-snug text-muted-foreground">
              Your connection timed out. Please log in again.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4 sm:justify-end">
          <AlertDialogAction 
            onClick={handleLoginClick}
            className="w-full sm:w-auto rounded-lg h-9 px-4 text-sm font-medium transition-all"
          >
            Log in again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
