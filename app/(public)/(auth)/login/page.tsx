import React from "react";
import LoginForm from "./(components)/forms/login-form";
import AuthLayout from "../(components)/layout/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials below to log into your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
