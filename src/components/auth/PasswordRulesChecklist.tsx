"use client";

import React from "react";
import { Check, Circle } from "lucide-react";
import { evaluatePassword } from "@/lib/formValidation";

interface PasswordRulesChecklistProps {
  password: string;
  showError?: boolean;
  compact?: boolean;
}

export default function PasswordRulesChecklist({
  password,
  showError = false,
  compact = false,
}: PasswordRulesChecklistProps) {
  const evalRes = evaluatePassword(password);

  return (
    <div className={compact ? "mt-2 space-y-2" : "mt-2.5 space-y-2"} aria-live="polite">
      {/* 4-segment Password Strength Rail */}
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-4 gap-1.5 flex-1">
          {[1, 2, 3, 4].map((seg) => {
            const active = evalRes.totalScore >= seg;
            let barColor = "bg-[#1F1B16]/[0.10]";
            if (active) {
              if (!evalRes.allRequiredMet) barColor = "bg-[#D97706]";
              else if (evalRes.totalScore >= 5) barColor = "bg-[#15803D]";
              else barColor = "bg-[#16A34A]";
            }
            return (
              <span
                key={seg}
                className={`h-1 rounded-full transition-colors duration-200 ${barColor}`}
              />
            );
          })}
        </div>
        {evalRes.strengthLabel && (
          <span
            className={`text-[11px] font-medium tabular-nums shrink-0 ${
              evalRes.allRequiredMet ? "text-[#15803D]" : "text-[#B45309]"
            }`}
          >
            {evalRes.strengthLabel}
          </span>
        )}
      </div>

      {/* Live Required Rules 2x2 Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {evalRes.requiredRules.map((rule) => {
          const isMissingHighlighted = showError && rule.required && !rule.met;
          return (
            <div
              key={rule.id}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                rule.met
                  ? "text-[#15803D] font-medium"
                  : isMissingHighlighted
                  ? "text-[#B91C1C] font-medium"
                  : "text-[#685F54]"
              }`}
            >
              {rule.met ? (
                <Check className="size-3 shrink-0 text-[#15803D]" strokeWidth={2} />
              ) : (
                <Circle
                  className={`size-2.5 shrink-0 ${
                    isMissingHighlighted ? "text-[#B91C1C]" : "text-[#685F54]/50"
                  }`}
                  strokeWidth={2}
                />
              )}
              <span className="truncate">{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
