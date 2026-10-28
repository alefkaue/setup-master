# Setup Master

Interface React/TypeScript com autenticação, dashboard, parceiros e administração; integrações Supabase dependem de configuração.

**Área do portfólio:** [Desenvolvimento de Software](https://github.com/alefkaue#desenvolvimento-de-software) · **Contexto:** Protótipo de interface

## Conteúdo e tecnologias

**Linguagens identificadas:** TypeScript, PLpgSQL, CSS, HTML, JavaScript.

**Pacotes de base:** `react`, `typescript`, `@supabase/supabase-js`, `tailwindcss`.

**Telas/rotas no código:** `src/pages/Admin.tsx`, `src/pages/Auth.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`, `src/pages/NotFound.tsx`, `src/pages/Partner.tsx`.

## Desenvolvimento local

Requer Node.js e npm compatíveis com o `package.json`. Leia o manifesto e revise configurações antes de instalar.

```console
npm install
npm run dev
```

O código referencia Supabase. Telas de autenticação ou persistência dependem da configuração de um ambiente próprio; a revisão não acessou dados nem validou permissões de um projeto remoto.

## Comandos disponíveis

| Comando | Script declarado |
| --- | --- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run lint` | `eslint .` |
| `npm run preview` | `vite preview` |

Scripts listados foram verificados no manifesto; não foram reexecutados nesta revisão documental. Não há script `test` declarado neste snapshot.

## Contexto e limites

Protótipo de estudo, com base de interface gerada/assistida pelo Lovable quando registrado no histórico. A documentação descreve os arquivos, sem afirmar produto comercial, clientes, resultados de saúde/finanças ou domínio individual de todo o código.

Credenciais não pertencem ao README. Configure serviços com valores próprios e revise arquivos de ambiente antes de qualquer divulgação; esta revisão não leu ou publicou valores de `.env`.
