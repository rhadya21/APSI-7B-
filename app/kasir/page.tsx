import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function KasirPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("kopioz_session")?.value;

  if (!sessionCookie) redirect("/login");

  let session: { role?: string; name?: string };

  try {
    session = JSON.parse(sessionCookie) as { role?: string; name?: string };
  } catch {
    redirect("/login");
  }

  if (session.role !== "kasir") redirect(session.role === "pemilik" ? "/pemilik" : "/login");

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#1f1a18]">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#e8dccb] bg-white/80 p-8 shadow-[0_10px_30px_rgba(63,49,39,0.06)] backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b5a4c]">Kopi OZ</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#1d1a16]">Dashboard Kasir</h1>
          </div>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-[#d9c3a7] bg-[#f8efe7] px-4 py-2 text-sm font-semibold text-[#2d1f17] transition hover:bg-[#f2e5d6]"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#f0e2d0] bg-[#f8f3ee] p-5">
            <p className="text-sm text-[#695d52]">User</p>
            <p className="mt-2 text-xl font-bold">{session.name ?? "Kasir"}</p>
          </div>
          <div className="rounded-2xl border border-[#f0e2d0] bg-[#f8f3ee] p-5">
            <p className="text-sm text-[#695d52]">Role</p>
            <p className="mt-2 text-xl font-bold">Kasir</p>
          </div>
          <div className="rounded-2xl border border-[#f0e2d0] bg-[#f8f3ee] p-5">
            <p className="text-sm text-[#695d52]">Status</p>
            <p className="mt-2 text-xl font-bold text-emerald-600">Aktif</p>
          </div>
        </div>
      </div>
    </main>
  );
}
