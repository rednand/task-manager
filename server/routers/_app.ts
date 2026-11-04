import { createCallerFactory, router } from "../trpc";
import { tarefaRouter } from "./tarefa";

export const appRouter = router({
  tasks: tarefaRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
