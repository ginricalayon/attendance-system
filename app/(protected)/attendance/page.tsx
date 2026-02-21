"use client";

import { useSettings } from "@/app/hooks/settings/use-settings";
import { AttendanceScanner } from "./_components/attendance-scanner";
import { AttendanceList } from "./_components/attendance-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarRange, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePage() {
  const { data: settingsData, isLoading, isError } = useSettings();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Live Attendance
            </h2>
            <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">
            Scan student IDs to securely record attendance in real-time.
          </p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        
        {/* Left Column: Event Context & Scanner */}
        <div className="col-span-1 xl:col-span-5 flex flex-col space-y-8">
          {isLoading ? (
            <Skeleton className="h-[140px] w-full rounded-2xl" />
          ) : isError ? (
            <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-xl">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-base font-semibold">Connection Error</AlertTitle>
              <AlertDescription className="text-sm">Cannot retrieve the active event settings. Please check your network connection.</AlertDescription>
            </Alert>
          ) : !settingsData?.data ? (
            <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-xl shadow-sm">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-base font-semibold">No Active Event</AlertTitle>
              <AlertDescription className="text-sm">
                There is currently no event configured for attendance. A system administrator needs to initialize an event from the Settings page before scanning can begin.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="group relative overflow-hidden rounded-2xl border bg-card/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:bg-card/80 hover:shadow-md">
              <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100 dark:from-primary/5 dark:to-blue-500/5" />
              <div className="relative flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                  <CalendarRange className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <h3 className="font-semibold leading-none tracking-tight text-foreground/90">
                    Active Event
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-2xl font-bold tracking-tight">{settingsData.data.name}</p>
                    {settingsData.data.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{settingsData.data.description}</p>
                    )}
                    <div className="pt-2">
                       <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold tracking-wider text-primary ring-1 ring-inset ring-primary/20 uppercase transition-all hover:bg-primary/20 hover:scale-105 cursor-default">
                         Recording {settingsData.data.type}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <AttendanceScanner disabled={!settingsData?.data} />
          </div>
        </div>
        
        {/* Right Column: Attendance Feed */}
        <div className="col-span-1 xl:col-span-7 h-full min-h-[500px]">
          <AttendanceList />
        </div>
      </div>
    </div>
  );
}
