"use client";

import { IRaffleWinner } from "@/app/lib/schema/raffle.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface WinnersListProps {
  winners: IRaffleWinner[];
  isLoading: boolean;
}

export function WinnersList({ winners, isLoading }: WinnersListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="size-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No winners yet</p>
        <p className="text-xs text-muted-foreground/60">
          Draw a winner to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Student Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Department</TableHead>
            <TableHead className="hidden md:table-cell">Won At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {winners.map((winner, index) => (
            <TableRow key={winner.winner_id} className="hover:bg-primary/5">
              <TableCell className="text-center font-mono text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-mono font-medium">
                {winner.student_number}
              </TableCell>
              <TableCell>
                {winner.last_name}, {winner.first_name}
                {winner.middle_initial ? ` ${winner.middle_initial}.` : ""}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {winner.department}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {new Date(winner.won_at).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
