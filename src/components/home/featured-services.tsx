import Link from "next/link";
import { Scissors, Droplets, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

// DADOS DE DEMONSTRAÇÃO: serão substituídos pelos serviços reais do banco (etapa 5).
const demo = [
  { nome: "Corte feminino", icon: Scissors, desc: "Corte com consultoria de formato e acabamento." },
  { nome: "Corte masculino", icon: Scissors, desc: "Corte na tesoura ou máquina, com finalização." },
  { nome: "Hidratação", icon: Droplets, desc: "Tratamento para recuperar brilho e maciez." },
  { nome: "Coloração", icon: Palette, desc: "Cor personalizada, do tom natural ao mais ousado." },
];

export function FeaturedServices() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl">Serviços em destaque</h2>
        <Button asChild variant="outline" size="sm"><Link href="/servicos">Ver todos os serviços</Link></Button>
      </div>
      <p className="mt-3 text-sm text-marrom">Exemplos de demonstração. Serviços e preços serão editáveis.</p>
      <ul className="mt-10 grid gap-px overflow-hidden rounded-suave border border-bege bg-bege sm:grid-cols-2 lg:grid-cols-4">
        {demo.map(({ nome, icon: Icon, desc }) => (
          <li key={nome} className="bg-offwhite p-6">
            <Icon size={22} strokeWidth={1.25} className="text-dourado" />
            <h3 className="mt-5 text-xl">{nome}</h3>
            <p className="mt-2 text-sm leading-relaxed text-marrom">{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
