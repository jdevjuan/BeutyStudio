import { NextResponse } from "next/server";
import { agendamentoSchema } from "@/lib/validations/agendamento";
import { calcularDisponibilidade } from "@/services/disponibilidade";
import { createServiceClient } from "@/lib/supabase/admin";

const MENSAGENS: Record<string, string> = {
  HORARIO_OCUPADO: "Esse horário acabou de ser reservado. Escolha outro.",
  HORARIO_BLOQUEADO: "Esse horário não está disponível. Escolha outro.",
  FORA_DO_EXPEDIENTE: "Esse horário está fora do expediente.",
  SERVICO_INVALIDO: "Serviço indisponível.",
  PROFISSIONAL_INVALIDO: "Esse profissional não realiza o serviço escolhido.",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = agendamentoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }
  const d = parsed.data;

  // Reconfere a disponibilidade no servidor e escolhe o profissional (caso "qualquer").
  const slots = await calcularDisponibilidade({ servicoId: d.servicoId, profissionalId: d.profissionalId, data: d.data });
  const slot = slots.find((s) => s.horario === d.horario);
  if (!slot) return NextResponse.json({ erro: MENSAGENS.HORARIO_OCUPADO }, { status: 409 });
  const profissionalId = d.profissionalId ?? slot.profissionalIds[0];

  const db = createServiceClient();
  const { data, error } = await db.rpc("criar_agendamento", {
    p_nome: d.nome,
    p_telefone: d.telefone,
    p_profissional: profissionalId,
    p_servico: d.servicoId,
    p_data: d.data,
    p_inicio: d.horario,
  });

  if (error) {
    const codigo = Object.keys(MENSAGENS).find((c) => error.message.includes(c));
    if (codigo) return NextResponse.json({ erro: MENSAGENS[codigo] }, { status: 409 });
    return NextResponse.json({ erro: "Não foi possível concluir o agendamento. Tente novamente." }, { status: 500 });
  }
  const { data: prof } = await db.from("profissionais").select("nome").eq("id", profissionalId).maybeSingle();
  return NextResponse.json({ id: data, profissionalNome: prof?.nome ?? "" }, { status: 201 });
}
