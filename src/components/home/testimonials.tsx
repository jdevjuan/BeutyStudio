// DEPOIMENTOS DE DEMONSTRAÇÃO: não são de clientes reais.
const demo = [1, 2, 3].map((n) => ({
  id: n,
  texto: "Depoimento de exemplo. Será substituído por avaliações reais de clientes.",
  autor: "Cliente (exemplo)",
}));

export function Testimonials() {
  return (
    <section className="bg-bege/50">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="text-3xl sm:text-4xl">O que dizem sobre nós</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {demo.map((d) => (
            <li key={d.id}>
              <blockquote className="border-l-2 border-dourado pl-5">
                <p className="font-serif text-lg leading-relaxed">{d.texto}</p>
                <footer className="mt-3 text-sm text-marrom">{d.autor}</footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
