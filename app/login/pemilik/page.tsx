import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function PemilikLoginPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as { role?: string };
      if (session.role === "pemilik") redirect("/pemilik");
      if (session.role === "kasir") redirect("/kasir");
    } catch {
      // Ignore malformed cookie; allow the user to log in again.
    }
  }

  return <LoginForm role="pemilik" />;
}
