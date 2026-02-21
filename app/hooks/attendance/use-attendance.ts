import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttendance, getAttendances } from "@/app/services/attendance.service";
import { IGetAttendancesQuery } from "@/app/lib/schema/attendance.schema";

export const attendanceKeys = {
  all: ["attendances"] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (params?: IGetAttendancesQuery) => [...attendanceKeys.lists(), params] as const,
};

export function useAttendances(params?: IGetAttendancesQuery) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendances(params),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
    },
  });
}
