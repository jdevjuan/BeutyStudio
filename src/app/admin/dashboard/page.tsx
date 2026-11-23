import type { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { Button } from "@/components/ui/button";
import { SlotsChecker } from "@/components/admin/slots-checker";
import { alterarStatus, salvarServico, sair } from "./actions";
import { formatPreco } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Painel administrativo", robots: { index: false } };
export const dynamic = "force-dynamic";

type Linha = {
  id: string; data: string; horario_inicio: string; status: string;
  clientes: { nome: string; telefone: string } | null;
  profissionais: { nome: string } | null;
  servicos: { nome: string } | null;
};

const cor: Record<string, string> = {
  pendente: "bg-bege text-grafite",
  confirmado: "bg-green-100 text-green-900",
  cancelado: "bg-red-100 text-red-900",
};

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const hoje = new Date().toLocaleDateString("sv-SE");

  const [ag, sv, pf] = await Promise.all([
    supabase.from("agendamentos")
      .select("id,data,horario_inicio,status,clientes(nome,telefone),profissionais(nome),servicos(nome)")
      .gte("data", hoje).order("data").order("horario_inicio").returns<Linha[]>(),
    supabase.from("servicos").select("*").order("nome"),
    supabase.from("profissionais").select("id,nome").order("nome"),
  ]);

  const campo = "h-9 rounded-suave border border-bege bg-white px-2 text-sm";
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Painel administrativo</h1>
        <form action={sair}><Button variant="outline" size="sm" type="submit">Sair</Button></form>
      </div>

      <section aria-labelledby="h-ag">
        <h2 id="h-ag" className="text-2xl">Próximos agendamentos</h2>
        {ag.data?.length ? (
          <div className="mt-4 overflow-x-auto rounded-suave border border-bege bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-bege text-marrom"><tr>
                <th className="p-3">Data</th><th className="p-3">Cliente</th><th className="p-3">Serviço</th><th className="p-3">Profissional</th><th className="p-3">Status</th><th className="p-3">Ações</th>
              </tr></thead>
              <tbody>
                {ag.data.map((a) => (
                  <tr key={a.id} className="border-b border-bege/60 last:border-0">
                    <td className="p-3">{format(parseISO(a.data), "dd/MM")} {a.horario_inicio.slice(0, 5)}</td>
                    <td className="p-3">{a.clientes?.nome}<br /><span className="text-marrom">{a.clientes?.telefone}</span></td>
                    <td className="p-3">{a.servicos?.nome}</td>
                    <td className="p-3">{a.profissionais?.nome}</td>
                    <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs ${cor[a.status]}`}>{a.status}</span></td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {a.status !== "confirmado" && (
                          <form action={alterarStatus}><input type="hidden" name="id" value={a.id} /><input type="hidden" name="status" value="confirmado" /><Button size="sm" type="submit">Confirmar</Button></form>
                        )}
                        {a.status !== "cancelado" && (
                          <form action={alterarStatus}><input type="hidden" name="id" value={a.id} /><input type="hidden" name="status" value="cancelado" /><Button size="sm" variant="outline" type="submit">Cancelar</Button></form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-marrom">Nenhum agendamento futuro.</p>
        )}
      </section>

      <section aria-labelledby="h-hr">
        <h2 id="h-hr" className="text-2xl">Horários disponíveis</h2>
        <div className="mt-4"><SlotsChecker servicos={(sv.data ?? []).filter((s) => s.ativo).map((s) => ({ id: s.id, nome: s.nome }))} profissionais={pf.data ?? []} /></div>
      </section>

      <section aria-labelledby="h-sv">
        <h2 id="h-sv" className="text-2xl">Serviços</h2>
        <ul className="mt-4 space-y-3">
          {(sv.data ?? []).map((s) => (
            <li key={s.id}>
              <form action={salvarServico} className="flex flex-wrap items-center gap-2 rounded-suave border border-bege bg-white p-3">
                <input type="hidden" name="id" value={s.id} />
                <input name="nome" defaultValue={s.nome} aria-label="Nome" className={`${campo} w-44`} />
                <input name="descricao" defaultValue={s.descricao} aria-label="Descrição" className={`${campo} min-w-48 flex-1`} />
                <input name="preco" type="number" step="0.01" defaultValue={Number(s.preco)} aria-label="Preço" className={`${campo} w-24`} title={formatPreco(Number(s.preco))} />
                <input name="duracao_minutos" type="number" defaultValue={s.duracao_minutos} aria-label="Duração em minutos" className={`${campo} w-20`} />
                <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="ativo" defaultChecked={s.ativo} /> Ativo</label>
                <Button size="sm" type="submit">Salvar</Button>
              </form>
            </li>
          ))}
        </ul>
        <form action={salvarServico} className="mt-6 flex flex-wrap items-center gap-2 rounded-suave border border-dashed border-marrom/40 p-3">
          <span className="text-sm text-marrom">Novo serviço:</span>
          <input name="nome" required placeholder="Nome" aria-label="Nome do novo serviço" className={`${campo} w-44`} />
          <input name="descricao" placeholder="Descrição" aria-label="Descrição" className={`${campo} min-w-48 flex-1`} />
          <input name="preco" type="number" step="0.01" required placeholder="Preço" aria-label="Preço" className={`${campo} w-24`} />
          <input name="duracao_minutos" type="number" required placeholder="Min" aria-label="Duração" className={`${campo} w-20`} />
          <Button size="sm" type="submit">Adicionar</Button>
        </form>
        <p className="mt-3 text-xs text-marrom">Para vincular um novo serviço a um profissional, use o Table Editor do Supabase (tabela profissional_servicos).</p>
      </section>
    </div>
  );
}
