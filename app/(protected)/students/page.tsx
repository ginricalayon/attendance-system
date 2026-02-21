"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentTable } from "./_components/student-table";
import {
  AddStudentDialog,
  EditStudentDialog,
  DeleteStudentDialog,
  ImportStudentsDialog,
} from "./_components/student-dialogs";

export default function StudentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleDelete = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Students Directory
            </h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            Manage the complete roster of registered students.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsImportOpen(true)}
            className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/50 shadow-sm backdrop-blur-xl flex flex-col overflow-hidden">
        <div className="p-1">
          <StudentTable onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      <AddStudentDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      
      <EditStudentDialog
        student={selectedStudent}
        open={isEditOpen}
        onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setSelectedStudent(null);
        }}
      />
      
      <DeleteStudentDialog
        student={selectedStudent}
        open={isDeleteOpen}
        onOpenChange={(open) => {
            setIsDeleteOpen(open);
            if (!open) setSelectedStudent(null);
        }}
      />
      
      <ImportStudentsDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />
    </div>
  );
}
