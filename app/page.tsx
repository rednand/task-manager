import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createCaller } from "@/server/routers/_app";
import { TarefasLista } from "@/components/lista-tarefas";
import estilos from "./page.module.css";

async function Tarefas() {
  await connection();

  //O connection() informa ao Next.js que esse trecho depende de uma requisição real e não deve ser pré-renderizado antecipadamente durante a geração estática.
  //útil quando você precisa buscar dados atualizados durante uma requisição.

  const pagina = await createCaller({}).tasks.list({ limit: 10 });

  return <TarefasLista inicial={pagina} />;
}

export default function Home() {
  return (
    <div className={estilos.pagina}>
      <main className={estilos.principal}>
        <div className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Minhas tarefas</h1>
          <Link href="/tarefas/nova" className={estilos.botaoPrimario}>
            Nova tasks
          </Link>
        </div>
        <Suspense fallback={<p>Carregando tarefas...</p>}>
          <Tarefas />
        </Suspense>
      </main>
    </div>
  );
}
