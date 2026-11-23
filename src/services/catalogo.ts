import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { servicosDemo, profissionaisDemo, type ServicoDemo, type ProfissionalDemo } from "@/lib/data/demo";

export type Catalogo = {
  configurado: boolean;
  servicos: ServicoDemo[];
  profissionais: ProfissionalDemo[];
};

/** Lê serviços e profissionais do Supabase; sem configuração, usa dados de demonstração. */
export async function getCatalogo(): Promise<Catalogo> {
  if (!isSupabaseConfigured()) {
    return { configurado: false, servicos: servicosDemo, profissionais: profissionaisDemo };
  }
  const supabase = await createClient();
  const [s, p, v] = await Promise.all([
    supabase.from("servicos").select("*").eq("ativo", true).order("nome"),
    supabase.from("profissionais").select("*").eq("ativo", true).order("nome"),
    supabase.from("profissional_servicos").select("*"),
  ]);
  const servicos: ServicoDemo[] = (s.data ?? []).map((x) => ({
    id: x.id, nome: x.nome, descricao: x.descricao, preco: Number(x.preco), duracaoMinutos: x.duracao_minutos,
  }));
  const profissionais: ProfissionalDemo[] = (p.data ?? []).map((x) => ({
    id: x.id, nome: x.nome, descricao: x.descricao,
    especialidades: String(x.especialidades || "").split(",").map((t) => t.trim()).filter(Boolean),
    servicoIds: (v.data ?? []).filter((r) => r.profissional_id === x.id).map((r) => r.servico_id),
  }));
  return { configurado: true, servicos, profissionais };
}
