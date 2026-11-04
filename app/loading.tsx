import estilos from "./loading.module.css";

export default function Loading() {
  return (
    <div className={estilos.carregando}>
      <div className={estilos.circulo} />
    </div>
  );
}
