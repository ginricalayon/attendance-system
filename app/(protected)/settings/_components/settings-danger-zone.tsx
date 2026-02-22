"use client";

import { useState } from "react";
import { useDeleteAttendances } from "@/app/hooks/attendance/use-attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsDangerZone() {
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const deleteMutation = useDeleteAttendances();

  const onDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync();
      toast.success("All attendance records have been permanently deleted.");
      setIsDeleteAllOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to clear records. Please try again.");
    }
  };

  return (
    <>
      <Card className="border-destructive/20 bg-card/80 backdrop-blur-xl shadow-lg border-t-4 border-t-destructive overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Irreversible actions that affect the entire attendance system data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-destructive/5 rounded-xl border border-destructive/10 p-5">
            <div className="space-y-1 max-w-[600px]">
              <h4 className="font-semibold text-foreground">Clear All Attendance Records</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all scanned attendance records from the database. 
                This action cannot be undone and will empty the Student Records list entirely.
                Always export your data first.
              </p>
            </div>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteAllOpen(true)}
              className="shrink-0 font-semibold shadow-md rounded-xl transition-all hover:scale-105"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Records
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Data Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you absolutely sure you want to delete <strong>every single attendance record</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground border-l-4 border-destructive/50 pl-4 py-1">
              This action is <strong>permanent</strong> and cannot be undone. All exported data and analytical records will be lost forever.
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteAllOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Everything"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
