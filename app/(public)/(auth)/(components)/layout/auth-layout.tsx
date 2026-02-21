import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 text-white overflow-hidden">
        {/* Subtle Background Pattern/Gradient */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl hover:opacity-90 transition-opacity">
            <div className="bg-white p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-zinc-950" />
            </div>
            <span>AttendanceSystem</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-4">
            <p className="text-3xl font-medium leading-tight">
              &ldquo;Streamlining educational administration, one class at a time. The modern standard for attendance tracking.&rdquo;
            </p>
            <footer className="text-sm font-medium text-zinc-400">
              Built for forward-thinking institutions
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="mx-auto w-full max-w-sm flex flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="flex lg:hidden justify-center items-center gap-2 mb-4">
               <div className="bg-zinc-950 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
               </div>
               <span className="font-bold text-xl tracking-tight">AttendanceSystem</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          
          {children}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
