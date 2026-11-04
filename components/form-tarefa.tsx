"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { atualizarTarefa, criaTarefas } from "@/app/actions";
import type { Tarefa } from "@/server/store";
import estilos from "./form-tarefa.module.css";

export function FormTarefa({ tarefa }: { tarefa?: Tarefa }) {
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  //evita que se envie várias vezes o formulário enqnto está em andamento
  const [pendente, setPendente] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setTitulo("");
    setDescricao("");
  }, [tarefa]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();

    if (!titulo.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    setPendente(true);
    try {
      const resultado = tarefa
        ? await atualizarTarefa({ id: tarefa.id, titulo, descricao })
        : await criaTarefas({ titulo, descricao: descricao || undefined });

      if (resultado.erro) {
        toast.error(resultado.erro);
        return;
      }
      toast.success(tarefa ? "Tarefa atualizada" : "Tarefa criada");
      router.push("/");
    } finally {
      setPendente(false);
    }
  }

  return (
    <form onSubmit={enviar} className={estilos.form}>
      <label className={estilos.campo}>
        Titulo
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="O que precisa ser feito?"
        />
      </label>
      <label className={estilos.campo}>
        Descricao (opcional)
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </label>
      <div className={estilos.acoes}>
        <button type="submit" disabled={pendente} className={estilos.botao}>
          {pendente ? "Salvando..." : tarefa ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}
