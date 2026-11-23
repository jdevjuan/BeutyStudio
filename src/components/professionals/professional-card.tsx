import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/home/image-slot";
import type { ProfissionalDemo, ServicoDemo } from "@/lib/data/demo";

export function ProfessionalCard({ p, servicos }: { p: ProfissionalDemo; servicos: ServicoDemo[] }) {
  const lista = servicos.filter((s) => p.servicoIds.includes(s.id));
  return (
    <article className="flex flex-col">
      <ImageSlot label={p.nome} className="aspect-[3/4]" />
      <h2 className="mt-5 text-2xl">{p.nome}</h2>
      <p className="mt-1 text-sm text-dourado">{p.especialidades.join(", ")}</p>
      <p className="mt-3 text-sm leading-relaxed text-marrom">{p.descricao}</p>
      <div className="mt-4">
        <h3 className="font-sans text-sm font-medium">Serviços realizados</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {lista.map((s) => (
            <li key={s.id} className="rounded-full border border-bege bg-white px-3 py-1 text-xs text-marrom">{s.nome}</li>
          ))}
        </ul>
      </div>
      <Button asChild variant="outline" className="mt-6">
        <Link href={`/agendamento?profissional=${p.id}`}>Agendar com {p.nome}</Link>
      </Button>
    </article>
  );
}
