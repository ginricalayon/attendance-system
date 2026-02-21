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
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Decorative Global Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Left Sidebar - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 text-white overflow-hidden border-r border-white/10">
        {/* Subtle Background Pattern/Gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950 opacity-80" />
        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        
        <div className="relative z-10 flex items-center">
          <Link href="/" className="flex items-center gap-3 group transition-opacity">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 transition-transform group-hover:scale-105 group-hover:bg-white/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Attendance<span className="text-primary font-light">System</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-12">
          <blockquote className="space-y-6">
            <p className="text-4xl font-medium leading-tight tracking-tight">
              &ldquo;Streamlining educational administration, one class at a time. The modern standard for attendance tracking.&rdquo;
            </p>
            <footer className="text-base font-medium text-zinc-400 flex items-center gap-3">
              <div className="h-px bg-zinc-700 w-8" />
              Built for forward-thinking institutions
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-16 relative z-10">
        <div className="mx-auto w-full max-w-sm flex flex-col justify-center space-y-8">
          <div className="flex flex-col space-y-3 text-center lg:text-left">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="flex lg:hidden justify-center items-center gap-3 mb-6">
               <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 shadow-sm">
                  <GraduationCap className="h-6 w-6 text-primary" />
               </div>
               <span className="font-extrabold text-2xl tracking-tight text-foreground">
                  Attendance<span className="text-primary font-light">System</span>
               </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-base text-muted-foreground/80">
              {description}
            </p>
          </div>
          
          <div className="relative">
            {/* Subtle glow behind the form area */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl blur opacity-50 pointer-events-none" />
            <div className="relative">
              {children}
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground/60 leading-loose">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
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
