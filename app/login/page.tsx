import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie) as { role?: string };
      const sessionRole = String(session.role ?? "").trim().toLowerCase();
      if (sessionRole === "kasir") redirect("/kasir");
      if (sessionRole === "pemilik") redirect("/pemilik");
    } catch {
      // Ignore malformed cookie; user can log in again.
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#5869b5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="relative w-full max-w-[860px] overflow-hidden rounded-[40px] border border-white/60 bg-[linear-gradient(180deg,rgba(147,165,234,0.25),rgba(103,119,212,0.28),rgba(77,90,177,0.4))] p-6 shadow-[0_24px_70px_rgba(15,17,78,0.28)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(130,118,255,0.18),transparent_30%)]" />

        <div className="relative z-10">
          <div className="flex flex-col leading-[0.7] font-black tracking-[-0.12em] text-white/95">
            <span className="text-[2.3rem] sm:text-[3.1rem]">ko</span>
            <span className="text-[2.3rem] sm:text-[3.1rem]">pi</span>
            <span className="text-[2.3rem] sm:text-[3.1rem]">oz</span>
          </div>

          <div className="mx-auto mt-7 w-full max-w-[520px]">
            <h1 className="text-center text-[2.2rem] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[2.8rem] lg:text-[3.6rem]">
              Login Sebagai
            </h1>

            <div className="mt-8 space-y-4">
              <Link
                href="/login/kasir"
                className="relative flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[40px] border border-white/30 bg-[rgba(255,255,255,0.08)] text-lg font-bold tracking-[-0.04em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[rgba(255,255,255,0.12)]"
              >
                Kasir
              </Link>

              <Link
                href="/login/pemilik"
                className="relative flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[40px] border border-white/30 bg-[rgba(255,255,255,0.08)] text-lg font-bold tracking-[-0.04em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[rgba(255,255,255,0.12)]"
              >
                Pemilik
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
