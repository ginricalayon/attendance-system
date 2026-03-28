"use client";

import { useEffect, useRef, useState } from "react";
import { IRaffleEligibleStudent } from "@/app/lib/schema/raffle.schema";

interface SlotMachineProps {
  students: IRaffleEligibleStudent[];
  winner: IRaffleEligibleStudent | null;
  isSpinning: boolean;
  onComplete: () => void;
  winnerLabel?: string;
}

export function SlotMachine({
  students,
  winner,
  isSpinning,
  onComplete,
  winnerLabel,
}: SlotMachineProps) {
  const [displayedStudent, setDisplayedStudent] =
    useState<IRaffleEligibleStudent | null>(null);
  const [landed, setLanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const studentsRef = useRef(students);
  const onCompleteRef = useRef(onComplete);

  // Keep refs in sync without restarting effects
  studentsRef.current = students;
  onCompleteRef.current = onComplete;

  // Spin fast while waiting for the winner
  useEffect(() => {
    if (!isSpinning || studentsRef.current.length === 0) return;

    setLanded(false);

    const cycle = () => {
      const list = studentsRef.current;
      if (list.length === 0) return;
      const randomIndex = Math.floor(Math.random() * list.length);
      setDisplayedStudent(list[randomIndex]);
      intervalRef.current = setTimeout(cycle, 60);
    };

    intervalRef.current = setTimeout(cycle, 60);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // Only react to isSpinning toggling on/off
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  // When winner arrives while spinning, decelerate and land
  useEffect(() => {
    if (!winner || !isSpinning) return;

    // Clear fast spin
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    let step = 0;
    const totalSteps = 3;

    const decelerate = () => {
      step++;
      const speed = 40 + (step / totalSteps) * 100;

      if (step < totalSteps) {
        const list = studentsRef.current;
        if (list.length > 0) {
          const randomIndex = Math.floor(Math.random() * list.length);
          setDisplayedStudent(list[randomIndex]);
        }
        intervalRef.current = setTimeout(decelerate, speed);
      } else {
        // Land on the winner
        setDisplayedStudent(winner);
        setLanded(true);
        onCompleteRef.current();
      }
    };

    intervalRef.current = setTimeout(decelerate, 40);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // Only react to a new winner arriving
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const student = displayedStudent;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effect */}
      <div
        className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-blue-500 to-cyan-400 opacity-20 blur-xl transition-opacity duration-500 ${
          isSpinning ? "opacity-60 animate-pulse" : ""
        }`}
      />

      {/* Main container */}
      <div className="relative rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-muted/30">
          <div className="size-3 rounded-full bg-red-500/80" />
          <div className="size-3 rounded-full bg-yellow-500/80" />
          <div className="size-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs font-mono text-muted-foreground tracking-wider">
            {winnerLabel ? `raffle://draw — ${winnerLabel}` : "raffle://draw"}
          </span>
        </div>

        {/* Display window */}
        <div className="p-8 min-h-[200px] flex flex-col items-center justify-center">
          {student ? (
            <div
              className={`text-center space-y-3 transition-all duration-150 ${
                isSpinning && !landed
                  ? "scale-95 opacity-90"
                  : "scale-100 opacity-100"
              }`}
            >
              <p
                className={`font-mono text-3xl sm:text-4xl font-bold tracking-widest ${
                  landed
                    ? "bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent"
                    : "text-foreground"
                }`}
              >
                {student.student_number}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-foreground/80">
                {student.last_name}, {student.first_name}
                {student.middle_initial ? ` ${student.middle_initial}.` : ""}
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                {student.department}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="font-mono text-2xl text-muted-foreground/50 tracking-wider">
                {">"} READY_
              </p>
              <p className="text-sm text-muted-foreground">
                Press draw to start the raffle
              </p>
            </div>
          )}
        </div>

        {/* Bottom scanner line effect when spinning */}
        {isSpinning && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        )}
      </div>
    </div>
  );
}
