'use client';

import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">CreatorLink</h1>
        <LoginForm />
      </div>
    </main>
  );
}