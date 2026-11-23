import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuracao, formatPreco } from "@/lib/utils/format";
import type { ServicoDemo } from "@/lib/data/demo";

export function ServiceCard({ servico }: { servico: ServicoDemo }) {
  return (
    <article className="flex flex-col justify-between rounded-suave border border-bege bg-white p-6 transition-colors hover:border-dourado/60">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl">{servico.nome}</h2>
          <p className="shrink-0 font-medium text-grafite">{formatPreco(servico.preco)}</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-marrom">{servico.descricao}</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-marrom">
          <Clock size={16} strokeWidth={1.5} /> {formatDuracao(servico.duracaoMinutos)}
        </p>
      </div>
      <Button asChild variant="outline" className="mt-6 w-full">
        <Link href={`/agendamento?servico=${servico.id}`}>Agendar este serviço</Link>
      </Button>
    </article>
  );
}
