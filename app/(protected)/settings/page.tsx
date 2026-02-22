"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Save, Settings2, CalendarRange, Clock } from "lucide-react";
import { EventTypes } from "@/app/lib/schema/enums.schema";
import { useSettings, useConfigureSettings } from "@/app/hooks/settings/use-settings";
import { useEvents } from "@/app/hooks/events/use-events";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsDangerZone } from "./_components/settings-danger-zone";

// Schema for the configuration form
const formSchema = z.object({
  event_id: z.string().min(1, "Please select an event"),
  type: z.nativeEnum(EventTypes),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const { data: currentSettingsResponse, isLoading: isSettingsLoading } = useSettings();
  const { data: eventsResponse, isLoading: isEventsLoading } = useEvents();
  const configureSettingsMutation = useConfigureSettings();

  const events = eventsResponse || [];
  const currentSettings = currentSettingsResponse?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: currentSettings ? {
      event_id: currentSettings.event_id,
      type: currentSettings.type as EventTypes,
    } : {
      event_id: "",
      type: EventTypes.LOGIN,
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await configureSettingsMutation.mutateAsync(values);
      toast.success("Settings updated successfully and active event mapped.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    }
  };

  const isLoading = isSettingsLoading || isEventsLoading;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-10 space-y-8 bg-gradient-to-br from-background via-background/95 to-muted/20 pb-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              System Settings
            </h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            Configure the live active event mapped to the barcode scanners.
          </p>
        </div>
      </div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {/* Active Event Configuration */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-xl shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" />
              Active Event Configuration
            </CardTitle>
            <CardDescription className="text-base">
              Select which event should actively record attendances. All incoming scans across the application will be attributed to this event and type combination.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-[76px] w-full rounded-xl" />
                <Skeleton className="h-[76px] w-full rounded-xl" />
                <Skeleton className="h-10 w-[120px] rounded-lg mt-4" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6 p-1">
                    <FormField
                      control={form.control}
                      name="event_id"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                            <CalendarRange className="w-4 h-4 text-primary" />
                            Target Event
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} key={field.value || 'target-event'}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base rounded-xl border-primary/20 bg-background/50 focus:ring-primary/30 transition-shadow">
                                <SelectValue placeholder="Select an active event..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-primary/20">
                              {events.map((event: any) => (
                                <SelectItem key={event.event_id} value={event.event_id} className="py-3 text-base font-medium cursor-pointer">
                                  {event.name}
                                </SelectItem>
                              ))}
                              {events.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No events found. Please create one first.
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-sm">
                            The event that students will be logged against.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Attendance Mode
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} key={field.value || 'attendance-mode'}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base rounded-xl border-primary/20 bg-background/50 focus:ring-primary/30 transition-shadow">
                                <SelectValue placeholder="Select tracking mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-primary/20">
                              <SelectItem value={EventTypes.LOGIN} className="py-3 cursor-pointer">
                                <span className="font-semibold text-green-600">Login</span>
                              </SelectItem>
                              <SelectItem value={EventTypes.LOGOUT} className="py-3 cursor-pointer">
                                <span className="font-semibold text-orange-600">Logout</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-sm">
                            Track if students are arriving or departing.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t border-border/50">
                    <Button 
                      type="submit" 
                      disabled={configureSettingsMutation.isPending || events.length === 0}
                      className="rounded-xl shadow-lg transition-all hover:scale-105 min-w-[140px] h-11 text-base font-semibold"
                    >
                      {configureSettingsMutation.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <SettingsDangerZone />
      </div>
    </div>
  );
}
