"use client";

import { useState, useCallback } from "react";
import {
  useEligibleStudents,
  usePickWinner,
  useRaffleWinners,
} from "@/app/hooks/raffle/use-raffle";
import { useSettings } from "@/app/hooks/settings/use-settings";
import { IRaffleEligibleStudent } from "@/app/lib/schema/raffle.schema";
import { SlotMachine } from "./_components/slot-machine";
import { ConfettiCelebration } from "./_components/confetti-celebration";
import { WinnersList } from "./_components/winners-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Dices, Users, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function RafflePage() {
  const { data: settingsData, isLoading: settingsLoading, isError: settingsError } = useSettings();
  const { data: eligibleData, isLoading: eligibleLoading } = useEligibleStudents();
  const { data: winnersData, isLoading: winnersLoading } = useRaffleWinners();
  const pickWinnerMutation = usePickWinner();

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<IRaffleEligibleStudent | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const students = eligibleData?.data?.students ?? [];
  const eligibleCount = eligibleData?.data?.total ?? 0;
  const winners = winnersData?.data ?? [];
  const hasActiveEvent = !!settingsData?.data;

  const handleDraw = async () => {
    if (isSpinning || students.length === 0) return;

    setShowConfetti(false);
    setCurrentWinner(null);
    setIsSpinning(true);

    try {
      const result = await pickWinnerMutation.mutateAsync();
      const winner = result.data;
      setCurrentWinner({
        student_number: winner.student_number,
        first_name: winner.first_name,
        last_name: winner.last_name,
        middle_initial: winner.middle_initial,
        department: winner.department,
      });
    } catch {
      setIsSpinning(false);
      toast.error("Failed to pick a winner. Please try again.");
    }
  };

  const handleAnimationComplete = useCallback(() => {
    setIsSpinning(false);
    setShowConfetti(true);
  }, []);

  const handleDismissConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Raffle Draw
            </h2>
            <Dices className="h-6 w-6 text-blue-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Randomly pick a winner from students who logged in to the event.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveEvent && (
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium">
              <Users className="size-3.5" />
              {eligibleLoading ? "..." : eligibleCount} eligible
            </Badge>
          )}
          {winners.length > 0 && (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-medium">
              <Trophy className="size-3.5" />
              {winners.length} winner{winners.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      {settingsLoading ? (
        <Skeleton className="h-[300px] w-full max-w-lg mx-auto rounded-2xl" />
      ) : settingsError ? (
        <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-xl">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold">Connection Error</AlertTitle>
          <AlertDescription className="text-sm">
            Cannot retrieve event settings. Please check your network connection.
          </AlertDescription>
        </Alert>
      ) : !hasActiveEvent ? (
        <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-xl shadow-sm">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold">No Active Event</AlertTitle>
          <AlertDescription className="text-sm">
            Please configure an active event in Settings before starting the raffle.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {/* Slot Machine */}
          <SlotMachine
            students={students}
            winner={currentWinner}
            isSpinning={isSpinning}
            onComplete={handleAnimationComplete}
          />

          {/* Draw Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleDraw}
              disabled={isSpinning || eligibleCount === 0 || eligibleLoading}
              className="px-8 py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Dices className="size-5 mr-2" />
              {isSpinning
                ? "Drawing..."
                : eligibleCount === 0
                  ? "No Eligible Students"
                  : "Draw Winner"}
            </Button>
          </div>

          {/* Winners List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground/90 flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" />
              Winners
            </h3>
            <WinnersList winners={winners} isLoading={winnersLoading} />
          </div>
        </div>
      )}

      {/* Confetti Overlay */}
      <ConfettiCelebration
        winner={currentWinner}
        show={showConfetti}
        onDismiss={handleDismissConfetti}
      />
    </div>
  );
}
