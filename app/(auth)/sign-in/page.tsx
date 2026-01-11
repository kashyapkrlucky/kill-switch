"use client";
import React, { useState } from "react";
import LabeledPasswordField from "@/components/ui/LabeledPasswordField";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import CustomToast from "@/components/ui/CustomToast";
import PageLink from "@/components/ui/PageLink";
import { MailIcon } from "lucide-react";
import LabeledInputField from "@/components/ui/LabeledInputField";
import { APP_NAME } from "@/core/utils/constants";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();
  const { login: authLogin } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      CustomToast("error", "Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.status && result.data?.user && result.data?.token) {
        authLogin(result.data.user, result.data.token);
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);

      CustomToast("error", "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold mb-1 text-slate-100">Welcome back</h1>
      <p className="text-sm text-slate-400 mb-6">
        Sign in to continue to {APP_NAME}.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <LabeledInputField
          icon={<MailIcon className="h-5 w-5 text-gray-400" />}
          label="Email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <LabeledPasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />

        <div className="flex items-center justify-end">
          <PageLink href="/forgot-password">Forgot password?</PageLink>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-3 py-3 text-sm font-medium disabled:opacity-60"
          tabIndex={0}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <PageLink href="/sign-up" size="sm">Create one</PageLink>
      </div>
    </div>
  );
}

export default SignIn;
