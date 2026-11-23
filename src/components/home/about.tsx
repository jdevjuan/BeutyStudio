import { ImageSlot } from "./image-slot";

export function About() {
  return (
    <section id="sobre" className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <ImageSlot label="ambiente do salão" className="aspect-[4/3]" />
        <div>
          <h2 className="text-3xl text-grafite sm:text-4xl">Um espaço pensado para você</h2>
          <p className="mt-5 max-w-prose leading-relaxed text-marrom">
            Texto de apresentação provisório. Aqui entrará a história do salão, o estilo de atendimento
            e o que o cliente pode esperar ao chegar.
          </p>
        </div>
      </div>
    </section>
  );
}
