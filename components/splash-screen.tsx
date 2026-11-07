'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/login');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#5869b5]">
      <div className="flex flex-col items-center justify-center leading-[0.72] font-black tracking-[-0.12em] text-white/95">
        <span className="text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem]">ko</span>
        <span className="text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem]">pi</span>
        <span className="text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem]">oz</span>
      </div>
    </main>
  );
}
