"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventTable } from "./_components/event-table";
import { EventDialogs } from "./_components/event-dialogs";
import { IEvent } from "@/app/lib/schema/event.schema";

export default function EventsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<(IEvent & { event_id: string }) | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<(IEvent & { event_id: string }) | null>(null);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Events Directory
            </h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            Manage the master list of all application events and configurations.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl flex flex-col overflow-hidden">
        <div className="p-1">
          <EventTable 
            onEdit={setEditingEvent} 
            onDelete={setDeletingEvent} 
          />
        </div>
      </div>

      {/* Interactive Flow Dialogs */}
      <EventDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        deletingEvent={deletingEvent}
        setDeletingEvent={setDeletingEvent}
      />
    </div>
  );
}
