export const AGENCY_DESK_ACCOUNTS = [
  {
    username: "agency.admin@supeyo.in",
    password: "AgencyDesk!2026",
    label: "Agency Admin",
  },
  {
    username: "agency.staff@supeyo.in",
    password: "DeskStaff!2026",
    label: "Agency Staff",
  },
] as const;

export const AGENCY_DESK_SESSION_KEY = "supeyo_agency_desk_session";

export function isAgencyDeskCredentials(username: string, password: string): boolean {
  const normalizedUsername = username.trim().toLowerCase();
  return AGENCY_DESK_ACCOUNTS.some(
    (account) => account.username.toLowerCase() === normalizedUsername && account.password === password,
  );
}

export function getAgencyDeskSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AGENCY_DESK_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setAgencyDeskSession(username: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AGENCY_DESK_SESSION_KEY, username.trim());
  } catch {
    // ignore storage failures
  }
}

export function clearAgencyDeskSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AGENCY_DESK_SESSION_KEY);
  } catch {
    // ignore storage failures
  }
}
