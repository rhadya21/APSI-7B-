const inputClassName =
  "h-[58px] w-full rounded-full border border-white/30 bg-white/10 px-4 pl-12 text-sm text-white placeholder:text-white/65 outline-none transition duration-200 ease-out focus:border-white/60 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]";

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#5869b5] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="relative w-full max-w-[860px] overflow-hidden rounded-[36px] border border-white/60 bg-[linear-gradient(180deg,#93a5ea_0%,#6677d4_30%,#4a4eb1_100%)] p-6 shadow-[0_24px_70px_rgba(15,17,78,0.28)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(130,118,255,0.18),transparent_28%)]" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col leading-[0.7] font-black tracking-[-0.12em] text-white/95">
              <span className="text-[2.6rem] sm:text-[3rem]">ko</span>
              <span className="text-[2.6rem] sm:text-[3rem]">pi</span>
              <span className="text-[2.6rem] sm:text-[3rem]">oz</span>
            </div>
          </div>

          <div className="mx-auto mt-8 w-full max-w-[560px]">
            <h1 className="text-center text-[2.4rem] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[3rem] lg:text-[3.6rem]">
              Login Sebagai
            </h1>

            <div className="mt-8 space-y-4">
              <label className="relative block">
                <span className="sr-only">Username</span>
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <UserIcon />
                </span>
                <input
                  aria-label="Username"
                  type="text"
                  placeholder="Username"
                  className={inputClassName}
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Password</span>
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <LockIcon />
                </span>
                <input
                  aria-label="Password"
                  type="password"
                  placeholder="Password"
                  className={inputClassName}
                />
              </label>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="text-[11px] font-medium text-white/75 underline-offset-4 transition hover:text-white hover:underline"
              >
                Recovery Password
              </button>
            </div>

            <button
              type="button"
              className="mt-7 flex h-[54px] w-full items-center justify-center rounded-full border border-white/45 bg-white/10 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
