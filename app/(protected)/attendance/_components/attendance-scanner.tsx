"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateAttendance } from "@/app/hooks/attendance/use-attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, ScanLine } from "lucide-react";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

export function AttendanceScanner({ disabled }: { disabled: boolean }) {
  const [studentNumber, setStudentNumber] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const { mutate: createAttendance, isPending } = useCreateAttendance();
  const [isFocused, setIsFocused] = useState(false);

  // Auto-focus logic
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleScan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentNumber || isPending || disabled) return;

    setStatus({ type: null, message: "" });

    createAttendance(
      { student_number: studentNumber },
      {
        onSuccess: (response) => {
          setStatus({
            type: "success",
            message: `Recorded ${response.data.first_name} ${response.data.last_name}`,
          });
          setStudentNumber("");
          setTimeout(() => inputRef.current?.focus(), 100);
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setStatus(prev => prev.type === "success" ? { type: null, message: "" } : prev);
          }, 3000);
        },
        onError: (error) => {
          let errorMsg = "Failed to record attendance";
          if (error instanceof AxiosError && error.response?.data?.error) {
             const errData = error.response.data.error;
             errorMsg = typeof errData === 'string' ? errData : (errData.message || JSON.stringify(errData));
          } else if (error instanceof Error) {
             errorMsg = error.message;
          }
          
          if (typeof errorMsg !== "string") {
             errorMsg = JSON.stringify(errorMsg);
          }

          setStatus({
            type: "error",
            message: String(errorMsg),
          });
          setStudentNumber("");
          setTimeout(() => inputRef.current?.focus(), 100);
        },
      }
    );
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 shadow-lg transition-all duration-500 rounded-2xl",
      isFocused && !disabled ? "border-primary shadow-primary/20" : "border-border",
      disabled && "opacity-60"
    )}>
      {/* Decorative scanner beam animation */}
      {isFocused && !disabled && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className={cn(
             "p-2 rounded-lg transition-colors",
             isFocused ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <ScanLine className={cn("w-6 h-6", isFocused && "animate-pulse")} />
          </div>
          Scanner Input
        </CardTitle>
        <CardDescription className="text-sm">
          Awaiting input from barcode scanner
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleScan} className="flex flex-col gap-6">
          <div className="relative group">
            <Label htmlFor="scanner-input" className="sr-only">Barcode Scanner Input</Label>
            <div className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 to-blue-500/30 blur-md transition-opacity duration-300",
              isFocused ? "opacity-100" : "opacity-0"
            )} />
            <Input
              id="scanner-input"
              ref={inputRef}
              type="text"
              placeholder="Scan barcode now..."
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              disabled={disabled || isPending}
              autoComplete="off"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "relative text-center text-2xl tracking-widest font-mono py-8 rounded-xl border-2 transition-all duration-300",
                isFocused 
                  ? "border-primary bg-background shadow-inner ring-4 ring-primary/10 placeholder:text-muted-foreground/50" 
                  : "bg-muted/30 border-muted placeholder:text-muted-foreground/70"
              )}
            />
            {isPending && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="h-16 flex items-center justify-center">
            {status.type === "success" && (
              <div className="flex w-full items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="font-medium">{status.message}</p>
              </div>
            )}

            {status.type === "error" && (
              <div className="flex w-full items-center gap-3 rounded-xl bg-destructive/10 px-4 py-3 text-destructive border border-destructive/20 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="font-medium text-sm">{status.message}</p>
              </div>
            )}
            
            {!status.type && isFocused && !isPending && (
              <p className="text-sm font-medium text-primary/70 animate-pulse flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Ready to scan
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
