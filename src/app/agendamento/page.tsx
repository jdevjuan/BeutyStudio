import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getCatalogo } from "@/services/catalogo";
import { whatsappLink } from "@/lib/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Agendamento",
  description: "Escolha o serviço, o profissional, a data e o horário e agende online.",
};
export const dynamic = "force-dynamic";

export default async function AgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ servico?: string; profissional?: string }>;
}) {
  const { servico, profissional } = await searchParams;
  const catalogo = await getCatalogo();

  return (
    <>
      <PageHeader title="Agendamento" description="Reserve seu horário em poucos passos." />
      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        {catalogo.configurado ? (
          <BookingWizard
            servicos={catalogo.servicos}
            profissionais={catalogo.profissionais}
            servicoInicial={servico}
            profissionalInicial={profissional}
          />
        ) : (
          <div className="rounded-suave border border-bege bg-white p-8">
            <h2 className="text-2xl">Agendamento online indisponível</h2>
            <p className="mt-3 text-sm leading-relaxed text-marrom">
              O banco de dados ainda não foi configurado. Enquanto isso, você pode solicitar um horário pelo WhatsApp.
            </p>
            <Button asChild className="mt-6">
              <a href={whatsappLink("Olá! Gostaria de agendar um horário.")} target="_blank" rel="noopener noreferrer">
                Solicitar pelo WhatsApp
              </a>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
