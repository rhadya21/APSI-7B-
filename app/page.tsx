const inputClassName =
  "h-[56px] w-full rounded-full border border-white/30 bg-white/10 px-5 pl-12 text-sm text-white placeholder:text-white/65 outline-none transition focus:border-white/60 focus:bg-white/15";

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
    <main className="flex min-h-screen w-full items-center justify-center bg-[#5869b5] px-4 py-8 text-white">
      <div className="relative w-full max-w-[852px] rounded-[40px] border border-white/60 bg-gradient-to-b from-white/10 to-white/40 px-6 py-10 shadow-[0_0_30px_rgba(11,20,67,0.14)] backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="absolute left-6 top-5 sm:left-8 lg:left-10">
          <div className="flex flex-col leading-[0.75] font-black tracking-[-0.14em] text-white/95">
            <span className="text-[2.1rem] sm:text-[2.8rem]">ko</span>
            <span className="text-[2.1rem] sm:text-[2.8rem]">pi</span>
            <span className="text-[2.1rem] sm:text-[2.8rem]">oz</span>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[620px]">
          <h1 className="mb-8 text-center text-[2.5rem] font-black leading-none tracking-tight text-white sm:text-[3.2rem] lg:text-[4rem]">
            Login Sebagai
          </h1>

          <div className="space-y-5">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                <UserIcon />
              </span>
              <input
                aria-label="Username"
                type="text"
                placeholder="Username"
                className={inputClassName}
              />
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                <LockIcon />
              </span>
              <input
                aria-label="Password"
                type="password"
                placeholder="Password"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-white/75 underline-offset-4 transition hover:text-white hover:underline"
            >
              Recovery Password
            </button>
          </div>

          <button
            type="button"
            className="mt-7 flex h-[54px] w-full items-center justify-center rounded-full border border-white/50 bg-white/12 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
