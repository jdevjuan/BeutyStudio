import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { whatsappLink } from "@/lib/config/site";

type Dados = {
  servico?: string | null;
  profissional?: string | null;
  data?: string | null;
  horario?: string | null;
};

/** Monta o link wa.me com os dados já escolhidos. Não confirma agendamento. */
export function linkAgendamentoWhatsApp(d: Dados) {
  const partes = ["Olá! Gostaria de agendar um horário."];
  if (d.servico) partes.push(`Serviço: ${d.servico}`);
  if (d.profissional) partes.push(`Profissional: ${d.profissional}`);
  if (d.data) partes.push(`Data: ${format(parseISO(d.data), "dd/MM/yyyy (EEEE)", { locale: ptBR })}`);
  if (d.horario) partes.push(`Horário: ${d.horario}`);
  return whatsappLink(partes.join("\n"));
}
