import type { Metadata } from "next";
import { Clock, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Telefone, WhatsApp, endereço e horário de funcionamento do salão.",
};

const itens = [
  { icon: Phone, titulo: "Telefone", texto: "A definir" },
  { icon: MapPin, titulo: "Endereço", texto: siteConfig.address },
  { icon: Clock, titulo: "Horário de funcionamento", texto: siteConfig.hours },
  { icon: Instagram, titulo: "Redes sociais", texto: "A definir" },
];

export default function ContatoPage() {
  return (
    <>
      <PageHeader title="Contato" description="Os dados abaixo são provisórios e serão atualizados quando o salão os definir." />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <ul className="space-y-6">
          {itens.map(({ icon: Icon, titulo, texto }) => (
            <li key={titulo} className="flex gap-4">
              <Icon size={22} strokeWidth={1.25} className="mt-0.5 shrink-0 text-dourado" />
              <div>
                <h2 className="font-sans text-sm font-medium">{titulo}</h2>
                <p className="mt-1 text-marrom">{texto}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-suave border border-bege bg-white p-8">
          <MessageCircle size={26} strokeWidth={1.25} className="text-dourado" />
          <h2 className="mt-4 text-2xl">Fale pelo WhatsApp</h2>
          <p className="mt-3 text-sm leading-relaxed text-marrom">
            Envie uma mensagem para pedir um horário. O agendamento só é confirmado após o retorno do salão.
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href={whatsappLink("Olá! Gostaria de agendar um horário.")} target="_blank" rel="noopener noreferrer">
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
