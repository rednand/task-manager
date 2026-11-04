import { FormTarefa } from "@/components/form-tarefa";
import estilos from "@/app/page.module.css";
import Link from "next/link";

export default function NovaTarefa() {
  return (
    <div className={estilos.pagina}>
      <main className={estilos.principal}>
        <h1 className={estilos.titulo}>Nova tarefa</h1>
        <Link href="/">Voltar</Link>
        <FormTarefa />
      </main>
    </div>
  );
}
