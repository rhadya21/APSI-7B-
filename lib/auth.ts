import { cookies } from "next/headers";

export type AppRole = "kasir" | "pemilik";

export type AppSession = {
  userId: string;
  username?: string | null;
  role: AppRole;
  name?: string | null;
};

export const SESSION_COOKIE_NAME = "kopioz_session";

export function getSessionFromCookieValue(cookieValue?: string): AppSession | null {
  if (!cookieValue) {
    return null;
  }

  try {
    const raw = JSON.parse(cookieValue) as Partial<AppSession>;
    const role = String(raw.role ?? "").trim().toLowerCase();

    if (role !== "kasir" && role !== "pemilik") {
      return null;
    }

    return {
      userId: String(raw.userId ?? ""),
      username: raw.username ?? null,
      role,
      name: raw.name ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  return getSessionFromCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireSession(roles?: AppRole | AppRole[]) {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(session.role)) {
      throw new Error("FORBIDDEN");
    }
  }

  return session;
}
