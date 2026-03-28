import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEligibleStudents,
  pickWinners,
  getWinners,
} from "@/app/services/raffle.service";

export const raffleKeys = {
  all: ["raffle"] as const,
  eligible: () => [...raffleKeys.all, "eligible"] as const,
  winners: () => [...raffleKeys.all, "winners"] as const,
};

export function useEligibleStudents() {
  return useQuery({
    queryKey: raffleKeys.eligible(),
    queryFn: getEligibleStudents,
  });
}

export function usePickWinners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pickWinners,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.eligible() });
      queryClient.invalidateQueries({ queryKey: raffleKeys.winners() });
    },
  });
}

export function useRaffleWinners() {
  return useQuery({
    queryKey: raffleKeys.winners(),
    queryFn: getWinners,
  });
}
