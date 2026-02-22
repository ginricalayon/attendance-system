import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getResult } from "@/app/services/result.service";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";

export interface DepartmentResult {
  department: "CCS" | "COE" | "CBAA" | "COHM" | "SHS" | string;
  total_students: number;
  total_login: number;
  total_logout: number;
  total_complete: number;
  percentage: number;
}

export interface OverallResult {
  total_students: number;
  total_login: number;
  total_logout: number;
  total_complete: number;
  percentage: number;
}

export interface ResultsResponse {
  event_id: string;
  event_name: string;
  departments: DepartmentResult[];
  overall: OverallResult;
}

export interface ResultsApiResponse {
  success: boolean;
  data: ResultsResponse;
}

export function useResult() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["dashboard-results"],
    queryFn: getResult,
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  useEffect(() => {
    const eventId = query.data?.event_id;
    if (!eventId) return;

    // Subscribe to the real-time aggregation document
    const unsubscribe = onSnapshot(
      doc(db, "event_stats", eventId),
      (snapshot) => {
        if (snapshot.exists()) {
          const statsData = snapshot.data();
          console.log("[useResult] onSnapshot received data:", statsData);
          
          // Hydrate the React Query Cache with the new aggregated stats
          queryClient.setQueryData(["dashboard-results"], (oldData: ResultsResponse | undefined) => {
            console.log("[useResult] setQueryData oldData:", oldData);
            if (!oldData) return oldData;
            
            const newDepartments = oldData.departments.map((dept) => {
               const updated = statsData.departments?.[dept.department] || {
                 total_login: 0,
                 total_logout: 0,
                 total_complete: 0
               };
               
               const totalStudents = dept.total_students;
               const percentage = totalStudents > 0 
                  ? Math.round((updated.total_complete / totalStudents) * 100 * 100) / 100 
                  : 0;

               return {
                 ...dept,
                 total_login: updated.total_login || 0,
                 total_logout: updated.total_logout || 0,
                 total_complete: updated.total_complete || 0,
                 percentage
               };
            });

            const overallStats = statsData.overall || {
               total_login: 0,
               total_logout: 0,
               total_complete: 0
            };

            const overallPercentage = oldData.overall.total_students > 0
               ? Math.round((overallStats.total_complete / oldData.overall.total_students) * 100 * 100) / 100
               : 0;

            const newData = {
              ...oldData,
              departments: newDepartments,
              overall: {
                ...oldData.overall,
                total_login: overallStats.total_login || 0,
                total_logout: overallStats.total_logout || 0,
                total_complete: overallStats.total_complete || 0,
                percentage: overallPercentage
              }
            };
            console.log("[useResult] setQueryData newData:", newData);
            return newData;
          });
        }
      },
      (error) => {
        console.error("[useResult] onSnapshot Firebase Error:", error);
      }
    );

    return () => unsubscribe();
  }, [query.data?.event_id, queryClient]);

  return query;
}
