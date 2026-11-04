"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deletaTarefa, listarTarefas } from "@/app/actions";
import type { Tarefa } from "@/server/store";
import estilos from "./lista-tarefas.module.css";
import Loading from "@/app/loading";

const formatDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

type Pagina = {
  itens: Tarefa[];
  proximoCursor: number | null;
  total: number;
};

export function TarefasLista({ inicial }: { inicial: Pagina }) {
  const [tarefas, setTarefas] = useState(inicial.itens);
  const [next, setProximo] = useState(inicial.proximoCursor);
  const [total, setTotal] = useState(inicial.total);
  const [loading, setCarregando] = useState(false);
  //evita requisições simultâneas
  const scrollRef = useRef<HTMLDivElement>(null);
  const [excluindo, setExcluindo] = useState("");

  useEffect(() => {
    setTarefas(inicial.itens);
    setProximo(inicial.proximoCursor);
    setTotal(inicial.total);
  }, [inicial]);

  useEffect(() => {
    const finalDiv = scrollRef.current;
    if (next === null || !finalDiv) return;

    async function loadingMore() {
      if (next === null) return;
      setCarregando(true);
      try {
        const pagina = await listarTarefas(next);
        setTarefas((atuais) => {
          const idsExistentes = new Set(atuais.map((tarefa) => tarefa.id));

          const novasTarefas = pagina.itens.filter(
            (tarefa) => !idsExistentes.has(tarefa.id),
          );

          return [...atuais, ...novasTarefas];
        });
        setProximo(pagina.proximoCursor);
        setTotal(pagina.total);
      } catch {
        toast.error("Erro ao carregar mais tarefas");
      } finally {
        setCarregando(false);
      }
    }

    const observer = new IntersectionObserver(([begin]) => {
      if (begin.isIntersecting) loadingMore();
    });
    observer.observe(finalDiv);
    return () => observer.disconnect();
  }, [next]);

  async function excluir(id: string) {
    setExcluindo(id);
    try {
      const resultado = await deletaTarefa(id);
      if (resultado.erro) {
        toast.error(resultado.erro);
        return;
      }
      setTarefas((atuais) => atuais.filter((t) => t.id !== id));
      setProximo((atual) => (atual === null ? null : atual - 1));
      setTotal((atual) => atual - 1);
      toast.success("Tarefa excluida");
    } finally {
      setExcluindo("");
    }
  }

  return (
    <>
      <h2 className={estilos.cabecalho}>Todas as tarefas ({total})</h2>
      {tarefas.length === 0 && <p className={estilos.vazio}>Nenhuma tarefa</p>}
      <ul className={estilos.lista}>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className={estilos.item}>
            <span className={estilos.texto}>
              {tarefa.titulo}
              {tarefa.descricao && (
                <span className={estilos.descricao}>{tarefa.descricao}</span>
              )}
            </span>
            <span className={estilos.data}>
              {formatDate.format(tarefa.dataCriacao)}
            </span>
            <Link href={`/tarefas/${tarefa.id}`} className={estilos.acao}>
              Editar
            </Link>
            <button
              type="button"
              className={`${estilos.acao} ${estilos.excluir}`}
              disabled={excluindo !== ""}
              onClick={() => excluir(tarefa.id)}
            >
              {excluindo === tarefa.id ? "Excluindo..." : "Excluir"}
            </button>
          </li>
        ))}
      </ul>
      <div ref={scrollRef} />
      {loading && <Loading />}
    </>
  );
}
