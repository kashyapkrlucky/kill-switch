"use client";
import React, { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import { MailIcon, UserIcon } from "lucide-react";
import LabeledInputField from "@/components/ui/LabeledInputField";
import LabeledPasswordField from "@/components/ui/LabeledPasswordField";
import PageLink from "@/components/ui/PageLink";
import UserNameSub from "@/components/ui/UserNameSub";
import CustomToast from "@/components/ui/CustomToast";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/core/utils/constants";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useUserStore();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirm) {
      CustomToast("error", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      CustomToast("error", "Passwords do not match.");
      return;
    }
    if (!agree) {
      CustomToast("error", "You must accept the Terms to continue.");
      return;
    }

    try {
      setLoading(true);
      const result = await register({ username, email, password });
      if (result.status && result.data?.user && result.data?.token) {
        login(result.data.user, result.data.token);
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
      CustomToast("error", "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold mb-1 text-slate-100">Create your account</h1>
      <p className="text-sm text-slate-400 mb-6">
        Join {APP_NAME} today.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <LabeledInputField
          icon={<UserIcon className="w-4 h-4 text-gray-300" />}
          label="Username"
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe123"
        />

        {username && (
          <UserNameSub username={username} setUsername={setUsername} />
        )}

        <LabeledInputField
          icon={<MailIcon className="h-4 w-4 text-gray-300" />}
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

        <LabeledPasswordField
          label="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          name="confirm"
        />

        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 rounded border border-gray-500"
          />
          I agree to the
          <PageLink href="/terms">Terms & Conditions</PageLink>
        </label>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            // loading={loading}
            // fullWidth
          >
            Create account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-sm text-slate-300">
        Already have an account?{" "}
        <PageLink href="/sign-in" size="sm">
          Sign in
        </PageLink>
      </div>
    </div>
  );
}

export default SignUp;
