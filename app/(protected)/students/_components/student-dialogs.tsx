"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateStudentRequestSchema } from "@/app/lib/schema/student.schema";
import { DBCollections, Departments } from "@/app/lib/schema/enums.schema";
import {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useImportStudents,
} from "@/app/hooks/students/use-students";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// --- ADD STUDENT DIALOG ---

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentDialog({
  open,
  onOpenChange,
}: AddStudentDialogProps) {
  const { mutate, isPending } = useCreateStudent();

  const form = useForm<z.infer<typeof CreateStudentRequestSchema>>({
    resolver: zodResolver(CreateStudentRequestSchema),
    defaultValues: {
      student_number: "",
      last_name: "",
      first_name: "",
      middle_initial: "",
      department: Departments.CCS,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateStudentRequestSchema>) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Student added successfully");
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        const msg = typeof error.response?.data?.error === "string" ? error.response.data.error : "Failed to add student. Ensure student number is unique.";
        toast.error(msg);
        form.setError("root", { message: msg });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Enter the details for the new student.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2021-0001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middle_initial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Initial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="M"
                      maxLength={1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value={Departments.CCS}>CCS</option>
                      <option value={Departments.COE}>COE</option>
                      <option value={Departments.CBAA}>CBAA</option>
                      <option value={Departments.COHM}>COHM</option>
                      <option value={Departments.SHS}>SHS</option>
                      <option value={Departments.BSIT}>BSIT</option>
                      <option value={Departments.BSCS}>BSCS</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// --- EDIT STUDENT DIALOG ---

const UpdateStudentRequestSchema = CreateStudentRequestSchema.partial();

interface EditStudentDialogProps {
  student: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
}: EditStudentDialogProps) {
  const { mutate, isPending } = useUpdateStudent();

  const form = useForm<z.infer<typeof UpdateStudentRequestSchema>>({
    resolver: zodResolver(UpdateStudentRequestSchema),
    defaultValues: {
      student_number: "",
      last_name: "",
      first_name: "",
      middle_initial: "",
      department: Departments.CCS,
    },
  });

  useEffect(() => {
    if (student && open) {
      form.reset({
        student_number: student.student_number,
        last_name: student.last_name,
        first_name: student.first_name,
        middle_initial: student.middle_initial || "",
        department: student.department as any,
      });
    }
  }, [student, open, form]);

  const onSubmit = (values: z.infer<typeof UpdateStudentRequestSchema>) => {
    if (!student) return;
    
    // Only send changed fields
    const changedFields: any = {};
    (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
      if (values[key] !== student[key]) {
        changedFields[key] = values[key];
      }
    });
    
    // If no changes were made, just close
    if (Object.keys(changedFields).length === 0) {
      onOpenChange(false);
      return;
    }

    mutate(
      { id: student.student_id, data: changedFields },
      {
        onSuccess: () => {
          toast.success("Student updated successfully");
          onOpenChange(false);
          form.reset();
        },
        onError: (error: any) => {
          const msg = typeof error.response?.data?.error === "string" ? error.response.data.error : "Failed to update student.";
          toast.error(msg);
          form.setError("root", { message: msg });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Make changes to student information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="student_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2021-0001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="middle_initial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Initial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="M"
                      maxLength={1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value={Departments.CCS}>CCS</option>
                      <option value={Departments.COE}>COE</option>
                      <option value={Departments.CBAA}>CBAA</option>
                      <option value={Departments.COHM}>COHM</option>
                      <option value={Departments.SHS}>SHS</option>
                      <option value={Departments.BSIT}>BSIT</option>
                      <option value={Departments.BSCS}>BSCS</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// --- DELETE STUDENT DIALOG ---

interface DeleteStudentDialogProps {
  student: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStudentDialog({
  student,
  open,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const { mutate, isPending } = useDeleteStudent();
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!student) return;

    mutate(student.student_id, {
      onSuccess: () => {
        toast.success("Student deleted successfully");
        onOpenChange(false);
      },
      onError: (err: any) => {
        const msg = typeof err.response?.data?.error === "string" ? err.response.data.error : "Failed to delete student";
        toast.error(msg);
        setError(msg);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {student?.first_name}{" "}
            {student?.last_name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- IMPORT STUDENTS DIALOG ---

interface ImportStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportStudentsDialog({
  open,
  onOpenChange,
}: ImportStudentsDialogProps) {
  const { mutate, isPending } = useImportStudents();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedExtensions = [".csv", ".xls", ".xlsx"];
      const hasValidExtension = allowedExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        setError("Please select a .csv, .xls, or .xlsx file");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      }
    }
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    mutate(file, {
      onSuccess: (data: any) => {
        if (data && data.failed === 0 && (!data.validation_errors || data.validation_errors.length === 0) && (!data.import_errors || data.import_errors.length === 0)) {
          toast.success(`Import completed: ${data.successful} students added successfully`);
          handleClose();
        } else {
          toast.success("Import completed but with some errors");
          setResult(data);
          handleClose();
        }
      },
      onError: (err: any) => {
        const msg = typeof err.response?.data?.error === "string" ? err.response.data.error : "Failed to import students";
        toast.error(msg);
        setError(msg);
      },
    });
  };

  const handleClose = () => {
      onOpenChange(false);
      setFile(null);
      setError(null);
      setResult(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Students</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel (.xls, .xlsx) file containing student data. The file must have headers
            and columns in this exact order:
            student_number, last_name, first_name, middle_initial, department.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
            <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                ref={fileInputRef}
                id="csv"
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                disabled={isPending}
                />
            </div>
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            </div>
        ) : (
             <div className="space-y-4 py-4">
                 <div className="rounded-md bg-muted p-4 space-y-2">
                     <p className="font-semibold">Import Complete</p>
                     <p>Total processed: {result.total_rows}</p>
                     <p className="text-green-600">Successful: {result.successful}</p>
                     <p className="text-destructive">Failed: {result.failed}</p>
                 </div>

                 {result.validation_errors?.length > 0 && (
                     <div className="mt-4">
                         <p className="text-xs font-semibold">Validation Errors:</p>
                         <ul className="text-xs text-destructive list-disc pl-4 max-h-24 overflow-y-auto">
                            {result.validation_errors.map((err: any, i: number) => (
                                <li key={i}>Row {err.row}: {err.errors[0]?.message}</li>
                            ))}
                         </ul>
                     </div>
                 )}

                 {result.import_errors?.length > 0 && (
                     <div className="mt-4">
                         <p className="text-xs font-semibold">Import Errors:</p>
                         <ul className="text-xs text-destructive list-disc pl-4 max-h-24 overflow-y-auto">
                            {result.import_errors.map((err: any, i: number) => (
                                <li key={i}>Row {err.row} ({err.student_number}): {err.error}</li>
                            ))}
                         </ul>
                     </div>
                 )}
             </div>
        )}

        <DialogFooter>
          {result ? (
               <Button onClick={handleClose}>Close</Button>
          ) : (
              <>
                 <Button variant="outline" onClick={handleClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button onClick={handleImport} disabled={!file || isPending}>
                    {isPending ? "Importing..." : "Import"}
                </Button>
              </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
