import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createCaller } from "@/server/routers/_app";
import { FormTarefa } from "@/components/form-tarefa";
import estilos from "@/app/page.module.css";
import Link from "next/link";

async function Edicao({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const tarefa = await createCaller({})
    .tasks.get({ id })
    .catch(() => null);
  if (!tarefa) notFound();

  return <FormTarefa tarefa={tarefa} />;
}

export default function EditarTarefa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className={estilos.pagina}>
      <main className={estilos.principal}>
        <h1 className={estilos.titulo}>Editar tarefa</h1>
        <Link href="/">Voltar</Link>
        <Suspense fallback={<p>Carregando tarefa...</p>}>
          <Edicao params={params} />
        </Suspense>
      </main>
    </div>
  );
}
