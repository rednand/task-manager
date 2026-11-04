This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Sobre o Aplicativo Web Gerenciador de Tarefas 

# Gerenciador de Tarefas

Aplicação de gerenciamento de tarefas desenvolvida com Next.js (App Router), utilizando tRPC para a comunicação com a camada de backend e armazenamento em memória.

## Tecnologias

- Next.js 15 (App Router)
- React
- TypeScript
- tRPC
- CSS Modules

## Como executar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para executar em produção:

```bash
npm run build
npm start
```

## Arquitetura e funcionamento

- `server/store.ts`: armazenamento das tarefas em memória, utilizando `globalThis` para preservar os dados durante hot reload em desenvolvimento e também para gerar tarefas ficticias para testar o infinite scroll. Os dados são perdidos ao reiniciar o servidor.
- `server/trpc.ts`:arquivo responsável pela configuração do tRPC no backend. Funciona como uma base que será reutilizada na criação dos routers e procedures da aplicação.
- `server/routers/tarefa.ts`: onde está concentrada a lógica de negócio das tarefas no backend. Usa o tRPC para organizar os endpoints e o TRPCError para padronizar os erros. PublicProcedure serve como base para criar os endpoints (nao autenticados)
- `server/routers/_app.ts`: ponto central de organização dos routers do tRPC. createCallerFactory possibilita fazer chamadas diretas aos procedimentos do tRPC dentro do servidor, sem precisar passar por uma requisição HTTP.

- `app/api/trpc/[trpc]/route.ts`: disponibiliza o adaptador HTTP do tRPC por meio da rota `/api/trpc`.
- `app/actions.ts`: define Server Actions para operações de criação, atualização, exclusão e listagem, integrando os componentes do cliente aos procedimentos tRPC.
- `app/page.tsx`: Server Component responsável pela renderização inicial e busca dos dados diretamente pelo `createCaller`, sem necessidade de uma requisição HTTP interna.
- `components/lista-tarefas.tsx`: Client Component responsável pela exibição das tarefas, paginação infinita, detecção de scroll e exclusão.
- `components/form-tarefa.tsx`: formulário reutilizável para criação e edição, com validação no cliente e tratamento de erros retornados pelo backend.

## Decisões técnicas

- **Next.js 15:** utilizada a versão instalada pelo `create-next-app`, superior à versão 15 solicitada.
- **Server Components e Client Components:** separação entre busca inicial de dados no servidor e interações que exigem execução no navegador.
- **tRPC:** utilização de procedimentos tipados para organizar as operações do backend e compartilhar os tipos entre cliente e servidor.
- **createCaller:** chamadas diretas aos procedimentos tRPC nos Server Components, evitando requisições HTTP desnecessárias dentro do próprio servidor.
- **Paginação por cursor:** utilização de offset para carregar tarefas em páginas de 10 registros, exibindo as mais recentes primeiro.
- **Timestamp numérico:** `dataCriacao` armazenado em milissegundos, dispensando o uso de transformers como SuperJSON.

## Limitações

O armazenamento é feito exclusivamente em memória, sem persistência em banco de dados. Portanto, os dados são perdidos ao reiniciar o servidor e não há garantia de compartilhamento entre múltiplas instâncias da aplicação.