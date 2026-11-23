import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ImageSlot } from "@/components/home/image-slot";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história, o espaço e a proposta de atendimento do salão.",
};

export default function SobrePage() {
  return (
    <>
      <PageHeader title="Sobre o salão" />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <ImageSlot label="ambiente do salão" className="aspect-[4/3]" />
        <div className="space-y-4 leading-relaxed text-marrom">
          <p>Texto provisório. Aqui entrará a história do salão e a proposta de atendimento.</p>
          <p>Atendemos mulheres e homens, com profissionais especializados em diferentes serviços.</p>
        </div>
      </section>
    </>
  );
}
