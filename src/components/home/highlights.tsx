import { CalendarCheck, Users, Scissors } from "lucide-react";

const itens = [
  { icon: Scissors, titulo: "Mulheres e homens", texto: "Serviços para todos os estilos." },
  { icon: Users, titulo: "Escolha o profissional", texto: "Veja quem atende cada serviço." },
  { icon: CalendarCheck, titulo: "Agendamento online", texto: "Reserve o horário em poucos passos." },
];

export function Highlights() {
  return (
    <section className="border-y border-bege bg-white">
      <ul className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-3">
        {itens.map(({ icon: Icon, titulo, texto }) => (
          <li key={titulo} className="flex items-start gap-4">
            <Icon size={22} strokeWidth={1.25} className="mt-0.5 text-dourado" />
            <div>
              <h2 className="font-sans text-sm font-medium">{titulo}</h2>
              <p className="mt-0.5 text-sm text-marrom">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
