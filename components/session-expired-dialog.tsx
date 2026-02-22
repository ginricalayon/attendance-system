"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export function SessionExpiredDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
      <AlertDialogContent className="w-[380px] rounded-2xl">
        <AlertDialogHeader>
          <div className="mx-auto mt-4 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-bold">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Your login session has expired. For your security, please log in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center mt-6 mb-2">
          <AlertDialogAction 
            onClick={handleLoginClick}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-11"
          >
            Go to Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
