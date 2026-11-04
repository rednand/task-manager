import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { tarefas, type Tarefa } from "../store";

type CriarInput = { titulo: string; descricao?: string };
type AtualizarInput = { id: string; titulo?: string; descricao?: string };
type DeletarInput = { id: string };
type ListarInput = { limit?: number; cursor?: number };

function buscarIndice(id: string) {
  const indice = tarefas.findIndex((t) => t.id === id);
  if (indice === -1) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Tarefa com id "${id}" não encontrada`,
    });
  }
  return indice;
}

export const tarefaRouter = router({
  //endpoint list, que retorna uma pagina de tarefas a partir do cursor
  list: publicProcedure
    .input((valor: unknown) => (valor ?? {}) as ListarInput)
    .query(({ input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor ?? 0;
      const proximo = cursor + limit;
      return {
        itens: tarefas.slice(cursor, proximo),
        proximoCursor: proximo < tarefas.length ? proximo : null,
        total: tarefas.length,
      };
    }),

  //endpoint get, que retorna uma tarefa com o id
  get: publicProcedure
    .input((valor: unknown) => valor as DeletarInput)
    .query(({ input }) => tarefas[buscarIndice(input.id)]),

  //endpoint create, que cria uma nova tarefa
  create: publicProcedure
    .input((valor: unknown) => {
      const dados = valor as CriarInput;
      if (!dados?.titulo?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "O título é obrigatório",
        });
      }
      return dados;
    })
    .mutation(({ input }) => {
      const tarefa: Tarefa = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: Date.now(),
      };
      tarefas.unshift(tarefa);
      return tarefa;
    }),

  //endpoint update, que atualiza uma tarefa com o id
  update: publicProcedure
    .input((valor: unknown) => valor as AtualizarInput)
    .mutation(({ input }) => {
      const tarefa = tarefas[buscarIndice(input.id)];
      if (input.titulo !== undefined) tarefa.titulo = input.titulo;
      if (input.descricao !== undefined) tarefa.descricao = input.descricao;
      return tarefa;
    }),

  //endpoint delete, que deleta uma tarefa com o id
  delete: publicProcedure
    .input((valor: unknown) => valor as DeletarInput)
    .mutation(({ input }) => {
      const [removida] = tarefas.splice(buscarIndice(input.id), 1);
      return removida;
    }),
});
