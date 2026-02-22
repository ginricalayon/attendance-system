"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const pathMap: Record<string, string> = {
  "/": "Dashboard",
  "/students": "Students",
  "/attendance": "Attendance",
  "/settings": "Settings",
  "/events": "Events",
  "/records": "Records",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const title = pathMap[pathname] || "Dashboard"; // Default to Dashboard if not matched

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
