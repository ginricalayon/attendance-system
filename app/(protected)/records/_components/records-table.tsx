"use client";

import { useState } from "react";
import { useAttendances } from "@/app/hooks/attendance/use-attendance";
import { IGetAttendancesQuery } from "@/app/lib/schema/attendance.schema";
import { Departments, EventTypes, OrderBy } from "@/app/lib/schema/enums.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Hash, UserCircle2, Building2, Clock, CalendarDays, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function RecordsTable() {
  const [params, setParams] = useState<IGetAttendancesQuery>({
    page: 1,
    limit: 20,
    search: undefined,
    department: undefined,
    type: undefined,
    sort_by: "created_at",
    order_by: OrderBy.DESC,
  });

  const { data, isLoading, isError } = useAttendances(params);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, search: e.target.value || undefined, page: 1 });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParams({
      ...params,
      department: value === "" ? undefined : (value as any),
      page: 1,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParams({
      ...params,
      type: value === "" ? undefined : (value as any),
      page: 1,
    });
  };

  const records = data?.data || [];
  const pagination = data?.pagination;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/20 border-b border-border/50">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student number, first name, last name..."
            value={params.search || ""}
            onChange={handleSearch}
            className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary/30 transition-shadow rounded-xl"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="relative w-full sm:w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              className="flex h-10 w-full items-center justify-between rounded-xl border border-primary/20 bg-background/50 pl-9 pr-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-shadow cursor-pointer hover:bg-background"
              value={params.department || ""}
              onChange={handleDepartmentChange}
            >
              <option value="">All Depts</option>
              {Object.values(Departments).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
               ▼
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="relative w-full sm:w-[160px]">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              className="flex h-10 w-full items-center justify-between rounded-xl border border-primary/20 bg-background/50 pl-9 pr-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-shadow cursor-pointer hover:bg-background"
              value={params.type || ""}
              onChange={handleTypeChange}
            >
              <option value="">All Types</option>
              {Object.values(EventTypes).map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
               ▼
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b/50 hover:bg-transparent">
              <TableHead className="font-semibold px-4 sm:px-6"><div className="flex items-center gap-2"><Hash className="w-4 h-4 text-muted-foreground hidden sm:block" /> Student Number</div></TableHead>
              <TableHead className="font-semibold"><div className="flex items-center gap-2"><UserCircle2 className="w-4 h-4 text-muted-foreground hidden sm:block" /> Name</div></TableHead>
              <TableHead className="font-semibold hidden md:table-cell"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /> Department</div></TableHead>
              <TableHead className="font-semibold"><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground hidden sm:block" /> Type</div></TableHead>
              <TableHead className="font-semibold pr-4 sm:pr-6 hidden sm:table-cell"><div className="flex items-center gap-2 justify-end"><CalendarDays className="w-4 h-4 text-muted-foreground" /> Timestamp</div></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-b/50">
                  <TableCell className="px-4 sm:px-6 py-4"><Skeleton className="h-5 w-[80px] sm:w-[120px] rounded-md" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-5 w-[120px] sm:w-[180px] rounded-md" /></TableCell>
                  <TableCell className="py-4 hidden md:table-cell"><Skeleton className="h-5 w-[60px] rounded-md" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-[60px] sm:w-[80px] rounded-full" /></TableCell>
                  <TableCell className="text-right pr-4 sm:pr-6 py-4 hidden sm:table-cell"><Skeleton className="h-5 w-[120px] sm:w-[160px] rounded-md ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-destructive">
                    There was an error loading the attendance records.
                  </TableCell>
                </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="w-8 h-8 opacity-20 mb-2" />
                    <p>No records found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record: any) => (
                <TableRow key={record.attendance_id} className="group border-b/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs sm:text-sm px-4 sm:px-6 font-medium text-muted-foreground group-hover:text-foreground transition-colors">{record.student_number}</TableCell>
                  <TableCell className="font-semibold text-foreground/90 text-sm">
                    {record.last_name}, {record.first_name} {record.middle_initial ? `${record.middle_initial}.` : ""}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground border border-secondary transition-colors justify-center min-w-[3rem]">
                      {record.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-semibold capitalize border tracking-wide text-xs",
                        record.type === 'login'
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                      )}
                    >
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4 sm:pr-6 font-medium text-muted-foreground hidden sm:table-cell">
                    {formatDate(record.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-muted/10 border-t border-border/50">
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            Page {pagination.page} of {pagination.total_pages} <span className="opacity-70">({pagination.total} total)</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParams({ ...params, page: params.page - 1 })}
              disabled={!pagination.has_previous_page || isLoading}
              className="rounded-lg hover:bg-background"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParams({ ...params, page: params.page + 1 })}
              disabled={!pagination.has_next_page || isLoading}
              className="rounded-lg hover:bg-background"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
