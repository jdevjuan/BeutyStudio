"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";

export async function alterarStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["confirmado", "cancelado", "pendente"]).parse(formData.get("status"));
  await supabase.from("agendamentos").update({ status }).eq("id", id);
  revalidatePath("/admin/dashboard");
}

const servicoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().max(500).default(""),
  preco: z.coerce.number().min(0),
  duracao_minutos: z.coerce.number().int().min(10).max(480),
});

export async function salvarServico(formData: FormData) {
  const { supabase } = await requireAdmin();
  const dados = servicoSchema.parse(Object.fromEntries(formData));
  const ativo = formData.get("ativo") === "on";
  const id = formData.get("id");
  if (id) await supabase.from("servicos").update({ ...dados, ativo }).eq("id", z.string().uuid().parse(id));
  else await supabase.from("servicos").insert({ ...dados, ativo: true });
  revalidatePath("/admin/dashboard");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
