"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type PhoneCodeOption = {
  id: string;
  name: string;
  phone_code: string;
};

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;

  enableCodeSelect?: boolean;
  codes?: PhoneCodeOption[];
  selectedCode?: string;
  onCodeChange?: (code: string) => void;

  enableCodeSearch?: boolean;
  codeSearchPlaceholder?: string;
  onCodeSearchChange?: (query: string) => void;
  
  error?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      required,
      value,
      onChange,
      enableCodeSelect = false,
      codes = [],
      selectedCode,
      onCodeChange,
      enableCodeSearch = false,
      codeSearchPlaceholder = "Search country code...",
      onCodeSearchChange,
      className,
      error,
      ...inputProps
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);

    const handleSearchChange = (q: string) => {
      setSearchQuery(q);
      onCodeSearchChange?.(q);
    };

    const filteredCodes = React.useMemo(() => {
      if (!enableCodeSearch || !searchQuery.trim()) return codes;
      const q = searchQuery.toLowerCase();
      return codes.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone_code.toLowerCase().includes(q)
      );
    }, [codes, enableCodeSearch, searchQuery]);

    const currentCode =
      codes.find((c) => c.phone_code === selectedCode) ?? codes[0];

    React.useEffect(() => {
      if (!isDropdownOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    return (
      <div>
        {label && (
          <label className="text-xs text-[#404040] font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={cn(
          "mt-1 relative flex items-center gap-2 rounded-lg border bg-white px-3 py-2 hover:border-[#C4994A] focus-within:border-[#C4994A] transition-colors",
          error ? "border-red-500" : "border-[#E7E4DD]"
        )}>
          {enableCodeSelect ? (
            <div className="" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="flex items-center gap-1 text-xs text-[#4E3325] bg-transparent outline-none"
              >
                <span>{currentCode?.phone_code || selectedCode || "+91"}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-[#6B635A] transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-[1000] left-0 mt-2 w-40 bg-white border border-[#E7E4DD] rounded-lg shadow-lg">
                  {enableCodeSearch && (
                    <div className="px-2 pt-2 pb-1 border-b border-[#E7E4DD]">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B635A]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          placeholder={codeSearchPlaceholder}
                          className="w-full pl-7 pr-2 py-1.5 text-xs border border-[#E7E4DD] rounded-md outline-none focus:border-[#C4994A] placeholder:text-[#B7AFA5]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="max-h-52 overflow-y-auto py-1">
                    {filteredCodes.length > 0 ? (
                      filteredCodes.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            onCodeChange?.(c.phone_code);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-2 py-1.5 text-left text-xs hover:bg-[#F5F3F0] text-[#4E3325]",
                            c.phone_code === selectedCode && "font-medium"
                          )}
                        >
                          {c.name} ({c.phone_code})
                        </button>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-center text-xs text-[#6B635A]">
                        No codes found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-[#4E3325]">+91</span>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full bg-transparent text-sm outline-none placeholder:text-[#B7AFA5]",
              className
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...inputProps}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
