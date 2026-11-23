"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isSupabaseConfigured()) return setErro("Supabase não configurado.");
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setErro(null);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("senha")),
    });
    setEnviando(false);
    if (error) return setErro("E-mail ou senha incorretos.");
    router.push("/admin/dashboard");
    router.refresh();
  }

  const campo = "mt-1 h-11 w-full rounded-suave border border-bege bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado";
  return (
    <form onSubmit={entrar} className="mt-8 space-y-4">
      <div><label htmlFor="email" className="text-sm text-marrom">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" className={campo} /></div>
      <div><label htmlFor="senha" className="text-sm text-marrom">Senha</label><input id="senha" name="senha" type="password" required autoComplete="current-password" className={campo} /></div>
      {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
      <Button type="submit" disabled={enviando} className="w-full">{enviando ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}
