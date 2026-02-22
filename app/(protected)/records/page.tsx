"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecordsTable } from "./_components/records-table";

export default function RecordsPage() {

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Student Records
            </h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            View, search, and filter through the complete attendance master list.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            asChild
            className="rounded-xl shadow-lg transition-all hover:scale-105 border-primary/20 bg-background/50 hover:bg-primary/5 text-foreground"
          >
            <a href="/api/attendance/export" download>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl flex flex-col overflow-hidden">
        <div className="p-1">
          <RecordsTable />
        </div>
      </div>

    </div>
  );
}
