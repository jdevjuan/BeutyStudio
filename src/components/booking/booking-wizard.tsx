"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDuracao, formatPreco } from "@/lib/utils/format";
import { linkAgendamentoWhatsApp } from "@/lib/utils/whatsapp";
import { dadosClienteSchema, type DadosCliente } from "@/lib/validations/agendamento";
import type { ProfissionalDemo, ServicoDemo } from "@/lib/data/demo";

type Slot = { horario: string; profissionalIds: string[] };
type Props = {
  servicos: ServicoDemo[];
  profissionais: ProfissionalDemo[];
  servicoInicial?: string;
  profissionalInicial?: string;
};

const hojeISO = () => new Date().toLocaleDateString("sv-SE");

function Opcao({ ativa, onClick, children }: { ativa: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativa}
      onClick={onClick}
      className={cn(
        "rounded-suave border p-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado",
        ativa ? "border-grafite bg-grafite text-offwhite" : "border-bege bg-white hover:border-grafite"
      )}
    >
      {children}
    </button>
  );
}

export function BookingWizard({ servicos, profissionais, servicoInicial, profissionalInicial }: Props) {
  const [servicoId, setServicoId] = useState<string | null>(servicos.some((s) => s.id === servicoInicial) ? servicoInicial! : null);
  const [profId, setProfId] = useState<string | null>(profissionais.some((p) => p.id === profissionalInicial) ? profissionalInicial! : null);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [tick, setTick] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [revisao, setRevisao] = useState<DadosCliente | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState<{ profissionalNome: string } | null>(null);

  const servico = servicos.find((s) => s.id === servicoId);
  const profissionaisDoServico = profissionais.filter((p) => servicoId && p.servicoIds.includes(servicoId));
  const slotAtual = slots?.find((s) => s.horario === horario);
  const profEscolhido = profissionais.find((p) => p.id === (profId ?? slotAtual?.profissionalIds[0]));

  const form = useForm<DadosCliente>({ resolver: zodResolver(dadosClienteSchema), defaultValues: { nome: "", telefone: "" } });

  useEffect(() => {
    setSlots(null);
    setHorario(null);
    if (!servicoId || !data) return;
    const ctrl = new AbortController();
    setCarregando(true);
    setErro(null);
    const qs = new URLSearchParams({ servicoId, data, ...(profId ? { profissionalId: profId } : {}) });
    fetch(`/api/disponibilidade?${qs}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.erro);
        setSlots(j.slots);
      })
      .catch((e) => e.name !== "AbortError" && setErro(e.message || "Erro ao consultar horários."))
      .finally(() => setCarregando(false));
    return () => ctrl.abort();
  }, [servicoId, profId, data, tick]);

  async function confirmar() {
    if (!revisao || !servicoId || !horario) return;
    setEnviando(true);
    setErro(null);
    try {
      const r = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...revisao, servicoId, profissionalId: profId, data, horario }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErro(j.erro);
        if (r.status === 409) { setRevisao(null); setHorario(null); setTick((t) => t + 1); }
        return;
      }
      setSucesso({ profissionalNome: j.profissionalNome });
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso && servico) {
    return (
      <div role="status" className="rounded-suave border border-bege bg-white p-8 text-center">
        <CheckCircle2 size={40} strokeWidth={1.25} className="mx-auto text-dourado" />
        <h2 className="mt-4 text-3xl">Solicitação recebida</h2>
        <p className="mt-3 text-sm leading-relaxed text-marrom">
          {servico.nome} com {sucesso.profissionalNome} em {format(parseISO(data), "dd/MM/yyyy", { locale: ptBR })} às {horario}.
          Seu horário está reservado como <strong>pendente</strong> e será confirmado pelo salão.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <a href={linkAgendamentoWhatsApp({ servico: servico.nome, profissional: sucesso.profissionalNome, data, horario })} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> Avisar o salão pelo WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  const bloco = "rounded-suave border border-bege bg-offwhite p-6";
  const titulo = "mb-4 font-serif text-2xl";

  return (
    <div className="space-y-6">
      <section className={bloco}>
        <h2 className={titulo}>1. Serviço</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {servicos.map((s) => (
            <Opcao key={s.id} ativa={servicoId === s.id} onClick={() => { setServicoId(s.id); setProfId(null); setRevisao(null); }}>
              <span className="block font-medium">{s.nome}</span>
              <span className="mt-1 block opacity-80">{formatPreco(s.preco)} · {formatDuracao(s.duracaoMinutos)}</span>
            </Opcao>
          ))}
        </div>
      </section>

      {servico && (
        <section className={bloco}>
          <h2 className={titulo}>2. Profissional</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Opcao ativa={profId === null} onClick={() => setProfId(null)}>Qualquer profissional disponível</Opcao>
            {profissionaisDoServico.map((p) => (
              <Opcao key={p.id} ativa={profId === p.id} onClick={() => setProfId(p.id)}>{p.nome}</Opcao>
            ))}
          </div>
        </section>
      )}

      {servico && (
        <section className={bloco}>
          <h2 className={titulo}>3. Data e horário</h2>
          <label className="block text-sm text-marrom" htmlFor="data">Escolha a data</label>
          <input
            id="data" type="date" min={hojeISO()} value={data}
            onChange={(e) => { setData(e.target.value); setRevisao(null); }}
            className="mt-2 h-11 w-full rounded-suave border border-bege bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado sm:w-60"
          />
          {carregando && <p className="mt-4 flex items-center gap-2 text-sm text-marrom"><Loader2 size={16} className="animate-spin" /> Consultando horários...</p>}
          {slots && slots.length === 0 && <p className="mt-4 text-sm text-marrom">Não há horários livres nesta data. Tente outro dia.</p>}
          {slots && slots.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {slots.map((s) => (
                <Opcao key={s.horario} ativa={horario === s.horario} onClick={() => { setHorario(s.horario); setRevisao(null); }}>
                  <span className="block text-center">{s.horario}</span>
                </Opcao>
              ))}
            </div>
          )}
        </section>
      )}

      {horario && !revisao && (
        <section className={bloco}>
          <h2 className={titulo}>4. Seus dados</h2>
          <form onSubmit={form.handleSubmit(setRevisao)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="nome" className="text-sm text-marrom">Nome completo</label>
              <input id="nome" autoComplete="name" {...form.register("nome")} className="mt-1 h-11 w-full rounded-suave border border-bege bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado" />
              {form.formState.errors.nome && <p role="alert" className="mt-1 text-sm text-red-700">{form.formState.errors.nome.message}</p>}
            </div>
            <div>
              <label htmlFor="telefone" className="text-sm text-marrom">Telefone com DDD</label>
              <input id="telefone" type="tel" autoComplete="tel" placeholder="(88) 90000-0000" {...form.register("telefone")} className="mt-1 h-11 w-full rounded-suave border border-bege bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado" />
              {form.formState.errors.telefone && <p role="alert" className="mt-1 text-sm text-red-700">{form.formState.errors.telefone.message}</p>}
            </div>
            <Button type="submit">Revisar agendamento</Button>
          </form>
        </section>
      )}

      {revisao && servico && horario && (
        <section className={bloco}>
          <h2 className={titulo}>5. Revisar e confirmar</h2>
          <dl className="space-y-2 text-sm">
            {[
              ["Serviço", `${servico.nome} (${formatPreco(servico.preco)})`],
              ["Profissional", profId ? profEscolhido?.nome : "Qualquer disponível"],
              ["Data", format(parseISO(data), "dd/MM/yyyy (EEEE)", { locale: ptBR })],
              ["Horário", horario],
              ["Nome", revisao.nome],
              ["Telefone", revisao.telefone],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-bege/70 pb-2"><dt className="text-marrom">{k}</dt><dd className="text-right">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={confirmar} disabled={enviando}>{enviando ? "Confirmando..." : "Confirmar agendamento"}</Button>
            <Button variant="ghost" onClick={() => setRevisao(null)} disabled={enviando}>Editar dados</Button>
            <Button asChild variant="outline">
              <a href={linkAgendamentoWhatsApp({ servico: servico.nome, profissional: profEscolhido?.nome, data, horario })} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Pedir pelo WhatsApp
              </a>
            </Button>
          </div>
        </section>
      )}

      {erro && <p role="alert" className="rounded-suave border border-red-300 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
    </div>
  );
}
