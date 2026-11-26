export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface FieldValidationResult {
  valid: boolean;
  error: string | null;
}

export interface PasswordRuleResult {
  id: "minLength" | "uppercase" | "lowercase" | "number" | "special";
  label: string;
  required: boolean;
  met: boolean;
}

export function cleanIndianDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

export function validateStudentName(name: string): FieldValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Full name is required" };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Enter at least 2 characters" };
  }
  if (!/[A-Za-z]/.test(trimmed)) {
    return { valid: false, error: "Name must contain letters" };
  }
  return { valid: true, error: null };
}

export function validateEmailField(
  email: string,
  required = true,
  fieldLabel = "Email address"
): FieldValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return required
      ? { valid: false, error: `${fieldLabel} is required` }
      : { valid: true, error: null };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Enter a valid email (e.g. name@example.com)" };
  }
  return { valid: true, error: null };
}

export function validateIndianMobileField(
  phone: string,
  required: boolean,
  fieldLabel = "Mobile number"
): FieldValidationResult & { digits: string } {
  const trimmed = phone.trim();
  const digits = cleanIndianDigits(trimmed);

  if (!trimmed) {
    return required
      ? { valid: false, error: `${fieldLabel} is required`, digits: "" }
      : { valid: true, error: null, digits: "" };
  }

  if (/[A-Za-z]/.test(trimmed)) {
    return { valid: false, error: "Enter numbers only (no letters)", digits };
  }

  if (digits.length > 0 && !/^[6-9]/.test(digits)) {
    return {
      valid: false,
      error: "Indian mobile numbers start with 6, 7, 8, or 9",
      digits,
    };
  }

  if (digits.length < 10) {
    return {
      valid: false,
      error: `Enter all 10 digits (${digits.length}/10)`,
      digits,
    };
  }

  if (digits.length > 10) {
    return {
      valid: false,
      error: `Must be exactly 10 digits (${digits.length}/10)`,
      digits,
    };
  }

  return { valid: true, error: null, digits };
}

export function validateAgeField(rawAge: string): FieldValidationResult {
  const trimmed = rawAge.trim();
  if (!trimmed) return { valid: true, error: null };
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 6 || n > 25) {
    return { valid: false, error: "Age must be a whole number from 6 to 25" };
  }
  return { valid: true, error: null };
}

export function validatePercentageField(rawPct: string): FieldValidationResult {
  const trimmed = rawPct.trim().replace(/%$/, "");
  if (!trimmed) return { valid: true, error: null };
  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return { valid: false, error: "Enter a numeric percentage (e.g. 88.5)" };
  }
  if (num < 0 || num > 100) {
    return { valid: false, error: "Percentage must be between 0 and 100" };
  }
  return { valid: true, error: null };
}

export function evaluatePassword(password: string) {
  const rules: PasswordRuleResult[] = [
    {
      id: "minLength",
      label: "8+ characters",
      required: true,
      met: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Uppercase (A-Z)",
      required: true,
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "Lowercase (a-z)",
      required: true,
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "One number (0-9)",
      required: true,
      met: /\d/.test(password),
    },
    {
      id: "special",
      label: "Symbol (!@#$) bonus",
      required: false,
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const requiredRules = rules.filter((r) => r.required);
  const allRequiredMet = requiredRules.every((r) => r.met);
  const requiredMetCount = requiredRules.filter((r) => r.met).length;
  const totalScore = rules.filter((r) => r.met).length;

  let strengthLabel = "";
  if (password.length > 0) {
    if (requiredMetCount <= 1) strengthLabel = "Too weak";
    else if (!allRequiredMet) strengthLabel = "Almost there";
    else if (totalScore === 4) strengthLabel = "Good";
    else strengthLabel = "Strong";
  }

  const firstUnmet = requiredRules.find((r) => !r.met);
  const error = allRequiredMet
    ? null
    : firstUnmet
    ? `Password needs: ${firstUnmet.label}`
    : "Meet all required password rules";

  return {
    rules,
    requiredRules,
    allRequiredMet,
    requiredMetCount,
    totalScore,
    strengthLabel,
    error,
  };
}

export function validateAparId(raw: string): FieldValidationResult & { digits: string } {
  const digits = raw.replace(/[\s-]/g, "").trim();
  if (!digits) {
    return { valid: true, error: null, digits: "" };
  }
  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: "APAAR ID must contain digits only", digits };
  }
  if (digits.length !== 12) {
    return { valid: false, error: `APAAR ID must be 12 digits (${digits.length}/12)`, digits };
  }
  return { valid: true, error: null, digits };
}
