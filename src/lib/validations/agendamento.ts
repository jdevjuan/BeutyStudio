import { z } from "zod";

export const dadosClienteSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(120),
  telefone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "Informe um telefone válido com DDD"),
});

export const agendamentoSchema = dadosClienteSchema.extend({
  servicoId: z.string().uuid(),
  profissionalId: z.string().uuid().nullable(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  horario: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
});

export const disponibilidadeSchema = z.object({
  servicoId: z.string().uuid(),
  profissionalId: z.string().uuid().nullable(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type DadosCliente = z.input<typeof dadosClienteSchema>;
