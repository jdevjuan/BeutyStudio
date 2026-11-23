import Link from "next/link";
import { siteConfig, whatsappLink } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "./image-slot";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-12 md:py-24">
      <div className="animar-entrada md:col-span-6">
        <h1 className="text-4xl leading-[1.1] text-grafite sm:text-5xl lg:text-6xl">
          {siteConfig.tagline}
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-marrom">
          Escolha o serviço, o profissional e o melhor horário. Atendimento para mulheres e homens.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/agendamento">Agendar horário</Link></Button>
          <Button asChild size="lg" variant="outline">
            <a href={whatsappLink("Olá! Gostaria de agendar um horário.")} target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
      <ImageSlot label="banner principal do salão" className="aspect-[4/5] md:col-span-6" />
    </section>
  );
}
