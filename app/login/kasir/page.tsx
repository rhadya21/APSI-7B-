import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function KasirLoginPage({
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
      if (sessionRole === "kasir") redirect("/kasir");
      if (sessionRole === "pemilik") redirect("/pemilik");
    } catch {
      // Ignore malformed cookie; allow the user to log in again.
    }
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const error = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error ?? null;

  return <LoginForm role="kasir" error={error} />;
}
