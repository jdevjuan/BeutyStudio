import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { getCatalogo } from "@/services/catalogo";

export const metadata: Metadata = {
  title: "Profissionais",
  description: "Conheça a equipe do salão, suas especialidades e os serviços que cada profissional realiza.",
};
export const dynamic = "force-dynamic";

export default async function ProfissionaisPage() {
  const { profissionais, servicos, configurado } = await getCatalogo();
  return (
    <>
      <PageHeader
        title="Profissionais"
        description={configurado ? "Conheça a equipe." : "Perfis de demonstração. Nomes e fotos reais serão cadastrados depois."}
      />
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {profissionais.map((p) => (
            <ProfessionalCard key={p.id} p={p} servicos={servicos} />
          ))}
        </div>
      </section>
    </>
  );
}
