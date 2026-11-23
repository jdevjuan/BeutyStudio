/**
 * DADOS DE DEMONSTRAÇÃO.
 * Não representam preços, serviços ou pessoas reais do salão.
 * Na etapa 5 serão substituídos por dados do Supabase.
 */
export type ServicoDemo = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
};

export type ProfissionalDemo = {
  id: string;
  nome: string;
  descricao: string;
  especialidades: string[];
  servicoIds: string[];
};

export const servicosDemo: ServicoDemo[] = [
  { id: "corte-feminino", nome: "Corte feminino", descricao: "Corte com análise do formato do rosto e finalização.", preco: 90, duracaoMinutos: 60 },
  { id: "corte-masculino", nome: "Corte masculino", descricao: "Corte na tesoura ou máquina, com acabamento.", preco: 50, duracaoMinutos: 40 },
  { id: "escova", nome: "Escova", descricao: "Escova modelada para qualquer ocasião.", preco: 60, duracaoMinutos: 45 },
  { id: "hidratacao", nome: "Hidratação", descricao: "Tratamento para devolver brilho, maciez e elasticidade.", preco: 80, duracaoMinutos: 60 },
  { id: "coloracao", nome: "Coloração", descricao: "Cor personalizada, com cuidado para preservar a saúde dos fios.", preco: 180, duracaoMinutos: 120 },
  { id: "progressiva", nome: "Progressiva", descricao: "Alinhamento dos fios com redução de volume.", preco: 250, duracaoMinutos: 150 },
  { id: "penteado", nome: "Penteado", descricao: "Penteados para festas, eventos e cerimônias.", preco: 120, duracaoMinutos: 75 },
];

export const profissionaisDemo: ProfissionalDemo[] = [
  { id: "prof-1", nome: "Profissional 1", descricao: "Descrição de exemplo da profissional e da sua experiência.", especialidades: ["Cortes", "Coloração"], servicoIds: ["corte-feminino", "coloracao", "hidratacao", "progressiva"] },
  { id: "prof-2", nome: "Profissional 2", descricao: "Descrição de exemplo do profissional e da sua experiência.", especialidades: ["Cortes masculinos", "Barba"], servicoIds: ["corte-masculino", "corte-feminino"] },
  { id: "prof-3", nome: "Profissional 3", descricao: "Descrição de exemplo da profissional e da sua experiência.", especialidades: ["Penteados", "Escova"], servicoIds: ["escova", "penteado", "hidratacao"] },
];

export const categoriasGaleria = ["Todos", "Cortes", "Colorações", "Penteados", "Transformações", "Antes e depois"] as const;

export const galeriaDemo = Array.from({ length: 12 }, (_, i) => {
  const cats = categoriasGaleria.slice(1);
  return { id: i + 1, categoria: cats[i % cats.length] as string };
});
