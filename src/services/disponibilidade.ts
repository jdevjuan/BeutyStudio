import { createServiceClient } from "@/lib/supabase/admin";

export type Slot = { horario: string; profissionalIds: string[] };

const PASSO_MIN = 30;

const toMin = (t: string) => {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
};
const toHora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Data e hora atuais no fuso do salão. */
function agora() {
  const s = new Date().toLocaleString("sv-SE", { timeZone: "America/Fortaleza" }); // "YYYY-MM-DD HH:mm:ss"
  return { data: s.slice(0, 10), minutos: toMin(s.slice(11, 16)) };
}

export async function calcularDisponibilidade(params: {
  servicoId: string;
  profissionalId: string | null;
  data: string;
}): Promise<Slot[]> {
  const db = createServiceClient();
  const { servicoId, profissionalId, data } = params;
  const hoje = agora();
  if (data < hoje.data) return [];

  const { data: servico } = await db.from("servicos").select("duracao_minutos").eq("id", servicoId).eq("ativo", true).maybeSingle();
  if (!servico) return [];
  const dur: number = servico.duracao_minutos;

  const { data: vinculos } = await db.from("profissional_servicos").select("profissional_id").eq("servico_id", servicoId);
  let ids = (vinculos ?? []).map((v) => v.profissional_id as string);
  if (profissionalId) ids = ids.filter((id) => id === profissionalId);
  if (ids.length === 0) return [];

  const { data: ativos } = await db.from("profissionais").select("id").in("id", ids).eq("ativo", true);
  ids = (ativos ?? []).map((p) => p.id as string);
  if (ids.length === 0) return [];

  const diaSemana = new Date(`${data}T12:00:00`).getDay();
  const [exp, ocup, blq] = await Promise.all([
    db.from("expediente").select("profissional_id,abertura,fechamento").in("profissional_id", ids).eq("dia_semana", diaSemana).eq("ativo", true),
    db.from("agendamentos").select("profissional_id,horario_inicio,horario_fim").in("profissional_id", ids).eq("data", data).neq("status", "cancelado"),
    db.from("bloqueios").select("profissional_id,horario_inicio,horario_fim").in("profissional_id", ids).eq("data", data),
  ]);

  const mapa = new Map<string, string[]>();
  for (const e of exp.data ?? []) {
    const ocupados = [...(ocup.data ?? []), ...(blq.data ?? [])]
      .filter((o) => o.profissional_id === e.profissional_id)
      .map((o) => [toMin(o.horario_inicio), toMin(o.horario_fim)] as const);
    for (let ini = toMin(e.abertura); ini + dur <= toMin(e.fechamento); ini += PASSO_MIN) {
      if (data === hoje.data && ini <= hoje.minutos) continue;
      const fim = ini + dur;
      if (ocupados.some(([a, b]) => ini < b && fim > a)) continue;
      const chave = toHora(ini);
      mapa.set(chave, [...(mapa.get(chave) ?? []), e.profissional_id as string]);
    }
  }
  return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([horario, profissionalIds]) => ({ horario, profissionalIds }));
}
