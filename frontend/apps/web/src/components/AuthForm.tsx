"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import Image from "next/image";

interface Field {
  name: string;
  type: string;
  label: string;
  placeholder: string;
}

interface AuthFormProps {
  title: string;
  fields: Field[];
  onSubmit: (form: Record<string, string>) => Promise<void>;
  submitLabel: string;
  footerText?: string; // optional
  footerLink?: { href: string; label: string }; //optional 
  disable?: boolean// optional

  // New props for secondary button
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryDisabled?: boolean;
}

export default function AuthForm({
  title,
  fields,
  onSubmit,
  submitLabel,
  footerText,
  footerLink,
  secondaryLabel,
  onSecondaryClick,
  secondaryDisabled = false,
}: AuthFormProps) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 shadow-2xl">
      <div className="shadow-input mx-auto md:w-full w-[80%] max-w-md rounded-2xl bg-white p-6 md:rounded-2xl md:p-8 dark:bg-black">
        {/* Logo (optional) */}
        <div className="flex justify-center mb-4">
          <Image src="/PRO-CART.png" alt="logo" width={200} height={150} />
        </div>

        <form className="my-8 space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <LabelInputContainer key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
              />
            </LabelInputContainer>
          ))}

          {/* Primary Submit button */}
          <button
            type="submit"
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white cursor-pointer shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          >
            {submitLabel} &rarr;
            <BottomGradient />
          </button>

          {/* Secondary Button (optional) */}
          {secondaryLabel && onSecondaryClick && (
            <button
              type="button"
              onClick={onSecondaryClick}
              disabled={secondaryDisabled}
              className={`mt-2 block h-10 w-full rounded-md border border-gray-300 font-medium 
                ${secondaryDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-br from-blue-900 to-neutral-600 text-white hover:bg-gray-100 cursor-pointer"} 
                dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700`}
            >
              {secondaryLabel}
            </button>
          )}
        </form>

        {/* Footer */}
        {(footerText || footerLink) && (
          <p className="text-center md:text-sm text-xs text-neutral-600 dark:text-neutral-400">
            {footerText && <span>{footerText} </span>}
            {footerLink && (
              <a
                href={footerLink.href}
                className="text-black dark:text-white font-medium hover:underline"
              >
                {footerLink.label}
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/* Gradient animation */
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

/* Container for label + input */
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
