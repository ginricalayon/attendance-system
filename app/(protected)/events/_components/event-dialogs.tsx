"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICreateEventRequest, CreateEventRequestSchema, UpdateEventRequestSchema, IUpdateEventRequest, IEvent } from "@/app/lib/schema/event.schema";
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "@/app/hooks/events/use-events";
import { toast } from "sonner";
import { useEffect } from "react";
import { Loader2, PlusCircle, Save, Trash2, AlertTriangle, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/app/types";

interface EventDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  editingEvent: (IEvent & { event_id: string }) | null;
  setEditingEvent: (event: (IEvent & { event_id: string }) | null) => void;
  deletingEvent: (IEvent & { event_id: string }) | null;
  setDeletingEvent: (event: (IEvent & { event_id: string }) | null) => void;
}

export function EventDialogs({
  isCreateOpen,
  setIsCreateOpen,
  editingEvent,
  setEditingEvent,
  deletingEvent,
  setDeletingEvent,
}: EventDialogsProps) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  // Create Form
  const createForm = useForm<ICreateEventRequest>({
    resolver: zodResolver(CreateEventRequestSchema),
    defaultValues: { name: "", description: "" },
  });

  // Edit Form
  const editForm = useForm<IUpdateEventRequest>({
    resolver: zodResolver(UpdateEventRequestSchema),
    defaultValues: { name: "", description: "" },
  });

  // Sync edit form with selected event
  useEffect(() => {
    if (editingEvent) {
      editForm.reset({
        name: editingEvent.name,
        description: editingEvent.description || "",
      });
    }
  }, [editingEvent, editForm]);

  const onCreateSubmit = (data: ICreateEventRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Event created successfully!");
        setIsCreateOpen(false);
        createForm.reset();
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Failed to create event";
        toast.error(message);
      },
    });
  };

  const onEditSubmit = (data: IUpdateEventRequest) => {
    if (!editingEvent) return;
    updateMutation.mutate({ id: editingEvent.event_id, data }, {
      onSuccess: () => {
        toast.success("Event updated successfully!");
        setEditingEvent(null);
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Failed to update event";
        toast.error(message);
      },
    });
  };

  const onDeleteConfirm = () => {
    if (!deletingEvent) return;
    deleteMutation.mutate(deletingEvent.event_id, {
      onSuccess: () => {
        toast.success("Event deleted permanently.");
        setDeletingEvent(null);
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Failed to delete event";
        toast.error(message);
      },
    });
  };

  return (
    <>
      {/* Create Event Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new tracking event for the system.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CCS Week 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add some details about this event..."
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
            <DialogDescription>
              Modify the configuration for {editingEvent?.name}.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CCS Week 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add some details about this event..."
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingEvent} onOpenChange={(open) => !open && setDeletingEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingEvent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeletingEvent(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
