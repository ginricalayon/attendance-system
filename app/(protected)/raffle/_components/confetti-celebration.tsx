"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { IRaffleEligibleStudent } from "@/app/lib/schema/raffle.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface ConfettiCelebrationProps {
  winners: IRaffleEligibleStudent[];
  show: boolean;
  onDismiss: () => void;
}

export function ConfettiCelebration({
  winners,
  show,
  onDismiss,
}: ConfettiCelebrationProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
    });

    frame();
  }, []);

  useEffect(() => {
    if (show && winners.length > 0) {
      fireConfetti();
      const timer = setTimeout(onDismiss, 10000);
      return () => clearTimeout(timer);
    }
  }, [show, winners, fireConfetti, onDismiss]);

  if (!show || winners.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
      onClick={onDismiss}
    >
      <Card className="relative w-full max-w-lg mx-4 border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-blue-500 to-cyan-400 opacity-20 blur-xl" />

        <CardContent className="relative p-8 text-center space-y-5">
          <div className="mx-auto flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
            <Trophy className="size-8 text-white" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {winners.length} Winner{winners.length !== 1 ? "s" : ""}
          </p>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {winners.map((winner, index) => (
              <div
                key={winner.student_number}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-primary/10"
              >
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {index + 1}
                </span>
                <div className="text-left min-w-0">
                  <p className="font-mono text-sm font-bold tracking-wider bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    {winner.student_number}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {winner.first_name} {winner.middle_initial ? `${winner.middle_initial}. ` : ""}
                    {winner.last_name}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {winner.department}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Click anywhere to dismiss
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
