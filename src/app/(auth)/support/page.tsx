
"use client";
import {Button} from "@/components/ui/Button";
import LabeledInputField from "@/components/ui/LabeledInputField";
import LabeledTextareaField from "@/components/ui/LabeledTextareaField";
import { MailIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import { useState } from "react";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name, email, message);
  };
  return (
    <div className="flex-1 w-full flex flex-col gap-4 justify-center p-4 bg-white rounded-3xl shadow-2xl border border-white/20 max-w-md mx-auto">
      <h1 className="text-4xl font-bold">Support</h1>
      <p className="text-gray-600 text-sm">Raise you query or issue here</p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <LabeledInputField
          icon={<UserIcon className="h-5 w-5 text-gray-400" />}
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <LabeledInputField
          icon={<MailIcon className="h-5 w-5 text-gray-400" />}
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <LabeledTextareaField
          icon={<MessageCircleIcon className="h-5 w-5 text-gray-400" />}
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here"
        />
        <Button type="submit" disabled={!name || !email || !message}>
          Submit
        </Button>
      </form>
    </div>
  );
}
