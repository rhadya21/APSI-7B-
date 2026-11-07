"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const allowedRoles = new Set(["kasir", "pemilik"]);

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const requestedRole = String(formData.get("role") ?? "").trim().toLowerCase();

  if (!allowedRoles.has(requestedRole)) {
    redirect("/login");
  }

  if (!username || !password) {
    redirect(`/login/${requestedRole}?error=missing_credentials`);
  }

  const user = await prisma.pengguna.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  if (!user || user.password !== password) {
    redirect(`/login/${requestedRole}?error=invalid_credentials`);
  }

  const userRole = user.role?.trim().toLowerCase();

  if (!userRole || userRole !== requestedRole) {
    redirect(`/login/${requestedRole}?error=role_mismatch`);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    "kopioz_session",
    JSON.stringify({
      userId: user.id_pengguna,
      username: user.username,
      role: user.role,
      name: user.nama,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    },
  );

  if (requestedRole === "kasir") {
    redirect("/kasir");
  }

  redirect("/pemilik");
}
