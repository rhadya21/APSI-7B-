import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import SplashScreen from "@/components/splash-screen";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as { role?: string };
      const sessionRole = String(session.role ?? "").trim().toLowerCase();
      if (sessionRole === "kasir") redirect("/kasir");
      if (sessionRole === "pemilik") redirect("/pemilik");
    } catch {
      // Ignore malformed cookie and continue to splash.
    }
  }

  return <SplashScreen />;
}
