"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  required?: boolean;
}

export function FormInput({
  label,
  wrapperClassName,
  required,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={cn(wrapperClassName)}>
      <label className="text-xs font-medium text-[#404040]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className={cn(
          "mt-1 w-full rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}

export default FormInput;

