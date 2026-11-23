/**
 * Configuração central do site.
 * O salão ainda não tem nome: altere SOMENTE aqui quando for definido.
 */
export const siteConfig = {
  name: "Nome do Salão", // PROVISÓRIO
  tagline: "Cabelo, cuidado e tempo para você.",
  description:
    "Salão de beleza com atendimento feminino e masculino. Escolha o serviço, o profissional e agende online.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  address: "Endereço a definir",
  hours: "Horário de funcionamento a definir",
  nav: [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Serviços", href: "/servicos" },
    { label: "Profissionais", href: "/profissionais" },
    { label: "Galeria", href: "/galeria" },
    { label: "Agendamento", href: "/agendamento" },
    { label: "Contato", href: "/contato" },
  ],
} as const;

export function whatsappLink(message?: string) {
  if (!siteConfig.whatsapp) return "/contato";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${siteConfig.whatsapp}${text}`;
}
