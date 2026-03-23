"use client";

import { useAttendances } from "@/app/hooks/attendance/use-attendance";
import { OrderBy } from "@/app/lib/schema/enums.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, History } from "lucide-react";

export function AttendanceList() {
  const { data, isLoading } = useAttendances({
    page: 1,
    limit: 15,
    sort_by: "created_at",
    order_by: OrderBy.DESC,
  });

  const attendances = data?.data || [];

  return (
    <Card className="h-full rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl flex flex-col overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <History className="w-5 h-5 text-blue-500" />
            </div>
            Live Feed
          </CardTitle>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold tracking-wide uppercase border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time
          </div>
        </div>
        <CardDescription className="pt-2 text-sm">
          Chronological list of the most recent scans across the system.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="w-full">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur-sm z-10">
              <TableRow className="border-b border-border/50 hover:bg-transparent">
                <TableHead className="w-[100px] sm:w-[120px] font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">ID Number</TableHead>
                <TableHead className="text-right font-semibold pr-4 sm:pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i} className="border-b/50">
                    <TableCell><Skeleton className="h-5 w-[60px] sm:w-[80px] rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[100px] sm:w-[140px] rounded-md" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-[90px] rounded-md" /></TableCell>
                    <TableCell className="text-right pr-4 sm:pr-6"><Skeleton className="h-6 w-[50px] sm:w-[70px] ml-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground w-full py-8">
                       <Clock className="w-8 h-8 mb-3 opacity-20" />
                       <p className="font-medium">Waiting for first scan...</p>
                       <p className="text-xs opacity-70 mt-1">Attendance records will appear here.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((record, index) => (
                  <TableRow 
                    key={`${record.student_number}-${index}`}
                    className="group border-b/50 hover:bg-muted/40 transition-colors cursor-default"
                  >
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums flex items-center h-full">
                      <Clock className="w-3 h-3 mr-1.5 opacity-50 hidden sm:block" />
                      {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground/90 text-sm">
                      {record.last_name}, {record.first_name} {record.middle_initial ? `${record.middle_initial}.` : ""}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground hidden md:table-cell">
                      {record.student_number}
                    </TableCell>
                    <TableCell className="text-right pr-4 sm:pr-6">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-colors
                        ${record.type === 'login' 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/25' 
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/25'
                      }`}>
                        {record.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
