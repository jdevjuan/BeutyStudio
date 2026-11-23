import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceCard } from "@/components/services/service-card";
import { getCatalogo } from "@/services/catalogo";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Conheça os serviços do salão, com valores e duração estimada de cada procedimento.",
};
export const dynamic = "force-dynamic";

export default async function ServicosPage() {
  const { servicos, configurado } = await getCatalogo();
  return (
    <>
      <PageHeader
        title="Serviços"
        description={configurado ? "Valores e durações estimadas." : "Valores e durações de exemplo, sujeitos a alteração pelo salão."}
      />
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s) => (
            <ServiceCard key={s.id} servico={s} />
          ))}
        </div>
      </section>
    </>
  );
}
