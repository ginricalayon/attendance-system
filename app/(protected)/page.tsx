"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, LogIn, LogOut, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { useResult } from "@/app/hooks/dashboard/use-result"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

export default function DashboardPage() {
  const { data, isPending, error } = useResult();

  if (isPending) {
    return (
      <div className="flex flex-1 h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading live attendance data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load dashboard data. Please check your connection and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { overall, departments, event_name } = data;

  const chartConfig = {
    login: { label: "Login", color: "hsl(var(--chart-1))" },
    logout: { label: "Logout", color: "hsl(var(--chart-2))" },
    complete: { label: "Complete", color: "hsl(var(--chart-3))" }
  };

  const chartData = departments.map((dept) => ({
    department: dept.department,
    login: dept.total_login,
    logout: dept.total_logout,
    complete: dept.total_complete,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          {event_name ? `Viewing live attendance for: ${event_name}` : "Overview of your recent activity and metrics."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.total_students.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Login</CardTitle>
            <LogIn className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.total_login.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Logout</CardTitle>
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.total_logout.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Complete</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overall.total_complete.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {overall.percentage.toFixed(1)}% Completion Rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Department Breakdown Chart and Leaderboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Visualizing login, logout, and completion metrics across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[350px] w-full max-h-[500px]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="department" 
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="login" fill="var(--color-login)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="logout" fill="var(--color-logout)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="complete" fill="var(--color-complete)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Leaderboard */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Attendance Leaderboard</CardTitle>
            <CardDescription>Departments ranked by complete attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...departments].sort((a, b) => b.percentage - a.percentage).map((dept, index) => (
                <div key={dept.department} className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm mr-4">
                    #{index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.total_complete} / {dept.total_students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{dept.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
