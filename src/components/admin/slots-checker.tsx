"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Op = { id: string; nome: string };

export function SlotsChecker({ servicos, profissionais }: { servicos: Op[]; profissionais: Op[] }) {
  const [servicoId, setServicoId] = useState(servicos[0]?.id ?? "");
  const [profId, setProfId] = useState("");
  const [data, setData] = useState("");
  const [res, setRes] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function consultar() {
    setMsg(null); setRes(null);
    if (!servicoId || !data) return setMsg("Escolha serviço e data.");
    const qs = new URLSearchParams({ servicoId, data, ...(profId ? { profissionalId: profId } : {}) });
    const r = await fetch(`/api/disponibilidade?${qs}`);
    const j = await r.json();
    if (!r.ok) return setMsg(j.erro);
    setRes(j.slots.map((s: { horario: string }) => s.horario));
  }

  const campo = "h-10 rounded-suave border border-bege bg-white px-3 text-sm";
  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <select aria-label="Serviço" value={servicoId} onChange={(e) => setServicoId(e.target.value)} className={campo}>
          {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>
        <select aria-label="Profissional" value={profId} onChange={(e) => setProfId(e.target.value)} className={campo}>
          <option value="">Qualquer profissional</option>
          {profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <input aria-label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} className={campo} />
        <Button size="sm" onClick={consultar}>Consultar</Button>
      </div>
      {msg && <p className="mt-3 text-sm text-red-700">{msg}</p>}
      {res && <p className="mt-3 text-sm text-marrom">{res.length ? `Livres: ${res.join(", ")}` : "Nenhum horário livre."}</p>}
    </div>
  );
}
