# Beauty Studio

Protótipo de site para salão de beleza, com apresentação de serviços e profissionais, galeria, agendamento online, integração com WhatsApp e painel administrativo.

> O salão ainda não tem nome definido. O nome exibido ("Nome do Salão") é provisório e fica em um único arquivo: `src/lib/config/site.ts`.

## Funcionalidades

- Páginas: início, sobre, serviços, profissionais, galeria e contato.
- Agendamento online em etapas: serviço, profissional (ou qualquer disponível), data, horário, dados do cliente, revisão e confirmação.
- Horários calculados no servidor, considerando duração do serviço, expediente de cada profissional, agendamentos existentes e bloqueios.
- Proteção contra reservas simultâneas no próprio banco de dados.
- Integração com WhatsApp por links `wa.me`, com mensagem preenchida. Pedir pelo WhatsApp não equivale a um agendamento confirmado.
- Painel administrativo com login: confirmar e cancelar agendamentos, consultar horários livres e editar serviços (nome, descrição, preço, duração e status).
- Sem banco configurado, o site abre com dados de demonstração e o agendamento online fica desativado.

## Tecnologias

- Next.js 15 (App Router), React 19 e TypeScript
- Tailwind CSS, Lucide React e componentes no padrão shadcn/ui
- Supabase: PostgreSQL, Auth e Row Level Security
- React Hook Form, Zod e date-fns
- Hospedagem: Vercel

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS) e Git.

```bash
npm install
```

Crie o arquivo de variáveis de ambiente:

```bash
# Windows (PowerShell)
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Preencha o `.env.local` (veja a tabela abaixo) e inicie:

```bash
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

| Variável | Descrição | Pública? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto no Supabase (termina em `.supabase.co`, sem `/rest/v1/`) | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon ou publishable | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role ou secret. Usada só no servidor | **Não. Nunca expor** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número só com dígitos, com 55 + DDD. Opcional | Sim |

Sem aspas e sem espaço depois do `=`. O arquivo `.env.local` está no `.gitignore` e não deve ser enviado ao GitHub.

## Configuração do banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode `supabase/schema.sql`.
3. Rode as permissões de acesso às tabelas (necessárias em projetos novos do Supabase):

   ```sql
   grant usage on schema public to anon, authenticated, service_role;
   grant select on servicos, profissionais, profissional_servicos, expediente to anon, authenticated;
   grant select, insert, update, delete on all tables in schema public to authenticated;
   grant all on all tables in schema public to service_role;
   grant all on all sequences in schema public to service_role;
   ```

4. (Opcional) Rode `supabase/seed-demo.sql` para carregar serviços, profissionais e expediente de exemplo. Rode **uma vez só**, para não duplicar os dados.
5. Em **Authentication > Users**, crie o usuário administrador.
6. Autorize esse usuário como administrador:

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'SEU_EMAIL_AQUI';
   ```

## Painel administrativo

Acesse `/admin/login` com o usuário autorizado. Profissionais, expediente e bloqueios de horário são editados diretamente no **Table Editor** do Supabase (tabelas `profissionais`, `profissional_servicos`, `expediente` e `bloqueios`).
