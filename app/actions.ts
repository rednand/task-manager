"use server";

import { TRPCError } from "@trpc/server";
import { createCaller } from "@/server/routers/_app";
import { revalidatePath } from "next/cache";

export interface Resultado { erro?: string };

//funcao reutilizavel para executar uma operação e tratar erros
async function genericExecution(
  operacao: () => Promise<unknown>,
  atualizarTela = true,
): Promise<Resultado> {
  try {
    await operacao();
    //se true volta para a tela inicial, se false nao faz nada, pois a lista de tarefas será atualizada pelo componente TarefasLista
    if (atualizarTela) {
      revalidatePath("/");
    }
    return {};
  } catch (erro) {
    //tratamento de erro específico do tRPC, retornando a mensagem de erro para o cliente
    if (erro instanceof TRPCError) return { erro: erro.message };
    throw erro;
  }
}

export async function criaTarefas(dados: {
  titulo: string;
  descricao?: string;
}) {
  return genericExecution(() => createCaller({}).tasks.create(dados));
}

export async function atualizarTarefa(dados: {
  id: string;
  titulo: string;
  descricao?: string;
}) {
  return genericExecution(() => createCaller({}).tasks.update(dados));
}

export async function deletaTarefa(id: string) {
  //nao precisa do atualizarTela, pois a lista de tarefas será atualizada pelo componente TarefasLista
  //evita chamar dados no servidor
  return genericExecution(() => createCaller({}).tasks.delete({ id }), false);
}

//usada pro carreagmento infinito, para buscar a próxima página de tarefas baseado no cursor
//const pagina = await listarTarefas(proximo);
//setProximo(pagina.proximoCursor);
export async function listarTarefas(cursor: number) {
  return createCaller({}).tasks.list({ cursor, limit: 10 });
}
