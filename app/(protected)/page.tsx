"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, LogIn, LogOut, CheckCircle2, Loader2, AlertCircle, Activity, Sparkles, Trophy } from "lucide-react"
import { useResult } from "@/app/hooks/dashboard/use-result"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { data, isPending, error } = useResult();

  if (isPending) {
    return (
      <div className="flex flex-1 h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-muted-foreground bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Activity className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="font-medium animate-pulse">Loading live intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background/95 to-muted/20">
        <Alert variant="destructive" className="border-2 border-destructive/20 bg-destructive/5 rounded-2xl shadow-sm max-w-2xl mx-auto mt-20">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold">Dashboard Unavailable</AlertTitle>
          <AlertDescription className="text-sm mt-1">
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
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Command Center
            </h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            {event_name ? (
              <>
                <Sparkles className="h-4 w-4 text-primary" />
                Live metrics for: <strong className="text-foreground/90">{event_name}</strong>
              </>
            ) : "Overview of your system activity and metrics."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl transition-all hover:bg-card/80 hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Total Students</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{overall.total_students.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl transition-all hover:bg-card/80 hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Total Logins</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <LogIn className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{overall.total_login.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl transition-all hover:bg-card/80 hover:shadow-md group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Total Logouts</CardTitle>
            <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
              <LogOut className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{overall.total_logout.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl transition-all hover:shadow-md group border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold text-primary">Total Completed</CardTitle>
            <div className="p-2 bg-primary/15 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold tracking-tight text-primary">{overall.total_complete.toLocaleString()}</div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                  style={{ width: `${overall.percentage}%` }} 
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground w-12 text-right">
                {overall.percentage.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Department Breakdown Chart and Leaderboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-12">
        <Card className="col-span-full lg:col-span-4 xl:col-span-8 rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Activity className="w-5 h-5 text-blue-500" />
              Department Breakdown
            </CardTitle>
            <CardDescription>Visualizing login, logout, and completion metrics across all departments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="min-h-[350px] w-full max-h-[500px]">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="department" 
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent className="rounded-xl shadow-xl border bg-background/95 backdrop-blur-md" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="login" fill="var(--color-login)" radius={[4, 4, 0, 0]} className="fill-emerald-400 dark:fill-emerald-500" />
                <Bar dataKey="logout" fill="var(--color-logout)" radius={[4, 4, 0, 0]} className="fill-rose-400 dark:fill-rose-500" />
                <Bar dataKey="complete" fill="var(--color-complete)" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Leaderboard */}
        <Card className="col-span-full lg:col-span-3 xl:col-span-4 rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl overflow-hidden flex flex-col">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Trophy className="w-5 h-5 text-amber-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>Departments ranked by completion rate</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-auto">
            <div className="space-y-6">
              {[...departments].sort((a, b) => b.percentage - a.percentage).map((dept, index) => (
                <div key={dept.department} className="flex items-center group relative">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm mr-4 shadow-sm transition-transform group-hover:scale-110",
                    index === 0 ? "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30" :
                    index === 1 ? "bg-slate-300/10 text-slate-500 ring-1 ring-slate-300/30 dark:text-slate-400" :
                    index === 2 ? "bg-amber-700/10 text-amber-700 ring-1 ring-amber-700/30 dark:text-amber-600" :
                    "bg-primary/5 text-muted-foreground"
                  )}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-none">{dept.department}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {dept.total_complete} of {dept.total_students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-extrabold tracking-tight",
                      index === 0 ? "text-amber-500" : ""
                    )}>
                      {dept.percentage.toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Subtle hover background */}
                  <div className="absolute -inset-x-4 -inset-y-3 bg-muted/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
