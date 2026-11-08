import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function PemilikLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string | string[] }> | { error?: string | string[] };
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as { role?: string };
      const sessionRole = String(session.role ?? "").trim().toLowerCase();
      if (sessionRole === "pemilik") redirect("/pemilik");
      if (sessionRole === "kasir") redirect("/kasir");
    } catch {
      // Ignore malformed cookie; allow the user to log in again.
    }
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const error = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error ?? null;

  return <LoginForm role="pemilik" error={error} />;
}
