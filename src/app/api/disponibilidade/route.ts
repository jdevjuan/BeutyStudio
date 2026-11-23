import { NextResponse } from "next/server";
import { disponibilidadeSchema } from "@/lib/validations/agendamento";
import { calcularDisponibilidade } from "@/services/disponibilidade";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const parsed = disponibilidadeSchema.safeParse({
    servicoId: sp.get("servicoId"),
    profissionalId: sp.get("profissionalId") || null,
    data: sp.get("data"),
  });
  if (!parsed.success) return NextResponse.json({ erro: "Parâmetros inválidos." }, { status: 400 });
  try {
    const slots = await calcularDisponibilidade(parsed.data);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ erro: "Não foi possível consultar os horários." }, { status: 500 });
  }
}
