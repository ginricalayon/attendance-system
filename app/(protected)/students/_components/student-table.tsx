"use client";

import { useState } from "react";
import { useStudents } from "@/app/hooks/students/use-students";
import { IGetStudentsQuery } from "@/app/lib/schema/student.schema";
import { DBCollections, OrderBy } from "@/app/lib/schema/enums.schema";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search, Filter, Hash, UserCircle2, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  onEdit: (student: any) => void;
  onDelete: (student: any) => void;
}

export function StudentTable({ onEdit, onDelete }: StudentTableProps) {
  const [params, setParams] = useState<IGetStudentsQuery>({
    page: 1,
    limit: 10,
    search: undefined,
    department: undefined,
    sort_by: "created_at",
    order_by: OrderBy.DESC,
  });

  const { data, isLoading, isError } = useStudents(params);

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

  const students = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 border-b border-border/50">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student number, first name, last name..."
            value={params.search || ""}
            onChange={handleSearch}
            className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary/30 transition-shadow rounded-xl"
          />
        </div>
        <div className="relative w-full md:max-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            className="flex h-10 w-full items-center justify-between rounded-xl border border-primary/20 bg-background/50 pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-shadow cursor-pointer hover:bg-background"
            value={params.department || ""}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            <option value="CCS">CCS</option>
            <option value="COE">COE</option>
            <option value="CBAA">CBAA</option>
            <option value="COHM">COHM</option>
            <option value="SHS">SHS</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
             <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground h-4 w-4"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </div>
        </div>
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b/50 hover:bg-transparent">
              <TableHead className="font-semibold px-6"><div className="flex items-center gap-2"><Hash className="w-4 h-4 text-muted-foreground" /> Student Number</div></TableHead>
              <TableHead className="font-semibold"><div className="flex items-center gap-2"><UserCircle2 className="w-4 h-4 text-muted-foreground" /> Name</div></TableHead>
              <TableHead className="font-semibold"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /> Department</div></TableHead>
              <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b/50">
                  <TableCell className="px-6"><Skeleton className="h-5 w-[120px] rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[180px] rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[90px] rounded-md" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <UserCircle2 className="w-8 h-8 opacity-20 mb-2" />
                    <p>No students found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student: any) => (
                <TableRow key={student.student_number} className="group border-b/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm px-6 font-medium text-muted-foreground group-hover:text-foreground transition-colors">{student.student_number}</TableCell>
                  <TableCell className="font-semibold text-foreground/90">
                    {student.last_name}, {student.first_name} {student.middle_initial ? `${student.middle_initial}.` : ""}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground border border-secondary transition-colors group-hover:bg-secondary justify-center min-w-[3rem]">
                      {student.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-lg border-primary/10">
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase opacity-80">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(student)} className="cursor-pointer gap-2 py-2">
                          <Pencil className="h-4 w-4 text-blue-500" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2 py-2"
                          onClick={() => onDelete(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border/50">
          <div className="text-sm text-muted-foreground font-medium">
            Page {pagination.page} of {pagination.total_pages} <span className="opacity-70">({pagination.total} total)</span>
          </div>
          <div className="space-x-2">
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
