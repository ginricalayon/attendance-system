"use client";

import { useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { IEvent } from "@/app/lib/schema/event.schema";
import { useEvents } from "@/app/hooks/events/use-events";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventTableProps {
  onEdit: (event: IEvent & { event_id: string }) => void;
  onDelete: (event: IEvent & { event_id: string }) => void;
}

export function EventTable({ onEdit, onDelete }: EventTableProps) {
  const { data: events, isLoading, isError } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 border-b border-border/50">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary/30 transition-shadow rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1.5 h-11 rounded-xl bg-primary/10 text-primary font-semibold border-none flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total Events: {events?.length || 0}
          </Badge>
        </div>
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b/50 hover:bg-transparent">
              <TableHead className="font-semibold px-6">Event Name</TableHead>
              <TableHead className="font-semibold md:table-cell hidden">Description</TableHead>
              <TableHead className="font-semibold">Created On</TableHead>
              <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="px-6 py-4"><Skeleton className="h-6 w-48 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4 md:table-cell hidden"><Skeleton className="h-4 w-64 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                  <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-destructive space-y-3">
                    <AlertCircle className="w-12 h-12 opacity-50" />
                    <p className="font-medium text-lg">Failed to load events data</p>
                    <p className="text-sm opacity-70">Please check your network connection and try again.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEvents?.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <Calendar className="w-12 h-12 opacity-20" />
                    <p className="font-medium text-lg text-foreground/70">No events found</p>
                    {searchTerm && <p className="text-sm">We couldn't find any events matching "{searchTerm}"</p>}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents?.map((event) => (
                <TableRow 
                  key={event.event_id} 
                  className="group border-b/50 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium px-6 text-foreground/90">
                    {event.name}
                  </TableCell>
                  <TableCell className="md:table-cell hidden text-muted-foreground max-w-xs truncate">
                    {event.description || <span className="italic opacity-50">No description provided</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium text-foreground/80 py-1 bg-background">
                      {event.created_at ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(event.created_at)) : 'Unknown Date'}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => onEdit(event)} className="cursor-pointer gap-2 py-2">
                          <Edit className="h-4 w-4 text-blue-500" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2 py-2"
                          onClick={() => onDelete(event)}
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
    </div>
  );
}
