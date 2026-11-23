import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-grafite text-offwhite">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
        <h2 className="text-3xl sm:text-4xl">Pronto para cuidar do seu cabelo?</h2>
        <p className="mt-4 text-bege/80">Escolha o serviço e veja os horários disponíveis.</p>
        <Button asChild size="lg" className="mt-8 bg-offwhite text-grafite hover:bg-bege">
          <Link href="/agendamento">Agendar horário</Link>
        </Button>
      </div>
    </section>
  );
}
