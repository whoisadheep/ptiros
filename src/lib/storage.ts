import { UserProfile } from "@/types/profile";

const STORAGE_KEY = "ptiros_user_profile";

/**
 * Validates 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9).
 * Accepts formats: "+91 9876543210", "9876543210", "09876543210", etc.
 */
export function validateIndianMobile(phone: string): { isValid: boolean; normalized: string } {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return {
    isValid: Boolean(match),
    normalized: match ? match[1] : "",
  };
}

/**
 * Safely retrieves user profile from localStorage with SSR and error guards.
 */
export function getStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Safely persists user profile to localStorage.
 */
export function setStoredProfile(profile: UserProfile): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely clears user profile from localStorage.
 */
export function clearStoredProfile(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
