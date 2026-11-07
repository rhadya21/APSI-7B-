import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as { role?: string };
      if (session.role === "kasir") redirect("/kasir");
      if (session.role === "pemilik") redirect("/pemilik");
    } catch {
      // Ignore malformed cookie and continue to login.
    }
  }

  redirect("/login");
}
