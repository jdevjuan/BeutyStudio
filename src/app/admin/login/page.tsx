import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Login administrativo", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <section className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-3xl">Área administrativa</h1>
      {erro === "sem-permissao" && (
        <p role="alert" className="mt-4 text-sm text-red-700">Esta conta não tem permissão de administrador.</p>
      )}
      <LoginForm />
    </section>
  );
}
