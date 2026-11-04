/*○	Modelagem: Cada tarefa deve ter pelo menos os seguintes campos:
■	id (único, pode ser gerado automaticamente)
■	titulo (string, obrigatório)
■	descricao (string, opcional)
■	dataCriacao (timestamp)
*/

export type Tarefa = {
  id: string;
  titulo: string;
  //descricao opcional
  descricao?: string;
  dataCriacao: number;
};

//memória do tPRC

const globalStore = globalThis as unknown as { tarefas?: Tarefa[] };


//funcao para criar tarefas ficticias e testar o infinite scroll
function gerarTarefasFicticias(): Tarefa[] {
  const agora = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    id: crypto.randomUUID(),
    titulo: `Tarefa fictícia ${i + 1}`,
    descricao: `Descrição da tarefa ${i + 1}`,
    dataCriacao: agora - i * 60_000,
  }));
}

export const tarefas: Tarefa[] = (globalStore.tarefas ??= gerarTarefasFicticias());
