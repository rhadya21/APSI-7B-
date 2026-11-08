import Link from "next/link";
import { loginAction } from "@/app/login/actions";

type LoginRole = "kasir" | "pemilik";

const roleLabels: Record<LoginRole, string> = {
  kasir: "Kasir",
  pemilik: "Pemilik",
};

function getErrorMessage(role: LoginRole, error: string | null) {
  switch (error) {
    case "missing_credentials":
      return "Username dan password wajib diisi.";
    case "invalid_credentials":
      return `Username atau password tidak valid untuk ${roleLabels[role].toLowerCase()}.`;
    case "role_mismatch":
      return `Akun ini bukan ${roleLabels[role].toLowerCase()}. Silakan pilih peran yang sesuai.`;
    default:
      return null;
  }
}

export function LoginForm({ role, error }: { role: LoginRole; error?: string | null }) {
  const formError = getErrorMessage(role, error ?? null);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#5869b5] px-4 py-8 sm:px-6 lg:px-10">
      <div className="relative w-full max-w-[860px] overflow-hidden rounded-[36px] border border-white/60 bg-[linear-gradient(180deg,rgba(147,165,234,0.25),rgba(103,119,212,0.28),rgba(77,90,177,0.4))] p-6 shadow-[0_24px_70px_rgba(15,17,78,0.28)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(130,118,255,0.18),transparent_30%)]" />

        <div className="relative z-10">
          <div className="flex flex-col leading-[0.72] font-black tracking-[-0.12em] text-white/95">
            <span className="text-[2.3rem] sm:text-[3.1rem]">ko</span>
            <span className="text-[2.3rem] sm:text-[3.1rem]">pi</span>
            <span className="text-[2.3rem] sm:text-[3.1rem]">oz</span>
          </div>

          <div className="mx-auto mt-7 w-full max-w-[470px] sm:max-w-[500px]">
            <Link
              href="/login"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
            >
              <span aria-hidden="true">←</span>
              Kembali
            </Link>

            <h1 className="text-center text-[2.1rem] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[2.8rem] lg:text-[3.2rem]">
              Login {roleLabels[role]}
            </h1>

            {formError ? (
              <div className="mt-4 rounded-2xl border border-red-200/60 bg-red-100/10 px-4 py-3 text-sm font-medium text-red-50 backdrop-blur-sm">
                {formError}
              </div>
            ) : null}

            <form action={loginAction} className="mt-7" noValidate>
              <input type="hidden" name="role" value={role} />

              <div className="space-y-6 rounded-[28px] border border-white/25 bg-[rgba(255,255,255,0.06)] p-4 backdrop-blur-sm sm:p-5">
                <div className="space-y-5">
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
                    <span className="mb-2 block">Username</span>
                    <input
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Masukkan username"
                      className="h-[48px] w-full rounded-[16px] border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-[11px] placeholder:font-medium placeholder:text-white/60 outline-none transition focus:border-white/60 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]"
                    />
                  </label>

                  <label className="block pt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
                    <span className="mb-2 block">Password</span>
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      className="h-[48px] w-full rounded-[16px] border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-[11px] placeholder:font-medium placeholder:text-white/60 outline-none transition focus:border-white/60 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]"
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-[11px] font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    Recovery Password
                  </button>
                </div>

                <button
                  type="button"
                  className="flex h-[52px] w-full items-center justify-center rounded-full border border-white/45 bg-white/10 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
