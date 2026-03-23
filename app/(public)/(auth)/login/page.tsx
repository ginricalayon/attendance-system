import React from "react";
import type { Metadata } from "next";
import LoginForm from "./(components)/forms/login-form";
import AuthLayout from "../(components)/layout/auth-layout";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials below to log into your account"
    >
      <React.Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </React.Suspense>
    </AuthLayout>
  );
}
