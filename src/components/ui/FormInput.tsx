"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  required?: boolean;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, wrapperClassName, required, className, error, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        <label className="text-xs font-medium text-[#404040]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={cn(
            "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors",
            error ? "border-red-500" : "border-[#E7E4DD]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;