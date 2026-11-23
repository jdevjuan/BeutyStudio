import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "./image-slot";

// DADOS DE DEMONSTRAÇÃO
const demo = ["Profissional 1", "Profissional 2", "Profissional 3"];

export function Team() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="text-3xl sm:text-4xl">Nossos profissionais</h2>
        <p className="mt-3 text-sm text-marrom">Perfis de demonstração. Nomes e fotos reais serão cadastrados depois.</p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {demo.map((nome) => (
            <li key={nome}>
              <ImageSlot label={nome} className="aspect-[3/4]" />
              <h3 className="mt-4 text-xl">{nome}</h3>
              <p className="text-sm text-marrom">Especialidades a definir</p>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-10"><Link href="/profissionais">Conhecer a equipe</Link></Button>
      </div>
    </section>
  );
}
